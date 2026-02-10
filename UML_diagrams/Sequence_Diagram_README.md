# Sequence Diagram: Agricultural Marketplace System

This directory contains the Mermaid representation of the system's core sequence flow.

```mermaid
sequenceDiagram
    autonumber
    actor Farmer
    actor Buyer
    actor Admin
    participant Web as Web / Mobile UI
    participant API as Backend API
    participant DB as Database
    participant Ext as External Services

    %% Registration & Login
    Farmer->>Web: Register (role, language, location)
    Web->>API: POST /register
    API->>DB: Save user with role & language
    DB-->>API: User created
    API-->>Web: Registration successful

    Buyer->>Web: Login (email, password)
    Web->>API: POST /login
    API->>DB: Validate credentials
    DB-->>API: User data
    API-->>Web: JWT Token

    %% Profile Management
    Farmer->>Web: Create / Edit Profile
    Web->>API: PUT /profile
    API->>DB: Save profile data
    DB-->>API: Profile saved
    API-->>Web: Profile updated

    %% Crop Management
    Farmer->>Web: Add Crop Listing
    Web->>API: POST /crops
    API->>DB: Store crop listing
    
    opt Upload Images
        Farmer->>Web: Upload Images
        Web->>API: Save media reference
        API->>DB: Crop listing updated
    end

    %% Browsing & Purchasing
    Buyer->>Web: Browse / Search Crops
    Web->>API: GET /crops/listing
    API->>DB: Fetch crop listings
    DB-->>API: Listings
    API-->>Web: Show results

    opt View Farmer Profile
        Buyer->>Web: Open Farmer Profile
        Web->>API: GET /farmer/{id}
        API->>DB: Fetch profile & ratings
        DB-->>API: Profile data
        API-->>Web: Display profile
    end

    alt Direct Purchase
        Buyer->>Web: Buy Now
        Web->>API: POST /orders
        API->>DB: Create order
        DB-->>API: Order created
        API-->>Web: Order confirmation
    else Bid / Negotiate
        Buyer->>Web: Place Bid / Send Offer
        Web->>API: POST /bids-or-offers
        API->>DB: Save bid / offer
        DB-->>API: Saved
        Farmer->>Web: Accept / Reject Offer
        Web->>API: PUT /offers/{id}
        API->>DB: Update deal status
        DB-->>API: Deal finalized
        API-->>Web: Order created
    end

    %% Market Insights & Localization
    Farmer->>Web: View Market Prices
    Web->>API: GET /prices
    API->>DB: Fetch market price data
    DB-->>API: Price data
    API-->>Web: Display prices

    opt Decision Support
        API->>Ext: Analyze trends & demand
        Ext-->>API: Recommendation (ML / AI)
    end

    opt Multilingual Support
        Web->>API: Fetch user language
        API->>DB: Get language preference
        DB-->>API: Language
        API-->>Web: Render localized UI
    end

    opt Voice & Audio Assistance
        Web->>Ext: Speech-to-text / Text-to-speech
        Ext-->>Web: Converted input/output
    end

    %% Verification & Admin
    rect rgb(240, 240, 240)
        Note right of Admin: Profile Verification
        Farmer->>Web: Submit certification request
        Web->>API: POST /verify
        API->>DB: Store documents
        Admin->>Web: Review certification
        Web->>API: Approve / Reject
        API->>DB: Update verification status
    end

    %% Feedback & Support
    opt Ratings & Reviews
        Buyer->>Web: Leave rating
        Web->>API: POST /reviews
        API->>DB: Save review
    end

    opt Dispute Handling
        Buyer->>Web: Raise dispute
        Web->>API: POST /disputes
        API->>DB: Store dispute
        Admin->>Web: Resolve dispute
        Web->>API: Update resolution
    end