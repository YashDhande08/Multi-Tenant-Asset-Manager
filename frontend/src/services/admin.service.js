import api from './api';

const adminService = {
  inviteUser: async ({ email, roleId }) => {
    return await api.post('/admin/invite-user', { email, roleId });
  },

  getUsers: async () => {
    return await api.get('/admin/users');
  },

  updateUserRole: async (userId, roleId) => {
    return await api.patch(`/admin/update-role/${userId}`, { roleId });
  },

  removeUser: async (userId) => {
    return await api.delete(`/admin/remove-user/${userId}`);
  },
};

export default adminService;

