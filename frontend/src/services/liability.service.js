import api from './api';

const liabilityService = {
  getLiabilities: async () => {
    return await api.get('/liabilities');
  },

  getLiability: async (id) => {
    return await api.get(`/liabilities/${id}`);
  },

  createLiability: async (data) => {
    return await api.post('/liabilities', data);
  },

  updateLiability: async (id, data) => {
    return await api.put(`/liabilities/${id}`, data);
  },

  deleteLiability: async (id) => {
    return await api.delete(`/liabilities/${id}`);
  },
};

export default liabilityService;
