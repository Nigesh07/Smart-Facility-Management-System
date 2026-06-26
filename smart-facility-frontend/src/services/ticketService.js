import apiClient from './apiClient';

export const ticketService = {
  createTicket: async (payload) => {
    const res = await apiClient.post('/tickets', payload);
    return res.data.data;
  },

  getMyTickets: async () => {
    const res = await apiClient.get('/tickets/my-tickets');
    return res.data.data;
  },

  getCoordinatorTickets: async () => {
    const res = await apiClient.get('/tickets/coordinator');
    return res.data.data;
  },

  getAssignedTickets: async () => {
    const res = await apiClient.get('/tickets/assigned');
    return res.data.data;
  },

  getAllTickets: async () => {
    const res = await apiClient.get('/tickets');
    return res.data.data;
  },

  getTicketById: async (id) => {
    const res = await apiClient.get(`/tickets/${id}`);
    return res.data.data;
  },

  getTicketHistory: async (id) => {
    const res = await apiClient.get(`/tickets/${id}/history`);
    return res.data.data;
  },

  assignTechnician: async (id, technicianId) => {
    const res = await apiClient.put(`/tickets/${id}/assign`, { technicianId });
    return res.data.data;
  },

  startWork: async (id, remarks) => {
    const res = await apiClient.put(`/tickets/${id}/status`, { remarks });
    return res.data.data;
  },

  completeTicket: async (id, workRemarks, completionImageUrl) => {
    const res = await apiClient.put(`/tickets/${id}/complete`, { workRemarks, completionImageUrl });
    return res.data.data;
  },

  closeTicket: async (id) => {
    const res = await apiClient.put(`/tickets/${id}/close`);
    return res.data.data;
  },
};
