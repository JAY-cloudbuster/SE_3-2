# Farmer Activity Diagram  
## Multilingual Digital Marketplace for Indian Farmers

---

## Overview

This document presents the **Activity Diagram for the Farmer role** in the system.  
The activity diagram illustrates the **complete workflow followed by a farmer**, from logging into the system to managing crop listings, handling trades, resolving disputes, and logging out.

The diagram is written using **Mermaid syntax** and embedded directly in this README to support version control and DevOps best practices.

---

## Farmer Activity Diagram

```mermaid
flowchart TD
    Start([Start])
    Login[Login to System]
    Auth{Authenticated?}
    Profile[Create / Update Farmer Profile]
    AddCrop[Add Crop Listing]
    UploadDecision{Upload Crop Media?}
    UploadMedia[Upload Crop Media]
    SetPrice[Set Price / Auction Details]
    MarketPrices[View Market Prices]
    Trends[View Price Trends & Graphs]
    Recommend[Get Sell or Wait Recommendation]
    PublishDecision{Proceed to Publish?}
    Publish[Publish Crop Listing]
    Negotiate[Negotiate with Buyer]
    AcceptDecision{Accept Offer?}
    ConfirmOrder[Confirm Order]
    UpdateStatus[Update Order Status]
    IssueDecision{Order Issues?}
    RaiseDispute[Raise Dispute]
    VerifyDecision{Request Profile Verification?}
    SubmitDocs[Submit Verification Documents]
    ViewRatings[View Ratings & Reviews]
    BlockBuyer[Block Problematic Buyer]
    Logout[Logout]
    End([End])

    Start --> Login
    Login --> Auth
    Auth -- No --> Login
    Auth -- Yes --> Profile
    Profile --> AddCrop
    AddCrop --> UploadDecision
    UploadDecision -- Yes --> UploadMedia
    UploadDecision -- No --> SetPrice
    UploadMedia --> SetPrice
    SetPrice --> MarketPrices
    MarketPrices --> Trends
    Trends --> Recommend
    Recommend --> PublishDecision
    PublishDecision -- Yes --> Publish
    PublishDecision -- No --> AddCrop
    Publish --> Negotiate
    Negotiate --> AcceptDecision
    AcceptDecision -- Yes --> ConfirmOrder
    AcceptDecision -- No --> Negotiate
    ConfirmOrder --> UpdateStatus
    UpdateStatus --> IssueDecision
    IssueDecision -- Yes --> RaiseDispute
    IssueDecision -- No --> VerifyDecision
    RaiseDispute --> VerifyDecision
    VerifyDecision -- Yes --> SubmitDocs
    VerifyDecision -- No --> ViewRatings
    SubmitDocs --> ViewRatings
    ViewRatings --> BlockBuyer
    BlockBuyer --> Logout
    Logout --> End
