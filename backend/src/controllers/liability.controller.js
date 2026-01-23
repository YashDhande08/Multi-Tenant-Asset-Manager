const liabilityService = require('../services/liability.service');

const getLiabilities = async (req, res, next) => {
  try {
    const tenantId = typeof req.tenantId === 'string' ? parseInt(req.tenantId) : req.tenantId;
    const userId = typeof req.user.id === 'string' ? parseInt(req.user.id) : req.user.id;
    const roleId = typeof req.user.roleId === 'string' ? parseInt(req.user.roleId) : req.user.roleId;

    const liabilities = await liabilityService.getLiabilities(tenantId, userId, roleId);
    res.json({
      success: true,
      data: liabilities,
    });
  } catch (error) {
    next(error);
  }
};

const getLiability = async (req, res, next) => {
  try {
    const tenantId = typeof req.tenantId === 'string' ? parseInt(req.tenantId) : req.tenantId;
    const userId = typeof req.user.id === 'string' ? parseInt(req.user.id) : req.user.id;
    const roleId = typeof req.user.roleId === 'string' ? parseInt(req.user.roleId) : req.user.roleId;

    const liability = await liabilityService.getLiabilityById(req.params.id, tenantId, userId, roleId);
    res.json({
      success: true,
      data: liability,
    });
  } catch (error) {
    next(error);
  }
};

const createLiability = async (req, res, next) => {
  try {
    const tenantId = typeof req.tenantId === 'string' ? parseInt(req.tenantId) : req.tenantId;
    const userId = typeof req.user.id === 'string' ? parseInt(req.user.id) : req.user.id;

    const liability = await liabilityService.createLiability(req.body, tenantId, userId);
    res.status(201).json({
      success: true,
      data: liability,
    });
  } catch (error) {
    next(error);
  }
};

const updateLiability = async (req, res, next) => {
  try {
    const tenantId = typeof req.tenantId === 'string' ? parseInt(req.tenantId) : req.tenantId;
    const userId = typeof req.user.id === 'string' ? parseInt(req.user.id) : req.user.id;
    const roleId = typeof req.user.roleId === 'string' ? parseInt(req.user.roleId) : req.user.roleId;

    const liability = await liabilityService.updateLiability(req.params.id, req.body, tenantId, userId, roleId);
    res.json({
      success: true,
      data: liability,
    });
  } catch (error) {
    next(error);
  }
};

const deleteLiability = async (req, res, next) => {
  try {
    const tenantId = typeof req.tenantId === 'string' ? parseInt(req.tenantId) : req.tenantId;
    const userId = typeof req.user.id === 'string' ? parseInt(req.user.id) : req.user.id;
    const roleId = typeof req.user.roleId === 'string' ? parseInt(req.user.roleId) : req.user.roleId;

    await liabilityService.deleteLiability(req.params.id, tenantId, userId, roleId);
    res.json({
      success: true,
      message: 'Liability deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLiabilities,
  getLiability,
  createLiability,
  updateLiability,
  deleteLiability,
};
