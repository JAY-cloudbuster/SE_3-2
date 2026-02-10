# Buyer Activity Diagram  
## Multilingual Digital Marketplace for Indian Farmers

---

## Overview

This document presents the **Activity Diagram for the Buyer role** in the system.  
The activity diagram models the **end-to-end workflow** followed by a buyer, from login to post-purchase actions such as rating, reporting, and logout.

---

## Buyer Activity Diagram

```mermaid
flowchart TD
    Start([Start])
    Login[Login to System]
    Auth{Authenticated?}
    Browse[Browse Crop Listings]
    Search[Search Crops]
    Filter[Filter Crop Listings]
    ViewCrop[View Crop Details]
    ViewFarmer[View Farmer Profile]
    ViewReviews[View Ratings & Reviews]
    ViewMedia[View Crop Media]
    Seasonal[View Seasonal Offers]
    Recommend[Receive Personalized Recommendations]
    PurchaseType[Select Purchase Type]
    Fixed{Fixed Price?}
    BuyNow[Buy Crop at Fixed Price]
    Bid[Place Bid / Negotiate]
    Confirm[Confirm Order]
    Track[Track Order Status]
    Delivery[Receive Crop Delivery]
    Rate[Rate & Review Farmer]
    Issue{Report Issue?}
    Report[Report Listing / Raise Dispute]
    Chat[Use Secure Chat]
    Block[Block Farmer]
    Logout[Logout]
    End([End])

    Start --> Login
    Login --> Auth
    Auth -- No --> Login
    Auth -- Yes --> Browse
    Browse --> Search
    Search --> Filter
    Filter --> ViewCrop
    ViewCrop --> ViewFarmer
    ViewFarmer --> ViewReviews
    ViewReviews --> ViewMedia
    ViewMedia --> Seasonal
    Seasonal --> Recommend
    Recommend --> PurchaseType
    PurchaseType --> Fixed
    Fixed -- Yes --> BuyNow
    Fixed -- No --> Bid
    BuyNow --> Confirm
    Bid --> Confirm
    Confirm --> Track
    Track --> Delivery
    Delivery --> Rate
    Rate --> Issue
    Issue -- Yes --> Report
    Issue -- No --> Chat
    Report --> Chat
    Chat --> Block
    Block --> Logout
    Logout --> End
