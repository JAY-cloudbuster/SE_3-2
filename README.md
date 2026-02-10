# AgriTech

## Overview

AgriTech is a comprehensive MERN stack platform designed to revolutionize the agricultural supply chain by connecting farmers directly with buyers. By eliminating intermediaries, the platform ensures fair pricing for farmers and transparent sourcing for buyers. It incorporates modern web technologies to provide a seamless, real-time, and localized experience for users across different regions and languages.

## Problem Statement

In the traditional agricultural market, farmers often face exploitation due to a lack of direct market access and reliance on multiple intermediaries. This results in significantly lower profits for producers while end consumers pay inflated prices. Additionally, information asymmetry regarding market trends and crop demand further disadvantages farmers. AgriTech aims to bridge this gap by providing a digital marketplace that fosters direct trade and transparency.

## Objectives

-   **Eliminate Intermediaries:** Facilitate direct transactions between farmers and buyers to maximize farmer profits.
-   **Ensure Fair Pricing:** Provide a platform where prices are determined by market demand and direct negotiation.
-   **Enhance Accessibility:** Offer multilingual support to cater to users from diverse linguistic backgrounds.
-   **Real-time Communication:** Enable instant negotiation and communication between parties.
-   **Transparency:** ensuring trust through verified profiles and secure transaction processes.

## Features

-   **User Authentication & Profiles:** Secure registration and login for Farmers, Buyers, and Admins.
-   **Role-Based Dashboards:** tailored interfaces for Farmers (managing crops, sales), Buyers (browsing, purchasing), and Admins (moderation).
-   **Crop Management:** Farmers can list crops with details like quantity, price, quality grade, and images.
-   **Real-time Negotiation:** Built-in chat system allowing buyers and farmers to negotiate prices and terms instantly.
-   **Order Management:** Track orders from placement to delivery with status updates.
-   **Multilingual Support:** Interface available in multiple Indian languages (English, Hindi, Tamil, Telugu, etc.) for inclusivity.
-   **Secure Payments:** Integration placeholders for handling secure financial transactions.
-   **Visual Analytics:** Charts and data visualization for market trends and personal sales history.

## Technology Stack

### Frontend
-   **Framework:** React (via Vite)
-   **Styling:** Tailwind CSS
-   **Animation:** Framer Motion
-   **Charts:** Chart.js, React-Chartjs-2
-   **Icons:** Lucide-React
-   **Internationalization:** i18next, React-i18next
-   **Real-time Communication:** Socket.io-client
-   **HTTP Client:** Axios

### Backend
-   **Runtime:** Node.js
-   **Framework:** Express.js
-   **Database:** MongoDB (with Mongoose ODM)
-   **Authentication:** JWT (JSON Web Tokens), BCrypt.js
-   **Real-time Communication:** Socket.io
-   **Cors:** Cross-Origin Resource Sharing

## System Architecture

The application follows a standard Client-Server architecture:
1.  **Client (Frontend):** A React Single Page Application (SPA) that interacts with the backend via RESTful APIs for data operations and Socket.io for real-time messaging.
2.  **Server (Backend):** An Express.js server that handles API requests, manages business logic, connects to the MongoDB database, and facilitates real-time communication.
3.  **Database:** MongoDB stores user data, crop listings, negotiations, and order history.

## Folder Structure

```
SE_3-2/
├── backend/
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers (Auth, Crops)
│   ├── middlewares/        # Middleware functions (Auth protection)
│   ├── models/             # Mongoose schemas (User, Crop, Negotiation, Order)
│   ├── routes/             # API route definitions
│   └── server.js           # Entry point for backend server
├── frontend/
│   ├── public/             # Static assets
│   └── src/
│       ├── assets/         # Images and global styles
│       ├── components/     # Reusable UI components
│       ├── context/        # React Context (Auth, Socket, Language)
│       ├── data/           # Static data files
│       ├── features/       # Feature-specific components (Auth, Moderation)
│       ├── hooks/          # Custom React hooks
│       ├── pages/          # Page components (Dashboards, Landing)
│       ├── services/       # API integration services
│       ├── utils/          # Utility functions
│       ├── App.jsx         # Main application component
│       └── main.jsx        # Entry point for React app
└── README.md
```

## Installation

### Prerequisites
-   Node.js (v14 or higher)
-   MongoDB (Local instance or Atlas URI)

### Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root of `backend` and add your configuration:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```

### Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

## How to Run

1.  **Start the Backend Server:**
    From the `backend` directory:
    ```bash
    npm run dev  # or npm start
    ```
    The server typically runs on `http://localhost:5000`.

2.  **Start the Frontend Application:**
    From the `frontend` directory:
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:5173` (default Vite port).

## User Roles

-   **Farmer:** Can list crops, view market trends, negotiate with buyers, and manage their sales dashboard.
-   **Buyer:** Can browse listings, initiate negotiations, place orders, and track purchases.
-   **Admin:** Oversees the platform, moderates users and listings, and ensures platform integrity.

## API Summary

### Authentication
-   `POST /api/auth/register`: Register a new user.
-   `POST /api/auth/login`: Authenticate user and get token.

### Crops
-   `GET /api/crops`: Retrieve all available crop listings.
-   `POST /api/crops`: Create a new crop listing (Protected).
-   `GET /api/crops/my`: Retrieve crops listed by the logged-in farmer (Protected).

*(Note: Real-time features like Negotiation use Socket.io events: `join_room`, `send_message`)*

## Assumptions & Limitations

-   **Assumptions:** Users have access to stable internet connectivity. The application assumes a single currency (INR) for transactions currently.
-   **Limitations:**
    -   Payment gateway integration is simulated/placeholder in the current version.
    -   Mobile responsiveness is optimized for standard devices but may vary on older browsers.
    -   Negotiation history persistence depends on the current implementation of message storage.

## Future Enhancements

-   **Mobile Application:** Developing a native mobile app using React Native for better accessibility in remote areas.
-   **AI Integration:** implementing AI-powered crop disease detection and yield prediction tools.
-   **Blockchain Supply Chain:** Utilizing blockchain to track produce from farm to fork for immutable transparency.
-   **Advanced Logistics:** Integration with third-party logistics providers for automated shipping calculations and tracking.

## Contributors

-   [Jayesh - CB.SC.U4CSE23453]
-   [Vrithika - CB.SC.U4CSE23457]
-   [Kokul - CB.SC.U4CSE23462]
-   [Yeshwanth - CB.SC.U4CSE23543]
-   [Pranav - CB.SC.U4CSE23453]
