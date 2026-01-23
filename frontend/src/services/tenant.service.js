import api from './api';

const tenantService = {
  getTenants: async () => {
    return await api.get('/tenants');
  },

  getTenant: async (id) => {
    return await api.get(`/tenants/${id}`);
  },

  createTenant: async (data) => {
    return await api.post('/tenants', data);
  },
};

export default tenantService;

