# Unit Testing Summary Document

This document summarizes the output of the unit tests run for both the backend and frontend modules of the application. The detailed test outputs can be found within the `testing/` directory.

## Backend Unit Tests
- **Framework**: Jest
- **Overall Result**: 5/5 Test Suites Failed (0 tests executed)
- **Error Summary**: The test suites failed to run due to a module resolution error. The backend tests rely on `nodemailer` module from `utils/emailService.js`, but Jest cannot resolve it.
  - *Failed suites*: `tests/crops.test.js`, `tests/trade.test.js`, `tests/price.test.js`, `tests/admin.test.js`, `tests/auth.test.js`.
  - **Action Required**: Run `npm install nodemailer` in the backend directory or verify module path.

### Backend Test Cases (Attempted to execute)

#### Auth API (`tests/auth.test.js`)
- `POST /api/auth/register`
  - *should register a new user successfully (201)*
  - *should fail if phone is missing (400)*
  - *should fail if duplicate phone is registered (400)*
- `POST /api/auth/login`
  - *should login successfully with correct credentials (200)*
  - *should fail login with wrong password (401)*
  - *should fail login with non-existent phone (401)*

#### Admin API (`tests/admin.test.js`)
- `GET /api/admin/users`
  - *should return users for admin (200)*
  - *should reject non-admin users (401)*
  - *should reject unauthenticated requests (401)*
- `PUT /api/admin/users/:id/verify`
  - *should verify a user (200)*
- `PUT /api/admin/users/:id/ban`
  - *should ban a user (200)*
- `GET /api/admin/stats`
  - *should return platform statistics (200)*

#### Crops API (`tests/crops.test.js`)
- `POST /api/crops`
  - *should create a crop with valid data (201)*
  - *should fail if price is negative (Validaton Error)*
  - *should fail without token (401)*
- `GET /api/crops`
  - *should return empty list initially*
  - *should return listed crops*

#### Prices API (`tests/price.test.js`)
- `GET /api/prices/current`
  - *should return current prices (200)*
  - *should fail without auth (401)*
- `GET /api/prices/trends`
  - *should return trend data (200)*
  - *should filter by commodity*
- `GET /api/prices/recommend`
  - *should return recommendation (200)*
  - *should handle missing commodity (400)*

#### Trade API (`tests/trade.test.js`)
- `POST /api/trade/orders`
  - *should create an order with valid data (201)*
  - *should fail without auth token (401)*
- `GET /api/trade/orders`
  - *should return orders for the user (200)*
- `PUT /api/trade/orders/:id`
  - *should update order status (200)*
- `POST /api/trade/negotiation/start`
  - *should start a negotiation (201)*
  - *should fail to negotiate on own crop (400)*

## Frontend Unit Tests
- **Framework**: Vitest & React Testing Library
- **Overall Result**: 2 Test Files Failed | 1 Passed. 1 Test Failed | 3 Passed.
- **Test File Results**:
  1. `src/features/auth/components/LoginForm.test.jsx`: Failed to run due to an unresolved import `react-hot-toast`. 
  2. `src/features/farmer/components/CropForm.test.jsx`: 1 passed, 1 failed. Output shows inability to find an input element with placeholder text "1-500".
  3. `src/features/trade/components/BuyNowButton.test.jsx`: 2 passed in test suite.
  - **Action Required**: Run `npm install react-hot-toast` in frontend directory and fix the placeholder text matching in `CropForm.test.jsx`.

### Frontend Test Cases (Attempted to execute)
- `CropForm.test.jsx`:
  - *renders form fields*
  - *submits data correctly*
- `BuyNowButton.test.jsx`:
  - *renders Buy Now button correctly*
  - *handles click event*

## Raw Test Dumps
- Backend Output: `testing/backend_test_output.txt`
- Frontend Output: `testing/frontend_test_output.txt`

## Conclusion
The application logic needs some missing dependency resolutions (`nodemailer` for backend, `react-hot-toast` for frontend) and minor test value adjustments. Outputs and results have been successfully generated and aggregated.
