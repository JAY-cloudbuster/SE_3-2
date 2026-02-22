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
  /** Place a bid on an auction */
  placeBid: async (bidData) => api.post('/trade/bid', bidData),

  /** Start a new negotiation for a crop */
  startNegotiation: async (data) => api.post('/trade/negotiation/start', data),

  /** Send a price offer in an existing negotiation */
  sendOffer: async (offerData) => api.post('/trade/negotiation/offer', offerData),

  /** Accept a negotiation (farmer only) */
  acceptNegotiation: async (negotiationId) => api.put(`/trade/negotiation/${negotiationId}/accept`),

  /** Reject a negotiation (farmer only) */
  rejectNegotiation: async (negotiationId) => api.put(`/trade/negotiation/${negotiationId}/reject`),

  /** Create an order (buy now or from negotiation) */
  createOrder: async (orderData) => api.post('/trade/orders', orderData),

  /** Get current user's orders */
  getOrders: async () => api.get('/trade/orders'),

  /** Update order status (farmer only) */
  updateOrderStatus: async (id, data) => api.put(`/trade/orders/${id}`, data),
};