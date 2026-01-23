import api from './api';

const dashboardService = {
  getDashboardData: async () => {
    return await api.get('/dashboard');
  },

  getNetWorthGrowth: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/reports/networth-growth${queryString ? `?${queryString}` : ''}`);
  },
};

export default dashboardService;

