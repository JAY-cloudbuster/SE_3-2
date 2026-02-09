import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data)); // Auto-login often happens
    }
    return response;
  },
  login: async (userData) => {
    const response = await api.post('/auth/login', userData);
    if (response.data) {
      // Store entire auth response including token and user details
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response;
  },
  logout: () => {
    localStorage.removeItem('user');
  },
};