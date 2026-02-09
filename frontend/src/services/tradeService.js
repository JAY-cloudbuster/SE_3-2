import api from './api';

export const tradeService = {
  placeBid: (auctionId, amount) => api.post('/trade/bid', { auctionId, amount }), // Story 4.3 [cite: 149]
  sendOffer: (listingId, amount) => api.post('/trade/negotiate', { listingId, amount }), // Story 4.4 [cite: 154]
  getOrders: () => api.get('/trade/orders'), // Story 4.7 [cite: 170]
  updateOrderStatus: (id, status) => api.put(`/trade/orders/${id}`, { status }) // Story 4.8 [cite: 173]
};