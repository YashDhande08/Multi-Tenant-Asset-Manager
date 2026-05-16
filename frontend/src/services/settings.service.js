import api from './api';

const settingsService = {
  getProfile: async () => {
    const res = await api.get('/settings/profile');
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await api.patch('/settings/profile', data);
    return res.data;
  },

  changePassword: async (data) => {
    const res = await api.post('/settings/change-password', data);
    return res.data;
  },

  getOrganization: async () => {
    const res = await api.get('/settings/organization');
    return res.data;
  },

  updateOrganization: async (data) => {
    const res = await api.patch('/settings/organization', data);
    return res.data;
  },

  getAuditLogs: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/settings/audit-logs${query ? `?${query}` : ''}`);
    return res.data;
  },
};

export default settingsService;
