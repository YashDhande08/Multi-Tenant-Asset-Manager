const userService = require('../services/user.service');
const inviteService = require('../services/invite.service');

const inviteUser = async (req, res, next) => {
  try {
    const tenantId = typeof req.tenantId === 'string' ? parseInt(req.tenantId, 10) : req.tenantId;
    const userId = typeof req.user.id === 'string' ? parseInt(req.user.id, 10) : req.user.id;

    const { email, roleId } = req.body;

    const invite = await inviteService.createInvite(email, roleId, tenantId, userId);

    res.status(201).json({
      success: true,
      data: invite,
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const tenantId = typeof req.tenantId === 'string' ? parseInt(req.tenantId, 10) : req.tenantId;
    const userId = typeof req.user.id === 'string' ? parseInt(req.user.id, 10) : req.user.id;
    const roleId = typeof req.user.roleId === 'string' ? parseInt(req.user.roleId, 10) : req.user.roleId;

    const users = await userService.getUsers(tenantId, userId, roleId);

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const tenantId = typeof req.tenantId === 'string' ? parseInt(req.tenantId, 10) : req.tenantId;
    const currentUserId = typeof req.user.id === 'string' ? parseInt(req.user.id, 10) : req.user.id;
    const currentUserRoleId = typeof req.user.roleId === 'string' ? parseInt(req.user.roleId, 10) : req.user.roleId;

    const { roleId } = req.body;

    const user = await userService.updateUserRole(
      req.params.userId,
      roleId,
      tenantId,
      currentUserId,
      currentUserRoleId
    );

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const removeUser = async (req, res, next) => {
  try {
    const tenantId = typeof req.tenantId === 'string' ? parseInt(req.tenantId, 10) : req.tenantId;
    const userId = typeof req.user.id === 'string' ? parseInt(req.user.id, 10) : req.user.id;
    const roleId = typeof req.user.roleId === 'string' ? parseInt(req.user.roleId, 10) : req.user.roleId;

    await userService.deleteUser(req.params.userId, tenantId, userId, roleId);

    res.json({
      success: true,
      message: 'User removed from tenant successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  inviteUser,
  getUsers,
  updateUserRole,
  removeUser,
};

