\# Class Diagram Documentation  

\## Multilingual Digital Marketplace \& Decision-Support Platform for Indian Farmers



---



\## Overview



This document presents the \*\*Class Diagram\*\* for the Multilingual Digital Marketplace and Decision-Support Platform for Indian Farmers.  

The class diagram models the \*\*core domain entities\*\*, their attributes, and relationships, and serves as the foundation for backend development and database design.



---



\## Purpose of the Class Diagram



The class diagram helps developers to:

\- Understand the overall structure of the system

\- Identify key entities and their responsibilities

\- Design database schemas and backend models

\- Maintain consistency between design and implementation



This diagram is derived directly from the project epics and user stories.



---



\## Class Diagram



```mermaid

classDiagram



class User {

&nbsp; userId

&nbsp; name

&nbsp; phone

&nbsp; passwordHash

&nbsp; role

&nbsp; language

&nbsp; avatarUrl

&nbsp; city

&nbsp; state

&nbsp; bio

&nbsp; verified

}



class Farmer {

&nbsp; farmerId

&nbsp; farmDetails

}



class Buyer {

&nbsp; buyerId

}



class Admin {

&nbsp; adminId

}



class Crop {

&nbsp; cropId

&nbsp; name

&nbsp; quality

&nbsp; quantity

&nbsp; price

&nbsp; availabilityStatus

&nbsp; published

}



class Order {

&nbsp; orderId

&nbsp; totalAmount

&nbsp; status

&nbsp; createdAt

}



class Auction {

&nbsp; auctionId

&nbsp; reservePrice

&nbsp; startTime

&nbsp; endTime

&nbsp; status

}



class Bid {

&nbsp; bidId

&nbsp; amount

&nbsp; bidTime

}



class Review {

&nbsp; reviewId

&nbsp; rating

&nbsp; comment

&nbsp; createdAt

}



class TrustScore {

&nbsp; score

}



User <|-- Farmer

User <|-- Buyer



User --> TrustScore : has

Admin --> User : verifies



Farmer "1" --> "many" Crop : lists

Buyer "1" --> "many" Order : places

Farmer "1" --> "many" Order : fulfills



Crop "1" --> "0..1" Auction : listedAs

Auction "1" --> "many" Bid : receives

Buyer "1" --> "many" Bid : submits



Order --> Review : generates




