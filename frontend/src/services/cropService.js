import api from './api';

export const cropService = {
  // Create a new listing
  create: async (data) => {
    const response = await api.post('/crops', data);
    return response;
  },

  // Get logged-in user's inventory
  getMyCrops: async () => {
    const response = await api.get('/crops/my');
    return response;
  },

  // Get all crops (for marketplace)
  getAll: async () => {
    const response = await api.get('/crops');
    return response;
  }
};