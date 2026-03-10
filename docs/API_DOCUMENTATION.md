# AgriSahayak Backend API Documentation

This document explicitly outlines the endpoints, request payloads, and operations available in the AgriSahayak backend implementation.

Base URL prefix for all endpoints: `/api`

## Authentication (`/api/auth`)

Handles user and admin authentication, plus account activation flows.

| Method | Endpoint | Description | Request Body | Auth Required |
| --- | --- | --- | --- | --- |
| `POST` | `/auth/login` | Login for Farmers/Buyers | `{ phone, password }` | No |
| `POST` | `/auth/admin-login` | Login for Admins | `{ email, password }` | No |
| `POST` | `/auth/activate` | Verify email/temp password | `{ email, password }` | No |
| `POST` | `/auth/set-password` | Set new password | `{ userId, newPassword }` | No |
| `POST` | `/auth/verify-otp` | Verify OTP for activation | `{ userId, otp }` | No |
| `POST` | `/auth/resend-otp` | Resend activation OTP | `{ userId }` | No |

---

## Market Crops (`/api/crops`)

Handles the creation, reading, updating, and deletion of crop listings.

| Method | Endpoint | Description | Query / Body | Auth Required |
| --- | --- | --- | --- | --- |
| `POST` | `/crops` | Create a crop listing | `{ name, quantity, price, quality, description?, location? }` | Yes (Farmer) |
| `GET` | `/crops` | Get marketplace listings | `?search=&minPrice=&maxPrice=&quality=&location=&category=&sortBy=&order=` | Yes |
| `GET` | `/crops/my` | Get farmer's own crops | None | Yes (Farmer) |
| `PUT` | `/crops/:id` | Update crop listing | Mutable fields object | Yes (Owner) |
| `DELETE` | `/crops/:id` | Delete crop listing | None | Yes (Owner) |

---

## Trade & Orders (`/api/trade`)

Handles advanced trade flows, including bidding, negotiations, and orders.

### Bidding
| Method | Endpoint | Description | Request Body | Auth Required |
| --- | --- | --- | --- | --- |
| `POST` | `/trade/bid` | Place bid on auction | `{ cropId, amount }` | Yes |
| `GET` | `/trade/bids/incoming` | Get bids for farmer's crops | None | Yes (Farmer) |
| `GET` | `/trade/bids/accepted` | Get buyer's accepted bids | None | Yes (Buyer) |
| `GET` | `/trade/bids/history` | Get buyer's bid history | None | Yes (Buyer) |
| `PUT` | `/trade/bids/:id/status` | Accept/Reject bid | `{ status: "Accepted" or "Rejected" }` | Yes (Farmer) |

### Negotiations
| Method | Endpoint | Description | Request Body | Auth Required |
| --- | --- | --- | --- | --- |
| `POST` | `/trade/negotiation/start` | Start new negotiation | `{ cropId, message, offerAmount? }` | Yes (Buyer) |
| `POST` | `/trade/negotiation/offer` | Reply or send offer | `{ negotiationId, message?, amount? }` | Yes |
| `GET` | `/trade/negotiations/mine` | List user's negotiations | None | Yes (Buyer) |
| `PUT` | `/trade/negotiation/:id/accept` | Accept a negotiation | None | Yes (Farmer) |
| `PUT` | `/trade/negotiation/:id/reject` | Reject a negotiation | None | Yes (Farmer) |

### Orders
| Method | Endpoint | Description | Request Body | Auth Required |
| --- | --- | --- | --- | --- |
| `POST` | `/trade/orders` | Checkout and pay | `{ cropId, quantity, paymentMethod, shippingAddress, negotiationId?, bidId?, paymentDetails? }` | Yes (Buyer) |
| `GET` | `/trade/orders` | List user's orders | None | Yes |
| `PUT` | `/trade/orders/:id` | Update order status | `{ status }` ("Pending", "Shipped", etc) | Yes (Farmer/Admin) |

---

## Direct Bids & Messaging (`/api/bids` & `/api/messages`)

Alternative direct bid and message integrations.

| Method | Endpoint | Description | Request Payload | Auth Required |
| --- | --- | --- | --- | --- |
| `POST` | `/bids/place` | Place a bid directly | `{ listingId, buyerId, amount, quantity? }` | Yes |
| `GET` | `/bids/:listingId` | Get all bids on a crop | None | Yes |
| `PUT` | `/bids/:bidId/status` | Update bid status | `{ status }` | Yes (Farmer) |
| `POST` | `/messages/send` | Send direct message | `{ listingId, fromId, toId, text }` | Yes |
| `GET` | `/messages/conversation`| Get conversation | `?listingId=&user1=&user2=` | Yes |

---

## Price Transparency (`/api/prices`)

Provides active market pricing and historical price trends.

| Method | Endpoint | Description | Query Params | Auth Required |
| --- | --- | --- | --- | --- |
| `GET` | `/prices/current` | Latest APMC prices | None | Yes |
| `GET` | `/prices/trends` | Historical chart data | `?commodity=&days=30` | Yes |
| `GET` | `/prices/recommend` | Compare vs benchmark | `?commodity=&userPrice=` | Yes |

---

## AI Decision Support (`/api/decision`)

Generates time-series forecasts and rule-based insights for crops.

| Method | Endpoint | Description | Query Params | Auth Required |
| --- | --- | --- | --- | --- |
| `GET` | `/decision` | Forecast & Recommendation | `?crop=` | No |
| `GET` | `/decision/commodities`| Available crops in dataset | None | No |

---

## Administration (`/api/admin`)

Used for Trust & Safety verification and platform statistics.

| Method | Endpoint | Description | Target | Auth Required |
| --- | --- | --- | --- | --- |
| `POST` | `/admin/create-user` | Register offline users | `{ name, email, phone, role }` | Yes (Admin) |
| `GET` | `/admin/users` | List accounts | `?page=&limit=&role=` | Yes (Admin) |
| `PUT` | `/admin/users/:id/verify`| Mark user as verified | None | Yes (Admin) |
| `PUT` | `/admin/users/:id/ban` | Toggle account ban | None | Yes (Admin) |
| `GET` | `/admin/stats` | Dashboard KPIs | None | Yes (Admin) |
