# Implementation Plan - AgriSahayak Remaining EPICs

## Goal Description
The goal is to complete the implementation of the AgriSahayak platform by addressing the missing logic for Trade, Farmer Management, Market Data, Trust & Safety, and Buyer Features. This involves creating new backend controllers, routes, and models, and integrating them with the existing frontend.

## User Review Required
> [!IMPORTANT]
> **File Uploads**: We will implement **local file storage** using `multer` for crop images and profile pictures initially. AWS S3 integration is deferred until deployment to avoid credential dependency during development.

> [!NOTE]
> **Market Data**: We will create a `MarketData` model to store historical prices. To populate this, we will implement a seed script with dummy data, as real-time external API integration requires paid subscriptions.

## Proposed Changes

### Backend - Epic 4: Trade & Auction (Critical)
#### [NEW] [tradeController.js](file:///c:/Users/kjaye/Desktop/SE_3-2/backend/controllers/tradeController.js)
-   Implement `placeBid` (Auction logic, Timer check).
-   Implement `startNegotiation`, `sendOffer`, `acceptNegotiation`, `rejectNegotiation`.
-   Implement `createOrder` (from "Buy Now" or accepted negotiation).
-   Implement `getOrders`, `updateOrderStatus`.
-   **Socket.io Integration**: Emit events for `new_bid`, `new_offer`, `order_update`.

#### [NEW] [tradeRoutes.js](file:///c:/Users/kjaye/Desktop/SE_3-2/backend/routes/tradeRoutes.js)
-   Define routes: `/bid`, `/negotiation/start`, `/negotiation/offer`, `/negotiation/accept`, `/orders`, `/orders/:id`.
-   Protect all routes with `authMiddleware`.

#### [MODIFY] [server.js](file:///c:/Users/kjaye/Desktop/SE_3-2/backend/server.js)
-   Mount `tradeRoutes` at `/api/trade`.
-   Enhance `socket.io` handlers to support specific rooms for auctions and negotiations.

#### [MODIFY] [models/Order.js](file:///c:/Users/kjaye/Desktop/SE_3-2/backend/models/Order.js)
-   Ensure schema supports all status transitions.

### Backend - Epic 2: Farmer Profile & Crop Management
#### [MODIFY] [cropController.js](file:///c:/Users/kjaye/Desktop/SE_3-2/backend/controllers/cropController.js)
-   Add `updateCrop` (PUT) and `deleteCrop` (DELETE).
-   Update `createCrop` to handle image file paths if upload is implemented.

#### [MODIFY] [cropRoutes.js](file:///c:/Users/kjaye/Desktop/SE_3-2/backend/routes/cropRoutes.js)
-   Add PUT (`/:id`) and DELETE (`/:id`) routes.

#### [NEW] [middleware/uploadMiddleware.js](file:///c:/Users/kjaye/Desktop/SE_3-2/backend/middlewares/uploadMiddleware.js)
-   Implement `multer` configuration for handling `multipart/form-data` uploads.
-   Save files to `uploads/` directory.

### Backend - Epic 5: Price Transparency
#### [NEW] [models/MarketPrice.js](file:///c:/Users/kjaye/Desktop/SE_3-2/backend/models/MarketPrice.js)
-   Schema: `commodity`, `market`, `date`, `minPrice`, `maxPrice`, `modalPrice`.

#### [NEW] [controllers/priceController.js](file:///c:/Users/kjaye/Desktop/SE_3-2/backend/controllers/priceController.js)
-   Implement `getMarketTrends` (historical data).
-   Implement `getDailyPrices`.

#### [NEW] [routes/priceRoutes.js](file:///c:/Users/kjaye/Desktop/SE_3-2/backend/routes/priceRoutes.js)
-   Mount at `/api/prices`.

### Backend - Epic 7: Trust & Safety
#### [NEW] [models/Review.js](file:///c:/Users/kjaye/Desktop/SE_3-2/backend/models/Review.js)
-   Schema: `reviewer`, `targetUser`, `rating`, `comment`, `relatedOrder`.

#### [NEW] [controllers/adminController.js](file:///c:/Users/kjaye/Desktop/SE_3-2/backend/controllers/adminController.js)
-   Implement `getAllUsers`, `verifyUser`, `banUser`.
-   Implement `getPlatformStats`.

#### [NEW] [routes/adminRoutes.js](file:///c:/Users/kjaye/Desktop/SE_3-2/backend/routes/adminRoutes.js)
-   Mount at `/api/admin`. Protect with `adminMiddleware`.

### Frontend - Integration
#### [MODIFY] [services/tradeService.js](file:///c:/Users/kjaye/Desktop/SE_3-2/frontend/src/services/tradeService.js)
-   Ensure endpoints match the new backend routes.

#### [NEW] [services/adminService.js](file:///c:/Users/kjaye/Desktop/SE_3-2/frontend/src/services/adminService.js)
-   Endpoints for admin actions.

#### [NEW] [services/fileUploadService.js](file:///c:/Users/kjaye/Desktop/SE_3-2/frontend/src/services/fileUploadService.js)
-   Helper to send `FormData` to backend.

## Verification Plan

### Automated Tests
-   **Refactoring Tests**: Since there are no existing backend tests, we will create a basic test suite using `jest` and `supertest` for the new `trade` endpoints.
    -   `npm test` (We will need to configure the test script).

### Manual Verification
1.  **Trade Flow**:
    -   Login as **Farmer A**, create crop "Wheat".
    -   Login as **Buyer B**, search "Wheat".
    -   **Negotiation**: Buyer B starts negotiation -> Chat UI -> Send Offer -> Farmer A accepts.
    -   **Order**: Verify Order is created in DB and visible in "My Orders" for both.
    -   **Status**: Farmer A marks "Shipped" -> Update reflected for Buyer B.
2.  **Auction Flow**:
    -   Farmer A creates Auction Crop.
    -   Buyer B bids ₹100.
    -   Buyer C bids ₹110 -> Socket update shows ₹110 to Buyer B instantly.
3.  **Admin Flow**:
    -   Login as Admin.
    -   Verify Farmer A -> details update.
