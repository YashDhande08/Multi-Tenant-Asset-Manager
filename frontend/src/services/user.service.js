import api from './api';

const userService = {
  getUsers: async () => {
    return await api.get('/users');
  },

  getUser: async (id) => {
    return await api.get(`/users/${id}`);
  },

  createUser: async (data) => {
    return await api.post('/users', data);
  },

  updateUser: async (id, data) => {
    return await api.put(`/users/${id}`, data);
  },

  deleteUser: async (id) => {
    return await api.delete(`/users/${id}`);
  },
};

export default userService;

