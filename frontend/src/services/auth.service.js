import api from './api';

const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    return await api.post('/auth/refresh', { refreshToken });
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  acceptInvite: async ({ token, password, name }) => {
    const response = await api.post('/auth/accept-invite', { token, password, name });
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

export default authService;

