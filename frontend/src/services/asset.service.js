import api from './api';

const assetService = {
  getAssets: async () => {
    return await api.get('/assets');
  },

  getAsset: async (id) => {
    return await api.get(`/assets/${id}`);
  },

  createAsset: async (data) => {
    return await api.post('/assets', data);
  },

  updateAsset: async (id, data) => {
    return await api.put(`/assets/${id}`, data);
  },

  deleteAsset: async (id) => {
    return await api.delete(`/assets/${id}`);
  },

  getAssetValueHistory: async (id) => {
    return await api.get(`/assets/${id}/history`);
  },

  addValueHistory: async (id, data) => {
    return await api.post(`/assets/${id}/history`, data);
  },
};

export default assetService;
