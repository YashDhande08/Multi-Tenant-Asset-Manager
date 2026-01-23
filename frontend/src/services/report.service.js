import api from './api';

const reportService = {
  getYearOverYearComparison: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/reports/yoy-comparison${queryString ? `?${queryString}` : ''}`);
  },

  getPerformanceReport: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/reports/performance${queryString ? `?${queryString}` : ''}`);
  },

  getNetWorthGrowth: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/reports/networth-growth${queryString ? `?${queryString}` : ''}`);
  },
};

export default reportService;

