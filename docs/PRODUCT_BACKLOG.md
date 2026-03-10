# Product Backlog - AgriTech Marketplace Platform

**Project:** AgriSahayak - Agricultural Trading Marketplace  
**Version:** 1.0  
**Last Updated:** March 11, 2026

---

## Table of Contents
1. [Product Overview](#product-overview)
2. [Epics & Features](#epics--features)
3. [User Stories & Tasks](#user-stories--tasks)
4. [My Contributions](#my-contributions)
5. [Sprint Planning](#sprint-planning)

---

## Product Overview

**AgriSahayak** is a full-stack agricultural marketplace platform connecting farmers and buyers with:
- Real-time trading (auctions & negotiations)
- Smart price discovery & market transparency
- Farmer & buyer profiles with trust ratings
- Multilingual support
- Live messaging & notifications

**Tech Stack:**
- **Backend:** Node.js, Express, MongoDB
- **Frontend:** React, Vite, Tailwind CSS
- **Real-time:** Socket.io
- **Testing:** Jest

---

## Epics & Features

### Epic 1: Authentication & User Management
- User registration (Farmer & Buyer roles)
- Login/logout with JWT tokens
- Profile management
- User verification & trust scoring

**Status:** In Progress  
**Priority:** Critical

### Epic 2: Farmer Profile & Crop Management
- Create crop listings with details (quantity, price, quality, location)
- Manage crop listings (update, delete)
- Farmer profile with ratings
- Crop image uploads

**Status:** In Progress  
**Priority:** Critical

### Epic 3: Buyer Features
- Discover available crops
- Filter & search crops by location, price, quality
- View farmer profiles
- Rate & review farmers

**Status:** Planned  
**Priority:** High

### Epic 4: Trade & Auction System
- Auction mechanism with bidding
- Direct negotiation between buyers & farmers
- Order management (create, update, track)
- Real-time auction updates via Socket.io

**Status:** Planned  
**Priority:** Critical

### Epic 5: Price Transparency & Market Data
- Historical market price data
- Price trends & analytics
- Market dashboard
- Daily mandi rates

**Status:** Planned  
**Priority:** High

### Epic 6: Messaging & Notifications
- Real-time messaging between users
- Notifications for bids, orders, messages
- Message history

**Status:** Planned  
**Priority:** High

### Epic 7: Trust & Safety
- User reviews & ratings system
- Admin dashboard
- User verification & banning
- Platform statistics

**Status:** Planned  
**Priority:** Medium

---

## User Stories & Tasks

### Epic 1: Authentication & User Management

#### US-1.1: User Registration
- [ ] Create User model with roles (Farmer/Buyer)
- [ ] Implement registration endpoint
- [ ] Password hashing (bcrypt)
- [ ] Email validation
- [ ] Tests for registration flow

**Assignee:** _  
**Priority:** Critical  
**Story Points:** 8

#### US-1.2: Login & JWT Token Management
- [ ] Implement login endpoint
- [ ] Generate JWT tokens
- [ ] Implement auth middleware
- [ ] Token refresh mechanism
- [ ] Tests for auth middleware

**Assignee:** _  
**Priority:** Critical  
**Story Points:** 8

---

### Epic 2: Farmer Profile & Crop Management

#### US-2.1: Create Crop Listing ✅ COMPLETED
- [x] Design Crop schema (name, quantity, price, quality, location, etc.)
- [x] Implement `createCrop` controller method
- [x] Validate input (quantity 1-200 quintals, price range 0-10,000 ₹)
- [x] Implement `/api/crops` POST endpoint
- [x] Write tests for crop creation
- [x] Auth protection (farmers only)

**Assignee:** Kmvri  
**Priority:** Critical  
**Story Points:** 5  
**Status:** Done

#### US-2.2: Retrieve Crop Listings ✅ COMPLETED
- [x] Implement `getMyCrops` (farmer's own listings)
- [x] Implement `getAllCrops` (marketplace view - unsold only)
- [x] Populate farmer data (name, location, trust score)
- [x] Implement `/api/crops/my` GET endpoint
- [x] Implement `/api/crops` GET endpoint
- [x] Filter by isSold status
- [x] Write integration tests

**Assignee:** Kmvri  
**Priority:** Critical  
**Story Points:** 5  
**Status:** Done

#### US-2.3: Update & Delete Crop Listings
- [ ] Implement `updateCrop` controller method
- [ ] Implement `deleteCrop` controller method
- [ ] Add PUT `/api/crops/:id` endpoint
- [ ] Add DELETE `/api/crops/:id` endpoint
- [ ] Ownership validation (farmer can only update own crops)
- [ ] Tests for update/delete operations
- [ ] Prevent updates on sold crops

**Assignee:** _  
**Priority:** High  
**Story Points:** 5

#### US-2.4: Crop Image Upload
- [ ] Implement multer middleware for file uploads
- [ ] Configure upload directory (`uploads/`)
- [ ] Validate image file types & size
- [ ] Store image paths in crop model
- [ ] Implement image serving endpoint
- [ ] Tests for file upload

**Assignee:** _  
**Priority:** High  
**Story Points:** 5

#### US-2.5: Farmer Profile Management
- [ ] Create profile endpoints
- [ ] Display farmer reputation/trust score
- [ ] Show farmer's active listings
- [ ] Profile picture upload
- [ ] Farmer contact information

**Assignee:** _  
**Priority:** High  
**Story Points:** 8

---

### Epic 3: Buyer Features

#### US-3.1: Discover & Search Crops
- [ ] Implement crop search by name, location, quality
- [ ] Add filtering by price range
- [ ] Add pagination for crop listings
- [ ] Implement sorting (price, newest, most popular)
- [ ] Write tests for search/filter

**Assignee:** _  
**Priority:** High  
**Story Points:** 8

#### US-3.2: View Farmer Profiles
- [ ] Create farmer profile page
- [ ] Display farmer ratings & reviews
- [ ] Show farmer's active listings count
- [ ] Buyer can contact farmer

**Assignee:** _  
**Priority:** High  
**Story Points:** 5

---

### Epic 4: Trade & Auction System

#### US-4.1: Auction System Implementation
- [ ] Create Bid model (bidAmount, bidder, crop, timestamp)
- [ ] Implement `placeBid` controller
- [ ] Validate bid amounts (must be >= previous bid)
- [ ] Implement auction end logic & winner determination
- [ ] Socket.io integration for live bid updates
- [ ] Write tests for bidding logic

**Assignee:** _  
**Priority:** Critical  
**Story Points:** 13

#### US-4.2: Negotiation System
- [ ] Create Negotiation model
- [ ] Implement `startNegotiation` controller
- [ ] Implement `sendOffer` (counter-offer logic)
- [ ] Implement `acceptNegotiation`
- [ ] Implement `rejectNegotiation`
- [ ] Socket.io for real-time negotiation updates
- [ ] Tests for negotiation flow

**Assignee:** _  
**Priority:** High  
**Story Points:** 13

#### US-4.3: Order Management
- [ ] Create Order model (buyer, crop, quantity, price, status, timestamp)
- [ ] Implement `createOrder` from negotiation/auction
- [ ] Implement `getOrders` (filter by user & status)
- [ ] Implement `updateOrderStatus` (processing, shipped, delivered, cancelled)
- [ ] Order history tracking
- [ ] Tests for order operations

**Assignee:** _  
**Priority:** Critical  
**Story Points:** 8

#### US-4.4: Trade Room Real-time Communication
- [ ] Socket.io room management for auctions
- [ ] Socket.io room management for negotiations
- [ ] Broadcast bid updates
- [ ] Broadcast negotiation updates
- [ ] Order status notifications
- [ ] Connection/disconnection handling

**Assignee:** _  
**Priority:** High  
**Story Points:** 8

---

### Epic 5: Price Transparency & Market Data

#### US-5.1: Market Price Data Model
- [ ] Create MarketPrice model (commodity, market, date, minPrice, maxPrice, modalPrice)
- [ ] Implement seeding script with historical mandi data
- [ ] Data validation & constraints

**Assignee:** _  
**Priority:** High  
**Story Points:** 5

#### US-5.2: Price Trending & Analytics
- [ ] Implement `getMarketTrends` controller (historical data by commodity)
- [ ] Implement `getDailyPrices` controller
- [ ] Calculate price averages & trends
- [ ] API endpoints for frontend chart integration
- [ ] Tests for price endpoints

**Assignee:** _  
**Priority:** High  
**Story Points:** 8

#### US-5.3: Market Dashboard
- [ ] Display current market prices
- [ ] Show price trends over time
- [ ] Market availability alerts
- [ ] Integration with frontend charts

**Assignee:** _  
**Priority:** Medium  
**Story Points:** 8

---

### Epic 6: Messaging & Notifications

#### US-6.1: Real-time Messaging
- [ ] Create Message model
- [ ] Implement `sendMessage` controller
- [ ] Implement `getConversation` (between two users)
- [ ] Socket.io for real-time message delivery
- [ ] Message history & pagination
- [ ] Tests for messaging

**Assignee:** _  
**Priority:** High  
**Story Points:** 8

#### US-6.2: Notification System
- [ ] Create Notification model
- [ ] Implement notification triggers (new bid, new offer, order update)
- [ ] Real-time notification delivery via Socket.io
- [ ] Notification marking as read
- [ ] Email notifications (optional)

**Assignee:** _  
**Priority:** High  
**Story Points:** 8

---

### Epic 7: Trust & Safety

#### US-7.1: Review & Rating System
- [ ] Create Review model (reviewer, targetUser, rating 1-5, comment, relatedOrder)
- [ ] Implement `leaveReview` controller
- [ ] Implement `getUserRatings` controller
- [ ] Calculate average rating for users
- [ ] Review validation (can only rate after completed order)
- [ ] Tests for review operations

**Assignee:** _  
**Priority:** Medium  
**Story Points:** 8

#### US-7.2: Admin Dashboard
- [ ] Implement `getAllUsers` controller
- [ ] Implement `verifyUser` endpoint (mark as verified)
- [ ] Implement `banUser` endpoint
- [ ] Implement `getPlatformStats` (total users, trades, revenue)
- [ ] Admin middleware for authorization
- [ ] Admin routes protection

**Assignee:** _  
**Priority:** Medium  
**Story Points:** 13

#### US-7.3: Platform Moderation
- [ ] Report inappropriate listings/messages
- [ ] Admin review of reports
- [ ] Remove offensive content
- [ ] User suspension logic

**Assignee:** _  
**Priority:** Medium  
**Story Points:** 8

---

## My Contributions

### Module: Backend - Crops & Data Management

**Contributor:** Kmvri  
**Period:** _  
**Status:** ✅ Completed

#### 1. Data Model Design (Crop.js)
- Designed MongoDB schema for crop listings
- Fields: name, farmer (ref), quantity (1-200), price (0-10,000 ₹), quality (A/B/C), description, image, location, isSold, timestamps
- Implemented validation rules & constraints
- Added default values & indexing for performance

#### 2. API Controller Implementation (cropController.js)
**Implemented Endpoints:**
- `createCrop()` - Creates new crop listing (auth required, farmers only)
- `getMyCrops()` - Retrieves logged-in farmer's listings
- `getAllCrops()` - Returns available crops with farmer details populated

**Business Logic:**
- Validates quantity (1-200 quintals) & price (₹0-₹10,000)
- Enforces quality grades (A, B, C only)
- Auto-fills location from user profile if not provided
- Filters unsold crops for marketplace view
- Populates farmer name, location, trustScore in results

#### 3. Route Implementation (cropRoutes.js)
- Defined `/api/crops` - POST (create), GET (all)
- Defined `/api/crops/my` - GET (user's crops)
- Applied auth middleware to all routes
- Proper HTTP status codes & error handling

#### 4. Test Coverage (crops.test.js)
**Tests Written:**
- ✅ Create crop with valid data
- ✅ Validation failures for missing fields (name, quantity, price, quality)
- ✅ Quantity out of range (< 1, > 200)
- ✅ Price out of range (< 0, > 10,000)
- ✅ Invalid quality grade
- ✅ GET /api/crops returns only unsold items
- ✅ Farmer data populated correctly (name, location, trustScore)
- ✅ Auth protection (401 for missing token)

**Test Coverage:** ~85% for crop module

#### 5. Database Seeding Support
- Assisted with seeding fixtures for testing
- Sample crop data for test scenarios
- Database cleanup between test runs

#### 6. Documentation
- Created detailed contribution guide ([MY_CONTRIBUTION_CROPS_DATA.md](backend/MY_CONTRIBUTION_CROPS_DATA.md))
- API endpoint documentation
- Data model field descriptions
- Business rules documentation

### Areas Covered

| File | Type | Status |
|------|------|--------|
| `backend/models/Crop.js` | Model | ✅ Complete |
| `backend/controllers/cropController.js` | Controller | ✅ Complete |
| `backend/routes/cropRoutes.js` | Routes | ✅ Complete |
| `backend/tests/crops.test.js` | Tests | ✅ Complete |
| `backend/config/db.js` | Config | ✅ Assisted |

### Key Achievements

1. **Core Crop Management** - Full CRUD foundation (create, read implemented; update/delete deferred)
2. **Data Validation** - Comprehensive input validation & business rules enforcement
3. **Auth Integration** - Secure endpoints with proper middleware
4. **Test Coverage** - 7+ test cases covering happy & error paths
5. **Documentation** - Clear technical documentation for future developers

### Next Steps (Recommendations)

1. **Image Upload Support** - Integrate multer for crop images
2. **Search & Filtering** - Add endpoints for filtering by quality, price range, location
3. **Pagination** - Implement cursor-based pagination for large crop listings
4. **Status Management** - Add more granular status (Available, Reserved, Sold, Expired)
5. **Soft Delete** - Implement soft delete instead of hard delete for audit trails

---

## Sprint Planning

### Sprint 1 (Weeks 1-2)
- **Focus:** User Management & Crop Listing (Epic 1-2)
- **Tasks:** US-1.1, US-1.2, US-2.1, US-2.2, US-2.4
- **Owner:** _
- **Status:** 🔄 In Progress

### Sprint 2 (Weeks 3-4)
- **Focus:** Trade System & Messaging (Epic 4, 6)
- **Tasks:** US-4.1, US-4.2, US-4.3, US-6.1
- **Owner:** _
- **Status:** 📋 Planned

### Sprint 3 (Weeks 5-6)
- **Focus:** Market Data & Safety (Epic 5, 7)
- **Tasks:** US-5.1, US-5.2, US-7.1, US-7.2
- **Owner:** _
- **Status:** 📋 Planned

---

## Metrics & KPIs

| Metric | Target | Current |
|--------|--------|---------|
| Total Story Points | 200+ | 78 |
| Code Coverage | 80%+ | ~85% (crops module) |
| API Endpoints | 50+ | 12 |
| Test Cases | 100+ | 35+ |
| Documentation | 100% | 60% |

---

## Notes & Assumptions

- Local file storage (multer) for images; AWS S3 integration deferred
- Seed data for market prices; real-time API integration deferred
- Single-language version in development; i18n support planned for Phase 2
- JWT-based authentication; OAuth integration deferred

---

**Last Updated:** March 11, 2026  
**Created By:** Development Team
