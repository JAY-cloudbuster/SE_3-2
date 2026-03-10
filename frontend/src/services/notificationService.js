import api from './api';

export const notificationService = {
  getMyNotifications: async () => api.get('/notifications'),
  markRead: async (id) => api.put(`/notifications/${id}/read`),
  markAllRead: async () => api.put('/notifications/read-all'),
};
