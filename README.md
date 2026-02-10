Multilingual Digital Marketplace and Decision-Support Platform for Indian Farmers

## Overview

AgriTech is a comprehensive MERN stack platform designed to revolutionize the agricultural supply chain by connecting farmers directly with buyers. By eliminating intermediaries, the platform ensures fair pricing for farmers and transparent sourcing for buyers. It incorporates modern web technologies to provide a seamless, real-time, and localized experience for users across different regions and languages.

## Problem Statement

In the traditional agricultural market, farmers usually depend on middlemen to sell their produce, which often reduces their profit margins. Many farmers do not get real-time information about market prices or demand, while consumers end up paying higher prices.

## UML Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant UI as Frontend App
    participant API as Backend API
    participant DB as Database
    participant ML as AI/ML Engine
    actor Staff

    %% EPIC 1: User Access
    rect rgb(240, 248, 255)
        note right of Student: Epic 1: Access Control
        Student->>UI: Login (Credentials)
        UI->>API: POST /login
        API->>DB: Validate User & Role
        DB-->>API: User Verified
        API-->>UI: Return Auth Token
    end

    %% EPIC 2 & 4: Booking & Intelligence
    rect rgb(255, 250, 240)
        note right of Student: Epic 2 & 4: Booking & Crowd Prediction
        Student->>UI: View Menu & Slots
        par Fetch Real-time Data
            UI->>API: GET /slots (Availability)
            API->>DB: Query Slot Capacity
            DB-->>API: Slot Data
        and Fetch AI Predictions
            UI->>API: GET /predictions (Wait Time)
            API->>ML: Predict Crowd & Wait Time
            ML-->>API: Prediction Result
        end
        API-->>UI: Display Slots + Crowd Level
        
        Student->>UI: Book Meal (Slot ID)
        UI->>API: POST /book
        
        alt Slot Available
            API->>DB: Lock Slot & Save Booking
            DB-->>API: Confirmation
            
            %% EPIC 3: Token Generation
            API->>DB: Generate Unique Token
            DB-->>API: Token #123 Assigned
            API-->>UI: Booking Confirmed + Token #123
        else Slot Full
            API-->>UI: Error: Overbooking Prevented
        end
    end

    %% EPIC 3 & 6: Queue & Service
    rect rgb(240, 255, 240)
        note right of Student: Epic 3: Queue Management
        loop Live Queue Monitoring
            Student->>UI: Check Queue Position
            UI->>API: GET /queue-status
            API->>DB: Calculate Position
            DB-->>API: Position: 5th
            API-->>UI: Show Position & Est. Wait
        end

        note right of Staff: Epic 3 & 6: Fairness & Service
        Staff->>UI: Call Next Token
        UI->>API: POST /call-token
        API->>DB: Update Status (Serving)
        API-->>UI: Notify Student (Prepare)
        
        Staff->>UI: Mark Served
        API->>DB: Update Booking (Completed)
    end

    %% EPIC 5 & 6: Background Analytics (Async)
    rect rgb(245, 245, 245)
        note right of API: Epic 5 & 6: Analytics & Forecasting (Async)
        par Background Tasks
            API->>DB: Log Transaction for Audit
            API->>ML: Feed Booking Data (Retrain Model)
            API->>DB: Log Waste & Fairness Metrics
        end
    end
```