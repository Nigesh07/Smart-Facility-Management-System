import apiClient from './apiClient';

function buildFormData(file) {
  const formData = new FormData();
  formData.append('file', file);
  return formData;
}

export const uploadService = {
  uploadTicketIssueImage: async (file) => {
    const res = await apiClient.post('/uploads/ticket-issue', buildFormData(file));
    return res.data.data.url;
  },

  uploadTicketCompletionImage: async (file) => {
    const res = await apiClient.post('/uploads/ticket-completion', buildFormData(file));
    return res.data.data.url;
  },

  uploadProfileImage: async (file) => {
    const res = await apiClient.post('/uploads/profile-image', buildFormData(file));
    return res.data.data.url;
  },
};
