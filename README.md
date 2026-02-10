# AgriTech Marketplace Platform

A full-stack agricultural marketplace connecting farmers and buyers with real-time trading, multilingual support, and smart price discovery.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Application URLs](#application-urls)
- [Important Notes](#important-notes)

---
## Quick Start

### Prerequisites

- **Node.js** 18+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** or **yarn**

### Swift Run
```bash
# 1. Clone the repository
git clone <repo-url>
cd SE_3-2

# 2. Start the backend
cd backend
npm install
cp .env.example .env   # Configure your environment variables
npm run dev

# 3. Start the frontend (new terminal)
cd frontend
npm install
npm run dev
```
## Overview

### For Farmers

- **Crop Listing**: Add crops with name, quantity, price, quality grade, location, and image
- **Inventory Management**: View and manage all listed crops in a sortable table
- **Order Management**: Track incoming orders from buyers
- **Price Insights**: View price trend charts for market-aware decisions
- **Trust Score**: Build credibility through a visual trust gauge
- **Verification**: Submit documents (Aadhaar, land records) to earn a verified badge
- **Voice Input**: Use speech-to-text for hands-free quantity and price entry
- **Marketplace Access**: Browse and purchase crops from other farmers

### For Buyers

- **Marketplace**: Browse all available crop listings with quality grades
- **Interactive Map**: View farm locations on a visual crop availability map
- **Buy Now**: Quick purchase flow with quantity selection, delivery address, and payment
- **Price Negotiation**: WhatsApp-style chat to negotiate prices with farmers
- **Auction Bidding**: Participate in live auctions with real-time countdown timers
- **Order Tracking**: Track order status through a visual timeline
