import apiClient from './apiClient';

export const userService = {
  createUser: async (payload) => {
    const res = await apiClient.post('/users', payload);
    return res.data.data;
  },

  getAllUsers: async () => {
    const res = await apiClient.get('/users');
    return res.data.data;
  },

  getUserById: async (id) => {
    const res = await apiClient.get(`/users/${id}`);
    return res.data.data;
  },

  updateUser: async (id, payload) => {
    const res = await apiClient.put(`/users/${id}`, payload);
    return res.data.data;
  },

  updateUserStatus: async (id, active) => {
    const res = await apiClient.put(`/users/${id}/status`, { active });
    return res.data.data;
  },

  updateUserRole: async (id, role) => {
    const res = await apiClient.put(`/users/${id}/role`, { role });
    return res.data.data;
  },

  deleteUser: async (id) => {
    const res = await apiClient.delete(`/users/${id}`);
    return res.data;
  },

  getAvailableTechnicians: async (specialization) => {
    const res = await apiClient.get('/users/technicians', {
      params: specialization ? { specialization } : {},
    });
    return res.data.data;
  },

  getProfile: async () => {
    const res = await apiClient.get('/users/profile');
    return res.data.data;
  },

  updateProfile: async (payload) => {
    const res = await apiClient.put('/users/profile', payload);
    return res.data.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const res = await apiClient.put('/users/profile/password', { currentPassword, newPassword });
    return res.data;
  },
};
