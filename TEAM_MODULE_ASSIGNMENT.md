# Team Module Assignment — AgriTech Platform

**Team size:** 5 people  
**Split:** 3 Frontend | 2 Backend

---

## Frontend (3 people)

### **Person 1 — Auth, Layout & Shared UI**

**Scope:** User registration, login, authentication state, app shell (Navbar, Sidebar), protected routes, and shared/reusable UI.

| Category | Files / Areas |
|----------|----------------|
| **Auth UI** | `src/features/auth/components/RegisterForm.jsx`, `src/features/auth/components/LoginForm.jsx` |
| **Auth state** | `src/context/AuthContext.jsx` |
| **Auth API** | `src/services/authService.js` |
| **Layout** | `src/components/layout/Navbar.jsx`, `src/components/layout/Sidebar.jsx` |
| **Protected routes** | `src/components/common/ProtectedRoute.jsx`, `src/pages/common/ProtectedRoute.jsx` (if different) |
| **Shared components** | `src/components/shared/CurrencyLabel.jsx`, `src/components/shared/TrustGauge.jsx` |
| **Common UI** | `src/components/common/LanguageSelector.jsx`, `src/components/common/VoiceInput.jsx`, `src/components/common/TranslatedText.jsx`, `src/components/common/SuccessAudio.jsx` |
| **Base API** | `src/services/api.js` (base axios/config used by other services) |

**Responsibilities:** Registration/login flows, JWT handling, role-based redirects, sidebar/navbar behavior, language selector, shared display components.

---

### **Person 2 — Farmer & Moderation**

**Scope:** Farmer dashboard, crop management (add/list), farmer marketplace, farmer orders, and admin moderation.

| Category | Files / Areas |
|----------|----------------|
| **Farmer pages** | `src/pages/farmer/FarmerDashboard.jsx`, `src/pages/farmer/FarmerMarketplacePage.jsx` |
| **Farmer features** | `src/features/farmer/components/CropForm.jsx`, `src/features/farmer/components/CropList.jsx`, `src/features/farmer/components/FarmerMarketplace.jsx`, `src/features/farmer/components/FarmerOrders.jsx` |
| **Moderation** | `src/pages/admin/ModerationDashboard.jsx`, `src/features/moderation/components/VerificationForm.jsx` |
| **Crop API (frontend)** | `src/services/cropService.js` |

**Responsibilities:** Crop CRUD UI, farmer marketplace view, farmer order list, verification form, moderation dashboard and verification workflow.

---

### **Person 3 — Buyer, Trade & Market**

**Scope:** Buyer dashboard, crop browsing, market map, trade/auction/negotiation, payments, and market charts.

| Category | Files / Areas |
|----------|----------------|
| **Buyer** | `src/pages/buyer/BuyerDashboard.jsx`, `src/features/buyer/components/CropCard.jsx`, `src/features/buyer/components/MarketMap.jsx` |
| **Trade** | `src/pages/trade/TradeDashboard.jsx`, `src/pages/trade/NegotiationPage.jsx`, `src/pages/trade/BuyNowPaymentPage.jsx`, `src/features/trade/components/*` (AuctionCard, AuctionForm, BidPanel, BuyNowButton, NegotiationChat, Negotiator, etc.) |
| **Common trade/payment** | `src/pages/common/PaymentPage.jsx`, `src/pages/common/OrderConfirmationPage.jsx`, `src/pages/common/TradingDemo.jsx` |
| **Market** | `src/features/market/components/PriceChart.jsx` |
| **Services** | `src/services/tradeService.js`, `src/services/priceService.js` |
| **Context** | `src/context/SocketContext.jsx` |
| **Hooks** | `src/hooks/useAuctionTimer.js`, `src/hooks/useSpeech.js` |
| **Language/Translation** | `src/context/LanguageContext.jsx`, `src/context/TranslationContext.jsx`, `src/services/translationService.js`, `src/pages/common/TranslationDemo.jsx` |

**Responsibilities:** Buyer flows, crop cards, map, auctions, bidding, negotiation, buy-now, payment/order confirmation, price chart, real-time (Socket), translation/language, and related hooks.

---

## Backend (2 people)

### **Person 4 — Auth & User**

**Scope:** User registration, login, JWT, and auth middleware.

| Category | Files / Areas |
|----------|----------------|
| **Routes** | `backend/routes/authRoutes.js` |
| **Controller** | `backend/controllers/authController.js` |
| **Middleware** | `backend/middlewares/authMiddleware.js` |
| **Model** | `backend/models/User.js` |
| **Config** | `backend/config/db.js` |
| **Server** | `backend/server.js` (shared; Person 4 owns auth route mounting and any auth-related server config) |

**Responsibilities:** `/api/auth/register`, `/api/auth/login`, JWT generation/validation, `protect` and `admin` middleware, User schema and password hashing.

---

### **Person 5 — Crops & Data**

**Scope:** Crop CRUD, marketplace listing, and related data models.

| Category | Files / Areas |
|----------|----------------|
| **Routes** | `backend/routes/cropRoutes.js` |
| **Controller** | `backend/controllers/cropController.js` |
| **Models** | `backend/models/Crop.js`, `backend/models/Order.js`, `backend/models/Negotiation.js` (if used by APIs) |

**Responsibilities:** `/api/crops` (create, list), `/api/crops/my`, Crop schema, and any Order/Negotiation models used by crop/trade APIs.

---

## Quick reference

| Person | Focus | Main deliverables |
|--------|--------|--------------------|
| **1** | Auth + Layout + Shared UI | Login/Register, Navbar/Sidebar, ProtectedRoute, shared components |
| **2** | Farmer + Moderation | Farmer dashboard, CropForm/List, Marketplace, Moderation, cropService |
| **3** | Buyer + Trade + Market | Buyer dashboard, CropCard, Map, Auctions, Negotiation, Payment, Socket, Translation |
| **4** | Auth & User (backend) | authRoutes, authController, authMiddleware, User model, server auth |
| **5** | Crops & Data (backend) | cropRoutes, cropController, Crop/Order/Negotiation models |

Use **TESTING_DOCUMENT.md** for module explanations and test cases for your assigned module.
