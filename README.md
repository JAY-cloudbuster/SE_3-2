Multilingual Digital Marketplace and Decision-Support Platform for Indian Farmers

## Overview

AgriTech is a comprehensive MERN stack platform designed to revolutionize the agricultural supply chain by connecting farmers directly with buyers. By eliminating intermediaries, the platform ensures fair pricing for farmers and transparent sourcing for buyers. It incorporates modern web technologies to provide a seamless, real-time, and localized experience for users across different regions and languages.

## Problem Statement

M5 — Multilingual Digital Marketplace and Decision-Support Platform for
Indian Farmers
This project focuses on creating a multilingual digital marketplace and decision-support ecosys
tem that enables Indian farmers to directly connect with institutional buyers, retailers, coop
eratives, and community procurement groups without excessive dependence on intermediaries.
The system must be carefully engineered to address real challenges faced by farmers, such as
limited access to transparent pricing, lack of negotiation power, unpredictable demand cycles,
and varying levels of digital literacy. Instead of functioning as a typical e-commerce listing
portal, the platform should offer rich decision-enabling capabilities—price comparison dash
boards, historical price visualizations, demand forecast models, quality-based price assessment,
and structured negotiation workflows. The interface must support native Indian languages
and multimodal interaction including voice-based navigation, icon-based user guidance, simple
visual metaphors, and SMS/IVR support where needed, recognizing that many stakeholders
operate in low-technology environments.
Technical depth may include AI-driven price prediction models, crop-based recommendation
systems, location-aware logistics planning, or analytics on market trends. Features such as
secure identity verification, auction or bidding models, dispute resolution processes, and trust
building mechanisms like structured ratings or verified seller profiles can enhance credibility
and adoption. The platform may further incorporate sustainability and financial empowerment
6

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

## Tech Stack

### Frontend
- **Framework:** React (via Vite) – responsive, interactive, and multilingual UI  
- **Styling:** Tailwind CSS – modern and utility-first design  
- **Animation:** Framer Motion – smooth UI transitions  
- **Charts & Visualization:** Chart.js, React-Chartjs-2 – price trends and market dashboards  
- **Icons:** Lucide-React – clean, lightweight iconography  
- **Internationalization:** i18next, React-i18next – supports multiple Indian languages  
- **Real-time Communication:** Socket.io-client – live updates for auctions and notifications  
- **HTTP Client:** Axios – API requests and data fetching  

### Backend
- **Runtime:** Node.js – scalable server environment  
- **Framework:** Express.js – RESTful APIs and backend logic  
- **Database:** MongoDB (with Mongoose ODM) – stores crop data, user profiles, transactions, and historical market data  
- **Authentication & Security:** JWT (JSON Web Tokens), BCrypt.js – secure login and data protection  
- **Real-time Communication:** Socket.io – handles live auction updates and notifications  
- **Cors:** Cross-Origin Resource Sharing – enables frontend-backend communication  

### AI/ML
- Python (scikit-learn, TensorFlow, PyTorch) – for price prediction, demand forecasting, and crop recommendations  

### DevOps
- Git, GitHub, CI/CD pipelines – version control, collaboration, and automated deployment  

### Others
- SMS/IVR APIs – multimodal access for low-tech or low-connectivity users  

## System Architecture
The system follows a layered architecture for scalability, security, and AI-powered decision support:
1. *User Layer (Frontend)*
   - Provides a responsive UI for farmers, buyers, and administrators.  
   - Supports multilingual text, voice-based navigation, icons, and SMS/IVR interfaces.  
   - Displays dashboards, price charts, auction status, and notifications.

2. *Application Layer (Backend)*
   - Handles API requests from the frontend and coordinates workflows.  
   - Implements core business logic: crop evaluation, auction management, and price calculations.  
   - Integrates with AI/ML services for predictive analytics and recommendations.  
   - Manages authentication, authorization, and secure data access.
   3. *Data Layer (Database)*
   - Stores user profiles, crop details, transactions, historical market data, and audit logs.  
   - Enables fast queries for dashboards and AI/ML models.  
   - Ensures data consistency, security, and backup.
   4. *AI/ML Layer*
   - Runs models for crop quality assessment, price prediction, and demand forecasting.  
   - Supports decision-making for farmers using historical data and market trends.  
   - Integrates seamlessly with backend APIs to provide real-time recommendations.

   5. *Integration & Communication Layer*
   - Interfaces with third-party services: SMS/IVR gateways, payment gateways, and government schemes APIs.  
   - Ensures reliable communication, notifications, and alerts to all stakeholders.

   6. *Security & DevOps*
   - Implements secure authentication, data encryption, and role-based access control.  
   - Uses CI/CD pipelines for automated testing, deployment, and monitoring.


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

  
 *Overall Flow:*  
Farmer interacts with *Frontend → Backend APIs → Database + AI Layer → Response*  
This ensures *real-time insights, secure transactions, and multilingual accessibility*, all in a scalable architecture.


## Contributors

-   [Jayesh - CB.SC.U4CSE23453]
-   [Vrithika - CB.SC.U4CSE23457]
-   [Kokul - CB.SC.U4CSE23462]
-   [Yeshwanth - CB.SC.U4CSE23543]
-   [Pranav - CB.SC.U4CSE23453]



SoC @AVV Coimbatore
23CSE311 Software Engineering- Winter 2025
components such as subsidy awareness prompts, government scheme integration, crop advi
sory channels, or micro-financing partner interactions. The system should highlight thoughtful
engineering values—including inclusivity, fairness, security, and usability—and demonstrate
originality beyond superficial marketplace templates commonly published online.
