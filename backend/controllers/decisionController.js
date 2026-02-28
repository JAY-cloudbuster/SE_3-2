/**
 * @fileoverview Decision Controller — Module 5: Price Transparency & Decision Support
 *
 * Reads the Mandi CSV into memory on startup, exposes a GET endpoint
 * that performs Time-Series Linear Regression (simple-statistics) on the
 * last 5 price points for a given crop, predicts the next-day and
 * 3-day-out prices, and returns a rule-based sell/wait/hold recommendation.
 *
 * @module controllers/decisionController
 * @requires fs
 * @requires path
 * @requires csv-parser
 * @requires simple-statistics
 * @requires express-async-handler
 */

const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const ss = require('simple-statistics');
const asyncHandler = require('express-async-handler');

// ── In-memory data store ────────────────────────────────────
let mandiData = [];
let dataLoaded = false;

/**
 * Load CSV into memory once on first require / server start.
 * Each row is normalised to { state, commodity, priceDate, modalPrice }.
 */
function loadCSV() {
    return new Promise((resolve, reject) => {
        const rows = [];
        const csvPath = path.join(__dirname, '..', 'data', 'filtered_mandi_data.csv');

        if (!fs.existsSync(csvPath)) {
            console.warn(`[Decision] CSV not found at ${csvPath} — module will return empty results.`);
            dataLoaded = true;
            return resolve();
        }

        fs.createReadStream(csvPath)
            .pipe(csvParser())
            .on('data', (row) => {
                // The CSV headers are:
                // New format: Commodity, Price Date, Modal Price
                // Older format: ... Modal Price (Rs./Quintal), Price Date, State
                const commodity = (row['Commodity'] || '').trim();
                const state = (row['State'] || 'ALL').trim();
                const priceStr = row['Modal Price'] ?? row['Modal Price (Rs./Quintal)'];
                const dateStr = (row['Price Date'] || '').trim();

                const modalPrice = parseFloat(priceStr);
                const priceDate = new Date(dateStr);

                if (commodity && state && !isNaN(modalPrice) && !isNaN(priceDate.getTime())) {
                    rows.push({ state, commodity, priceDate, modalPrice });
                }
            })
            .on('end', () => {
                mandiData = rows;
                dataLoaded = true;
                console.log(`[Decision] Loaded ${mandiData.length} rows from backend/data/filtered_mandi_data.csv`);
                resolve();
            })
            .on('error', (err) => {
                console.error('[Decision] CSV read error:', err.message);
                dataLoaded = true;
                reject(err);
            });
    });
}

// Kick off CSV loading immediately
loadCSV().catch(() => {});

// ── Short weekday helper ────────────────────────────────────
const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function dayLabel(date) {
    return SHORT_DAYS[date.getDay()];
}

/**
 * Adds `n` calendar days to a Date and returns a new Date.
 */
function addDays(date, n) {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
}

async function translateInsights({ recommendationLabel, explanation }, targetLanguage) {
    if (!targetLanguage || targetLanguage === 'en') {
        return { recommendationLabel, explanation, translated: false };
    }

    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey) {
        return { recommendationLabel, explanation, translated: false };
    }

    try {
        const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                q: [recommendationLabel, explanation],
                target: targetLanguage,
                format: 'text'
            })
        });

        if (!response.ok) {
            return { recommendationLabel, explanation, translated: false };
        }

        const payload = await response.json();
        const translatedItems = payload?.data?.translations || [];

        if (translatedItems.length < 2) {
            return { recommendationLabel, explanation, translated: false };
        }

        return {
            recommendationLabel: translatedItems[0].translatedText || recommendationLabel,
            explanation: translatedItems[1].translatedText || explanation,
            translated: true
        };
    } catch {
        return { recommendationLabel, explanation, translated: false };
    }
}


const getDecision = asyncHandler(async (req, res) => {
    // Wait for CSV to finish loading if it hasn't yet
    if (!dataLoaded) {
        await loadCSV();
    }

    const { crop } = req.query;

    if (!crop) {
        res.status(400);
        throw new Error('"crop" query parameter is required.');
    }

    // Strict crop-only filter (case-insensitive)
    const cropLower = crop.toLowerCase();

    // 1. Filter out only the requested crop
    const cropData = mandiData.filter((r) => r.commodity.toLowerCase() === cropLower);

    if (cropData.length === 0) {
        return res.status(200).json({
            recommendation: 'HOLD',
            explanation: `No price data found for "${crop}". We recommend holding until more data is available.`,
            predictedPrice: null,
            projectedPrice3Days: null,
            chartData: [],
        });
    }

    // 2. Group by Date and calculate the National Average Price
    const dailyAveragesMap = {};
    
    cropData.forEach((row) => {
        // Use YYYY-MM-DD as a unique key for each day
        const dateKey = row.priceDate.toISOString().split('T')[0]; 
        
        if (!dailyAveragesMap[dateKey]) {
            dailyAveragesMap[dateKey] = { sum: 0, count: 0, date: row.priceDate };
        }
        dailyAveragesMap[dateKey].sum += row.modalPrice;
        dailyAveragesMap[dateKey].count += 1;
    });

    // 3. Convert the grouped map back into a sorted array
    const aggregatedData = Object.values(dailyAveragesMap)
        .map((day) => ({
            priceDate: day.date,
            modalPrice: day.sum / day.count // Calculate the average price
        }))
        .sort((a, b) => a.priceDate - b.priceDate); // oldest → newest

    // 4. Grab the last 5 aggregated data-points
    const last5 = aggregatedData.slice(-5);

    // Build regression pairs: x = 1..n, y = averaged modalPrice
    const pairs = last5.map((row, i) => [i + 1, row.modalPrice]);

    // simple-statistics linearRegression => { m, b }   (y = mx + c)
    // 'm' is the slope, 'b' is the intercept (c)
    const { m: slope, b: intercept } = ss.linearRegression(pairs);

    // Predicted price for next day (Day n+1)
    const nextDayIndex = last5.length + 1;
    const predictedPrice = Math.round(slope * nextDayIndex + intercept);

    // Projected price 3 days out (Day n+3)
    const day3Index = last5.length + 3;
    const projectedPrice3Days = Math.round(slope * day3Index + intercept);

    // Demand mock
    const demandLevel = Math.random() > 0.5 ? 'High' : 'Medium';

    // Rule-based decision engine
    let recommendation;
    let explanation;
    let recommendationLabel;

    if (slope > 0 && demandLevel === 'High') {
        recommendation = 'WAIT';
        recommendationLabel = 'WAIT';
        explanation = `Wait 3 days! The national average price is rising and is projected to hit ₹${projectedPrice3Days} by then.`;
    } else if (slope < 0) {
        recommendation = 'SELL NOW';
        recommendationLabel = 'SELL NOW';
        explanation = 'Post this immediately. Prices are dropping, and waiting will lose you money.';
    } else {
        recommendation = 'HOLD';
        recommendationLabel = 'HOLD';
        explanation = 'Prices are relatively stable. You can post now or wait — the market is flat.';
    }

    const targetLanguage = req.user?.language || 'en';
    const localizedInsights = await translateInsights(
        { recommendationLabel, explanation },
        targetLanguage
    );

    // Build chart data
    const lastDate = last5[last5.length - 1].priceDate;
    const chartData = last5.map((row) => ({
        day: dayLabel(row.priceDate),
        price: Math.round(row.modalPrice),
        isPrediction: false,
    }));

    // Append predicted point (tomorrow)
    const tomorrowDate = addDays(lastDate, 1);
    chartData.push({
        day: dayLabel(tomorrowDate),
        price: predictedPrice,
        isPrediction: true,
    });

    res.status(200).json({
        recommendation,
        recommendationLabel: localizedInsights.recommendationLabel,
        explanation: localizedInsights.explanation,
        language: targetLanguage,
        translated: localizedInsights.translated,
        predictedPrice,
        projectedPrice3Days,
        slope: Math.round(slope * 100) / 100,
        demandLevel,
        chartData,
    });
});
const getCommodities = asyncHandler(async (_req, res) => {
    if (!dataLoaded) await loadCSV();

    const commodities = [...new Set(mandiData.map((r) => r.commodity))].sort();
    const states = [...new Set(mandiData.map((r) => r.state))].sort();

    res.status(200).json({ commodities, states });
});

module.exports = { getDecision, getCommodities, loadCSV };
