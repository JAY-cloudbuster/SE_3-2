/**
 * @fileoverview Price Controller for AgriSahayak Platform
 * 
 * Handles market price data retrieval including current prices,
 * historical trends, and basic pricing recommendations.
 * 
 * @module controllers/priceController
 * @requires express-async-handler
 * @requires models/MarketPrice
 * 
 * @see Epic 5 - Price Transparency
 */

const asyncHandler = require('express-async-handler');
const MarketPrice = require('../models/MarketPrice');

/**
 * Get Current Market Prices
 * Returns the latest price record for each commodity.
 * 
 * @route GET /api/prices/current
 * @access Private
 */
const getCurrentPrices = asyncHandler(async (req, res) => {
    // Aggregate: get the latest record per commodity
    const prices = await MarketPrice.aggregate([
        { $sort: { date: -1 } },
        {
            $group: {
                _id: '$commodity',
                commodity: { $first: '$commodity' },
                market: { $first: '$market' },
                date: { $first: '$date' },
                minPrice: { $first: '$minPrice' },
                maxPrice: { $first: '$maxPrice' },
                modalPrice: { $first: '$modalPrice' }
            }
        },
        { $sort: { commodity: 1 } }
    ]);

    res.status(200).json(prices);
});

/**
 * Get Historical Price Trends
 * Returns price data for the last 30 days, optionally filtered by commodity.
 * 
 * @route GET /api/prices/trends?commodity=Wheat&days=30
 * @access Private
 */
const getHistoricalTrends = asyncHandler(async (req, res) => {
    const { commodity, days } = req.query;
    const numDays = parseInt(days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - numDays);

    const filter = { date: { $gte: startDate } };
    if (commodity) {
        filter.commodity = new RegExp(commodity, 'i');
    }

    const trends = await MarketPrice.find(filter)
        .sort({ date: 1 })
        .lean();

    res.status(200).json(trends);
});

/**
 * Get Pricing Recommendation
 * Compares a given price against the current market modal price
 * and returns a simple sell/wait recommendation.
 * 
 * @route GET /api/prices/recommend?commodity=Wheat&userPrice=25
 * @access Private
 */
const getRecommendation = asyncHandler(async (req, res) => {
    const { commodity, userPrice } = req.query;

    if (!commodity) {
        res.status(400);
        throw new Error('Commodity name is required');
    }

    // Get the latest market price for this commodity
    const latestPrice = await MarketPrice.findOne({ commodity: new RegExp(commodity, 'i') })
        .sort({ date: -1 });

    if (!latestPrice) {
        res.status(200).json({
            recommendation: 'neutral',
            message: 'No market data available for this commodity',
            marketPrice: null
        });
        return;
    }

    const userPriceNum = parseFloat(userPrice) || 0;
    const marketModal = latestPrice.modalPrice;
    let recommendation, message;

    if (userPriceNum >= marketModal * 1.1) {
        recommendation = 'sell';
        message = `Your price (₹${userPriceNum}) is above the market rate (₹${marketModal}). Good time to sell!`;
    } else if (userPriceNum <= marketModal * 0.9) {
        recommendation = 'wait';
        message = `Your price (₹${userPriceNum}) is below the market rate (₹${marketModal}). Consider waiting for better prices.`;
    } else {
        recommendation = 'neutral';
        message = `Your price (₹${userPriceNum}) is close to the market rate (₹${marketModal}).`;
    }

    res.status(200).json({
        recommendation,
        message,
        marketPrice: latestPrice,
        userPrice: userPriceNum
    });
});

module.exports = {
    getCurrentPrices,
    getHistoricalTrends,
    getRecommendation
};
