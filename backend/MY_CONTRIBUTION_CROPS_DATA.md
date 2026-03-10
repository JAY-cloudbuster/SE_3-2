# My Contribution — Backend: Crops & Data

**Your Name:** _Replace with your name_

## 1. Area Covered
- Backend — Crops & data management for the marketplace (models, controllers, routes, tests).

## 2. Overview (what this backend area does)
- Stores and serves crop listings created by farmers.
- Implements business rules (quantity/price ranges, quality grades, availability).
- Provides endpoints for farmers to create/list their crops and for buyers to discover available crops.

## 3. Files I worked on
- `backend/models/Crop.js` — Mongoose schema for crop listings (fields, validation, timestamps).
- `backend/controllers/cropController.js` — Handlers: `createCrop`, `getMyCrops`, `getAllCrops`.
- `backend/routes/cropRoutes.js` — Route definitions and middleware protection for crop endpoints.
- `backend/tests/crops.test.js` — Unit/integration tests covering crop endpoints and validations.
- `backend/config/db.js` — (if touched) DB connection and seeding helpers used by crop features.

## 4. Data Model (fields & constraints)
- `name` (String, required)
- `farmer` (ObjectId → `User`, required)
- `quantity` (Number, required, min:1, max:200 quintals)
- `price` (Number, required, min:0, max:10,000 ₹/quintal)
- `quality` (String, enum: A|B|C, required)
- `description` (String, optional, max 500 chars)
- `image` (String, optional, default: `default_crop.jpg`)
- `location` (String, required)
- `isSold` (Boolean, default: false)
- `createdAt`, `updatedAt` (timestamps)

## 5. Endpoints I implemented / verified
- `POST /api/crops` — Create a new crop listing (auth required; farmer only).
  - Validates required fields; uses `req.user.id` as `farmer` and falls back `location` to user profile.
- `GET /api/crops/my` — Get logged-in farmer's listings (auth required).
- `GET /api/crops` — Get all available (unsold) crops for marketplace; populates farmer name/location/trustScore.

## 6. Business rules & validation
- Quantity constrained to 1–200 quintals per listing.
- Price constrained to ₹0–₹10,000 per quintal.
- Quality limited to A/B/C.
- Listings with `isSold: true` are excluded from marketplace results.

## 7. Tests & verification
- Wrote tests in `backend/tests/crops.test.js` covering:
  - Successful creation with valid data.
  - Validation failures for missing/invalid fields.
  - `GET /api/crops` returns only unsold items and populates farmer data.

## 8. How to run / reproduce locally
1. Start backend (from `backend`):

```powershell
npm install
npm run dev   # or node server.js
```

2. Run tests:

```powershell
cd backend
npm test
```

3. Example curl to create a crop (replace `<TOKEN>`):

```bash
curl -X POST http://localhost:5000/api/crops \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Red Onions","quantity":50,"price":35,"quality":"B","location":"Nashik, MH"}'
```

## 9. My specific contributions (short bullet list)
- Designed and implemented the `Crop` schema and validations.
- Implemented `createCrop`, `getMyCrops`, and `getAllCrops` controller logic.
- Added route protection to ensure only authenticated users can access endpoints.
- Wrote tests to cover happy and error paths for crop operations.
- Assisted with DB seeding/fixtures used in test runs (if applicable).

## 10. Evidence / artifacts
- Tests: `backend/tests/crops.test.js`
- Model: `backend/models/Crop.js`
- Controller: `backend/controllers/cropController.js`

## 11. Next steps / improvements I recommend
- Add image upload (S3/local storage) instead of storing filenames.
- Add pagination, filtering (by quality, price range, location) and search endpoints.
- Add status enum (Available / Reserved / Sold) and reservation flow.

---
Replace the placeholder name at the top and add any screenshots, test output, or PR links you want to show as evidence of your work.
