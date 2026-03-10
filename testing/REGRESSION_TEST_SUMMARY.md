# Regression Testing Summary Document

This document summarizes the output of the regression tests run for both the backend and frontend modules of the AgriSahayak application. The detailed test outputs can be found within the `testing/` directory.

## Backend Regression Tests
- **Framework**: Jest (Unit and Integration Tests)
- **Overall Result**: 1 Test Suite Passed, 5 Test Suites Failed (2 Tests Passed, 17 Tests Failed)
- **Summary**:
  - The API Integration Test Suite (`tests/api.integration.test.js`) passed successfully.
  - The Unit Test Suites (`tests/crops.test.js`, `tests/admin.test.js`, `tests/auth.test.js`, `tests/price.test.js`, `tests/trade.test.js`) failed largely due to a module resolution error (`Cannot find module 'nodemailer'`) or undefined property errors during database mocking/cleanup (`Cannot read properties of undefined (reading '_id')`).
  - **Action Required**: Install `nodemailer` in the backend and ensure the mock user setup creates the correct database records before testing cleanup.

## Frontend Regression Tests
- **Framework**: Vitest & React Testing Library
- **Overall Result**: 2 Test Files Failed | 1 Passed. 1 Test Failed | 3 Passed.
- **Summary**:
  - The results are identical to the prior unit test run.
  - `src/features/auth/components/LoginForm.test.jsx`: Failed to run due to an unresolved import `react-hot-toast`. 
  - `src/features/farmer/components/CropForm.test.jsx`: 1 passed, 1 failed due to failing to find an input element with the placeholder text "1-500".
  - `src/features/trade/components/BuyNowButton.test.jsx`: 2 passed.
  - **Action Required**: Run `npm install react-hot-toast` in frontend directory and fix the placeholder text matching in `CropForm.test.jsx`.

## Raw Test Dumps
- Backend Output: `testing/backend_regression_test_output.txt`
- Frontend Output: `testing/frontend_regression_test_output.txt`

## Conclusion
The existing test suites were run as regression suites to verify continuous logic. The pipeline needs attention on dependency availability before actual logic bugs can be properly assessed for regressions. Results have been aggregated in the `testing` directory.
