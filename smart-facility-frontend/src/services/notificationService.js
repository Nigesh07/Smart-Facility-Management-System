import apiClient from './apiClient';

export const notificationService = {
  getMyNotifications: async () => {
    const res = await apiClient.get('/notifications');
    return res.data.data;
  },

  getUnreadCount: async () => {
    const res = await apiClient.get('/notifications/unread-count');
    return res.data.data.unreadCount;
  },

  markAsRead: async (id) => {
    const res = await apiClient.put(`/notifications/${id}/read`);
    return res.data;
  },

  markAllAsRead: async () => {
    const res = await apiClient.put('/notifications/read-all');
    return res.data;
  },
};
