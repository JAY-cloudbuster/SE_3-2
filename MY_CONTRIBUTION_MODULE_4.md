# Person 4 — Auth & User (Backend) - Contribution & Testing

## 1. Module Contribution Explanation

### **Overview**
My module, **Auth & User (Backend)**, serves as the secure foundation for the entire AgriTech Platform. It handles **user identity, security, and access control**. Without this module, there is no way to securely identify farmers, buyers, or admins, and no way to protect sensitive data or actions (like creating crops or bidding).

### **Key Components & Logic**

#### **1. Database Schema (`models/User.js`)**
I implemented the `User` schema using Mongoose to ensure data integrity:
-   **Fields:**
    -   `phone`: The primary identifier. I enforced a 10-digit regex pattern (`/^\d{10}$/`) and uniqueness to prevent duplicate accounts.
    -   `password`: Stored securely. I added a `minlength` of 6 characters for security.
    -   `role`: An enum restricting users to `'FARMER'`, `'BUYER'`, or `'ADMIN'`.
    -   `language`: Supports 13 Indian languages (e.g., 'en', 'hi', 'ta') to make the platform accessible.
-   **Security Logic (Pre-save Hook):**
    -   I used a Mongoose `pre('save')` middleware to automatically hash passwords using `bcryptjs` before they are stored in the database. This ensures that even if the database is compromised, actual passwords remain safe.

#### **2. Authentication Logic (`controllers/authController.js`)**
I built the core logic for user onboarding and access:
-   **Registration (`registerUser`)**:
    -   Validates that `phone` and `password` are present.
    -   Checks if a user with the given phone already exists to prevent duplicates.
    -   Creates a new user instance.
    -   Returns a **JSON Web Token (JWT)** along with user details upon success.
-   **Login (`loginUser`)**:
    -   Finds the user by phone and explicitly selects the password (which is hidden by default in queries).
    -   Uses the `matchPassword` method (which I added to the User model) to compare the entered plain-text password with the stored hash.
    -   If valid, it issues a JWT signed with our secret key.

#### **3. API Routes (`routes/authRoutes.js`)**
I defined clean, RESTful endpoints:
-   `POST /api/auth/register`: For creating new accounts.
-   `POST /api/auth/login`: For signing in.
-   These routes are mounted in `server.js` under `/api/auth`.

#### **4. Security Middleware (`middlewares/authMiddleware.js`)**
I created middleware to protect sensitive routes:
-   **`protect`**: This middleware intercepts requests to protected endpoints. It extracts the JWT from the `Authorization` header (`Bearer <token>`), verifies it, decodes the user ID, and fetches the user from the DB (attaching it to `req.user`). If any step fails (no token, invalid signature), it denies access with a 401 status.
-   **`admin`**: An additional layer that checks `req.user.role`. If the user isn't an ADMIN, it forbids access, protecting critical moderation features.

---

## 2. Testing Document (Module 4)

Below are the specific test cases for my module.

### **2.1 Registration (POST /api/auth/register)**

| ID | Test Case | Steps | Expected Result |
|----|-----------|--------|------------------|
| **BR1** | **Valid Registration** | Send `POST` request with valid phone (10 digits), password (≥6 chars), and role. | **Status 201 (Created)**. <br>Response includes `token` and `user` object (phone, role, name, etc.). |
| **BR2** | **Duplicate Phone** | Register a user. Then try to register again with the **same** phone number. | **Status 400 (Bad Request)**. <br>Error message: "User already exists". |
| **BR3** | **Missing Phone** | Send `POST` request with password but **no** phone. | **Status 400**. <br>Error: "Please add all required fields". |
| **BR4** | **Missing Password** | Send `POST` request with phone but **no** password. | **Status 400**. <br>Error: "Please add all required fields". |
| **BR5** | **Invalid Phone Format** | Send `POST` with a phone number that is not 10 digits (e.g., 12345). | **Status 400** or Mongoose Validation Error. <br>Message: "Please enter a valid 10-digit phone number". |
| **BR6** | **Short Password** | Send `POST` with a password shorter than 6 characters. | **Status 400** or Mongoose Validation Error. |
| **BR7** | **Optional Fields** | Send `POST` including `name`, `language`, and `avatarUrl`. | **Status 201**. <br>Response `user` object contains the provided name, language, and avatar. |
| **BR8** | **Security check** | Register a user, then check the database (or console log). | Password field in DB should be an encoded **bcrypt hash**, NOT plain text. |

### **2.2 Login (POST /api/auth/login)**

| ID | Test Case | Steps | Expected Result |
|----|-----------|--------|------------------|
| **BL1** | **Valid Login** | Send `POST` with correct, registered unique phone and password. | **Status 200 (OK)**. <br>Response includes `token` and `user` object. |
| **BL2** | **Wrong Password** | Send `POST` with correct phone but **incorrect** password. | **Status 401 (Unauthorized)**. <br>Error: "Invalid credentials". |
| **BL3** | **Unknown Phone** | Send `POST` with a phone number that is NOT registered. | **Status 401**. <br>Error: "Invalid credentials". |
| **BL4** | **Missing Credentials** | Send `POST` with missing phone or password. | **Status 400** or **401** (depending on validation layer). |

### **2.3 Middleware & Authorization**

| ID | Test Case | Steps | Expected Result |
|----|-----------|--------|------------------|
| **BM1** | **No Token** | Try to access a protected route (e.g., `GET /api/crops/my`) **without** an Authorization header. | **Status 401**. <br>Error: "Not authorized, no token". |
| **BM2** | **Invalid Token** | Try to access a protected route with a fake or malformed token (e.g., "Bearer 12345"). | **Status 401**. <br>Error: "Not authorized, token failed". |
| **BM3** | **Valid Token** | Access protected route with a valid token from Login/Register. | **Status 200**. <br>Request proceeds; `req.user` is populated in backend. |
| **BM4** | **Admin Access Denied** | Log in as **FARMER** and try to access an Admin-only route. | **Status 401**. <br>Error: "Not authorized as an admin". |
| **BM5** | **Admin Access Granted** | Log in as **ADMIN** and try to access an Admin-only route. | **Status 200**. <br>Request proceeds. |

### **2.4 User Model Validation**

| ID | Test Case | Steps | Expected Result |
|----|-----------|--------|------------------|
| **UM1** | **Phone Unique** | (Database Level) Attempt to insert two documents with same phone. | Database throws **duplicate key error**. |
| **UM2** | **Phone Format** | (Database Level) Attempt to save user with `phone: "abc"`. | Database throws **validation error** (RegEx mismatch). |
| **UM3** | **Role Enum** | Attempt to save user with `role: "SUPERUSER"`. | Database throws **validation error** (Value not in enum). |
| **UM4** | **Language Enum** | Attempt to save user with `language: "fr"` (French, not supported). | Database throws **validation error**. |
