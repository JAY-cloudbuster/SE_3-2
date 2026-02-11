/**
 * @fileoverview Trade Service for AgriSahayak Frontend
 * 
 * This module provides functions for trade-related operations including
 * bid placement, offer sending, order retrieval, and order status updates.
 * 
 * ⚠️ IMPORTANT: The corresponding backend API endpoints (under /api/trade)
 * are NOT YET IMPLEMENTED. These service functions exist as frontend stubs
 * awaiting backend development. The trade routes need to be created in
 * the backend (routes/tradeRoutes.js + controllers/tradeController.js).
 * 
 * Planned backend endpoints:
 * - POST /api/trade/bid           → Place a bid on an auction
 * - POST /api/trade/offer         → Send a price offer in negotiation
 * - GET  /api/trade/orders        → Get user's orders
 * - PUT  /api/trade/orders/:id    → Update order status
 * 
 * @module services/tradeService
 * @requires services/api - Pre-configured Axios instance with auth interceptor
 * 
 * @see Epic 4, Story 4.3 - Place Bids
 * @see Epic 4, Story 4.4 - Negotiate Price
 * @see Epic 4, Story 4.8 - Order Status Updates
 * @see TradeDashboard.jsx - Main trading UI component
 */

import api from './api';

/**
 * Trade Service Object
 * 
 * Exposes methods for all trade-related API operations.
 * ⚠️ All methods will fail until backend trade routes are implemented.
 * 
 * @namespace tradeService
 */
export const tradeService = {
  /**
   * Place a Bid on an Auction
   * 
   * Submits a bid for a crop auction. The bid amount must exceed
   * the current highest bid.
   * 
   * ⚠️ Backend endpoint NOT IMPLEMENTED — will return 404
   * 
   * @async
   * @function placeBid
   * @param {Object} bidData - Bid details
   * @param {string} bidData.auctionId - ID of the auction to bid on
   * @param {number} bidData.amount - Bid amount in ₹
   * @returns {Promise<import('axios').AxiosResponse>} Response with bid confirmation
   * 
   * @see Epic 4, Story 4.3 - Place Bids via Auction
   * @see BidPanel.jsx - Frontend component for placing bids
   */
  placeBid: async (bidData) => api.post('/trade/bid', bidData),

  /**
   * Send a Price Offer in Negotiation
   * 
   * Sends a new price offer to the other party in a negotiation.
   * Creates a message with type 'offer' in the Negotiation document.
   * 
   * ⚠️ Backend endpoint NOT IMPLEMENTED — will return 404
   * 
   * @async
   * @function sendOffer
   * @param {Object} offerData - Offer details
   * @param {string} offerData.negotiationId - ID of the negotiation
   * @param {number} offerData.amount - Offered price in ₹
   * @param {string} [offerData.message] - Optional message with the offer
   * @returns {Promise<import('axios').AxiosResponse>} Response with updated negotiation
   * 
   * @see Epic 4, Story 4.4 - Negotiate Price
   * @see NegotiationChat.jsx - Frontend negotiation interface
   */
  sendOffer: async (offerData) => api.post('/trade/offer', offerData),

  /**
   * Get User's Orders
   * 
   * Retrieves all orders for the authenticated user (as buyer or farmer).
   * Used by the Trade Dashboard and Order Tracking components.
   * 
   * ⚠️ Backend endpoint NOT IMPLEMENTED — will return 404
   * 
   * @async
   * @function getOrders
   * @returns {Promise<import('axios').AxiosResponse>} Response with array of order documents
   * 
   * @see Epic 4, Story 4.7 - Order Confirmation
   * @see OrderTrackingCard.jsx - Displays order status
   */
  getOrders: async () => api.get('/trade/orders'),

  /**
   * Update Order Status
   * 
   * Updates the fulfillment status of an order (e.g., Pending → Shipped).
   * Only the farmer who owns the order can update its status.
   * 
   * ⚠️ Backend endpoint NOT IMPLEMENTED — will return 404
   * 
   * @async
   * @function updateOrderStatus
   * @param {string} id - Order ID to update
   * @param {Object} data - Status update data
   * @param {string} data.status - New status: 'Processing', 'Shipped', 'Delivered', 'Cancelled'
   * @returns {Promise<import('axios').AxiosResponse>} Response with updated order
   * 
   * @see Epic 4, Story 4.8 - Order Status Updates
   * @see FarmerOrders.jsx - Farmer's order management view
   */
  updateOrderStatus: async (id, data) => api.put(`/trade/orders/${id}`, data),
};