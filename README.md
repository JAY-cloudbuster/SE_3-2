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
Access the app:

| Application       | URL                          |
| ------------------ | ---------------------------- |
| Frontend App       | http://localhost:5173         |
| Backend API        | http://localhost:5000         |

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

### For Admins

- **Moderation Dashboard**: Review farmer verification requests
- **Document Preview**: Preview submitted identity documents
- **Dispute Management**: Monitor and resolve trade disputes

### Platform-Wide

- **Multilingual Support**: Automatic translation to 13+ Indian languages via Google Translate API
- **Real-time Updates**: Live auction bids, negotiation messages via Socket.IO
- **Responsive Design**: Mobile-friendly with glassmorphism UI and smooth animations
- **Role-Based Access**: Protected routes for Farmer, Buyer, and Admin roles

---

## Tech Stack

| Component          | Technology                                    |
| ------------------ | --------------------------------------------- |
| **Frontend**       | React 18 + Vite                               |
| **Styling**        | Tailwind CSS                                  |
| **Animations**     | Framer Motion                                 |
| **State Mgmt**     | React Context API                             |
| **Routing**        | React Router DOM v6                           |
| **HTTP Client**    | Axios                                         |
| **Charts**         | Chart.js + react-chartjs-2                    |
| **Icons**          | Lucide React                                  |
| **Translation**    | i18next + Google Translate API                |
| **Backend**        | Node.js + Express.js                          |
| **Database**       | MongoDB + Mongoose                            |
| **Authentication** | JWT (jsonwebtoken) + bcryptjs                 |
| **Real-time**      | Socket.IO                                     |

---
## Project Structure

```
SE_3-2/
├── backend/
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Register & login logic
│   │   └── cropController.js    # Crop CRUD operations
│   ├── middlewares/
│   │   └── authMiddleware.js    # JWT verification & admin check
│   ├── models/
│   │   ├── User.js              # User schema (phone, role, language)
│   │   ├── Crop.js              # Crop schema (name, price, quality, location)
│   │   ├── Negotiation.js       # Negotiation schema (messages, offers)
│   │   └── Order.js             # Order schema (items, status, shipping)
│   ├── routes/
│   │   ├── authRoutes.js        # POST /register, /login
│   │   └── cropRoutes.js        # POST /create, GET /my, GET /all
│   ├── server.js                # Express app + Socket.IO setup
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # LanguageSelector, ProtectedRoute, VoiceInput, TranslatedText
│   │   │   ├── layout/          # Navbar, Sidebar
│   │   │   └── shared/          # CurrencyLabel, TrustGauge
│   │   ├── context/
│   │   │   ├── AuthContext.jsx          # Auth state & JWT management
│   │   │   ├── LanguageContext.jsx      # Language preference
│   │   │   ├── SocketContext.jsx        # Socket.IO connection
│   │   │   └── TranslationContext.jsx   # Dynamic translation via Google API
│   │   ├── features/
│   │   │   ├── auth/            # LoginForm, RegisterForm
│   │   │   ├── buyer/           # CropCard, MarketMap
│   │   │   ├── farmer/          # CropForm, CropList, FarmerOrders, VerificationForm
│   │   │   ├── market/          # PriceChart
│   │   │   ├── moderation/      # VerificationForm
│   │   │   └── trade/           # AuctionCard, AuctionForm, BidPanel, BuyNowButton,
│   │   │                        # NegotiateButton, NegotiationChat, Negotiator,
│   │   │                        # OrderSummaryModal, OrderTrackingCard, CropActionButtons
│   │   ├── pages/
│   │   │   ├── farmer/          # FarmerDashboard, FarmerMarketplacePage
│   │   │   ├── buyer/           # BuyerDashboard
│   │   │   ├── admin/           # ModerationDashboard
│   │   │   ├── trade/           # TradeDashboard, NegotiationPage, BuyNowPaymentPage
│   │   │   └── common/          # PaymentPage, OrderConfirmationPage, TranslationDemo, TradingDemo
│   │   ├── services/
│   │   │   ├── api.js               # Axios instance + JWT interceptor
│   │   │   ├── authService.js       # Login/register API calls
│   │   │   ├── cropService.js       # Crop CRUD API calls
│   │   │   ├── priceService.js      # Price data API calls
│   │   │   ├── tradeService.js      # Bid/offer/order API calls
│   │   │   └── translationService.js # Google Translate integration
│   │   ├── hooks/
│   │   │   ├── useAuctionTimer.js   # Auction countdown logic
│   │   │   └── useSpeech.js         # Web Speech API integration
│   │   ├── utils/
│   │   │   ├── formatters.js        # Currency formatting (INR)
│   │   │   └── priceSort.js         # Price sorting utility
│   │   ├── data/
│   │   │   └── mockTradingData.js   # Mock data for trading features
│   │   ├── App.jsx              # Root component + routing
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Global styles + Tailwind imports
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

---
## Running the Application

### 1. MongoDB Setup

**Option A — MongoDB Atlas (Cloud)**

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Get your connection string: `mongodb+srv://<user>:<pass>@cluster.mongodb.net/agritech`

**Option B — Local MongoDB**

```bash
# Windows: Download from https://www.mongodb.com/try/download/community
# macOS:
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu:
sudo apt install -y mongodb
sudo systemctl start mongodb
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret (see Environment Variables below)

# Start development server
npm run dev
```

The API will be available at **http://localhost:5000**

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:5173**

---
# Environment Variables

### Backend (`backend/.env`)

| Variable     | Description                       | Example                                              |
| ------------ | --------------------------------- | ---------------------------------------------------- |
| `MONGO_URI`  | MongoDB connection string         | `mongodb+srv://user:pass@cluster.mongodb.net/agritech` |
| `JWT_SECRET` | Secret key for JWT token signing  | `your_jwt_secret_key_here`                           |
| `PORT`       | Server port                       | `5000`                                               |

### Frontend (`frontend/.env`)

The frontend Axios base URL is configured in `src/services/api.js` pointing to `http://localhost:5000/api`.

---

## API Overview

### Authentication

| Method | Endpoint              | Description          | Auth |
| ------ | --------------------- | -------------------- | ---- |
| POST   | `/api/auth/register`  | Register new user    | No   |
| POST   | `/api/auth/login`     | Login & get JWT      | No   |

### Crops

| Method | Endpoint              | Description                   | Auth     |
| ------ | --------------------- | ----------------------------- | -------- |
| POST   | `/api/crops/create`   | Create new crop listing       | Required |
| GET    | `/api/crops/my`       | Get logged-in farmer's crops  | Required |
| GET    | `/api/crops/all`      | Get all available crops       | Required |

### Real-time Events (Socket.IO)

| Event            | Direction       | Description                    |
| ---------------- | --------------- | ------------------------------ |
| `place_bid`      | Client → Server | Place a bid on an auction      |
| `new_high_bid`   | Server → Client | Broadcast new highest bid      |
| `send_offer`     | Client → Server | Send a negotiation offer       |
| `receive_offer`  | Server → Client | Receive a negotiation offer    |

---
