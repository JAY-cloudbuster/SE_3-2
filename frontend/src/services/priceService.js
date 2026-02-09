import api from './api';

export const priceService = {
  getCurrentPrices: (crop) => api.get(`/prices/current?crop=${crop}`), // Story 5.1 [cite: 191]
  getHistoricalTrends: (crop) => api.get(`/prices/history?crop=${crop}`), // Story 5.4 [cite: 212]
  getRecommendation: (crop) => api.get(`/recommendation?crop=${crop}`) // Story 5.8 [cite: 240]
};