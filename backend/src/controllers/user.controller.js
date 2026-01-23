const userService = require('../services/user.service');

const getUsers = async (req, res, next) => {
  try {
    const tenantId = typeof req.tenantId === 'string' ? parseInt(req.tenantId) : req.tenantId;
    const userId = typeof req.user.id === 'string' ? parseInt(req.user.id) : req.user.id;
    const roleId = typeof req.user.roleId === 'string' ? parseInt(req.user.roleId) : req.user.roleId;

    const users = await userService.getUsers(tenantId, userId, roleId);
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const tenantId = typeof req.tenantId === 'string' ? parseInt(req.tenantId) : req.tenantId;
    const userId = typeof req.user.id === 'string' ? parseInt(req.user.id) : req.user.id;
    const roleId = typeof req.user.roleId === 'string' ? parseInt(req.user.roleId) : req.user.roleId;

    const user = await userService.getUserById(req.params.id, tenantId, userId, roleId);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const tenantId = typeof req.tenantId === 'string' ? parseInt(req.tenantId) : req.tenantId;
    const userId = typeof req.user.id === 'string' ? parseInt(req.user.id) : req.user.id;

    const user = await userService.createUser(req.body, tenantId, userId);
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const tenantId = typeof req.tenantId === 'string' ? parseInt(req.tenantId) : req.tenantId;
    const userId = typeof req.user.id === 'string' ? parseInt(req.user.id) : req.user.id;
    const roleId = typeof req.user.roleId === 'string' ? parseInt(req.user.roleId) : req.user.roleId;

    const user = await userService.updateUser(req.params.id, req.body, tenantId, userId, roleId);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const tenantId = typeof req.tenantId === 'string' ? parseInt(req.tenantId) : req.tenantId;
    const userId = typeof req.user.id === 'string' ? parseInt(req.user.id) : req.user.id;
    const roleId = typeof req.user.roleId === 'string' ? parseInt(req.user.roleId) : req.user.roleId;

    await userService.deleteUser(req.params.id, tenantId, userId, roleId);
    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
