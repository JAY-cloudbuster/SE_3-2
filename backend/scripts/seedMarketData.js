/**
 * @fileoverview Market Data Seed Script
 * 
 * Populates the MarketPrice collection with 30 days of dummy data
 * for 5 commodities across 3 markets. Run once to set up test data.
 * 
 * Usage: node scripts/seedMarketData.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from backend root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MarketPrice = require('../models/MarketPrice');

const commodities = [
    { name: 'Wheat', basePrice: 22 },
    { name: 'Rice', basePrice: 35 },
    { name: 'Onion', basePrice: 18 },
    { name: 'Tomato', basePrice: 25 },
    { name: 'Potato', basePrice: 12 }
];

const markets = ['Delhi APMC', 'Mumbai APMC', 'Pune Market'];

/**
 * Generate a random price within ±30% of a base price
 */
function randomPrice(base) {
    const variation = base * 0.3;
    return Math.round((base - variation + Math.random() * variation * 2) * 100) / 100;
}

async function seedData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing market price data
        await MarketPrice.deleteMany({});
        console.log('Cleared existing market price data');

        const records = [];
        const today = new Date();

        for (let day = 0; day < 30; day++) {
            const date = new Date(today);
            date.setDate(date.getDate() - day);

            for (const commodity of commodities) {
                for (const market of markets) {
                    const modalPrice = randomPrice(commodity.basePrice);
                    const minPrice = Math.round((modalPrice * 0.85) * 100) / 100;
                    const maxPrice = Math.round((modalPrice * 1.15) * 100) / 100;

                    records.push({
                        commodity: commodity.name,
                        market,
                        date,
                        minPrice,
                        maxPrice,
                        modalPrice
                    });
                }
            }
        }

        await MarketPrice.insertMany(records);
        console.log(`Seeded ${records.length} market price records`);
        console.log('  → 5 commodities × 3 markets × 30 days');

        await mongoose.connection.close();
        console.log('Done! Connection closed.');
    } catch (error) {
        console.error('Seed error:', error.message);
        process.exit(1);
    }
}

seedData();
