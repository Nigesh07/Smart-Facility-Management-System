import apiClient from './apiClient';

export const categoryService = {
  getActiveCategories: async () => {
    const res = await apiClient.get('/categories');
    return res.data.data;
  },

  getAllCategories: async () => {
    const res = await apiClient.get('/categories/all');
    return res.data.data;
  },

  createCategory: async (payload) => {
    const res = await apiClient.post('/categories', payload);
    return res.data.data;
  },

  updateCategory: async (id, payload) => {
    const res = await apiClient.put(`/categories/${id}`, payload);
    return res.data.data;
  },

  updateCategoryStatus: async (id, active) => {
    const res = await apiClient.put(`/categories/${id}/status`, { active });
    return res.data.data;
  },

  deleteCategory: async (id) => {
    const res = await apiClient.delete(`/categories/${id}`);
    return res.data;
  },
};
