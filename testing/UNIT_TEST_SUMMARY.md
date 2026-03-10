# Unit Testing Summary Document

This document summarizes the output of the unit tests run for both the backend and frontend modules of the application. The detailed test outputs can be found within the `testing/` directory.

## Backend Unit Tests
- **Framework**: Jest
- **Overall Result**: 5/5 Test Suites Failed (0 tests executed)
- **Error Summary**: The test suites failed to run due to a module resolution error. The backend tests rely on `nodemailer` module from `utils/emailService.js`, but Jest cannot resolve it.
  - *Failed suites*: `tests/crops.test.js`, `tests/trade.test.js`, `tests/price.test.js`, `tests/admin.test.js`, `tests/auth.test.js`.
  - **Action Required**: Run `npm install nodemailer` in the backend directory or verify module path.

## Frontend Unit Tests
- **Framework**: Vitest & React Testing Library
- **Overall Result**: 2 Test Files Failed | 1 Passed. 1 Test Failed | 3 Passed.
- **Test File Results**:
  1. `src/features/auth/components/LoginForm.test.jsx`: Failed to run due to an unresolved import `react-hot-toast`. 
  2. `src/features/farmer/components/CropForm.test.jsx`: 1 passed, 1 failed. Output shows inability to find an input element with placeholder text "1-500".
  3. `src/features/trade/components/BuyNowButton.test.jsx`: 2 passed in test suite.
  - **Action Required**: Run `npm install react-hot-toast` in frontend directory and fix the placeholder text matching in `CropForm.test.jsx`.

## Raw Test Dumps
- Backend Output: `testing/backend_test_output.txt`
- Frontend Output: `testing/frontend_test_output.txt`

## Conclusion
The application logic needs some missing dependency resolutions (`nodemailer` for backend, `react-hot-toast` for frontend) and minor test value adjustments. Outputs and results have been successfully generated and aggregated.
