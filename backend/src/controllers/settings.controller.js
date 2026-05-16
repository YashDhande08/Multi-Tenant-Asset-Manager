const settingsService = require('../services/settings.service');

const getProfile = async (req, res, next) => {
  try {
    const data = await settingsService.getProfile(req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const data = await settingsService.updateProfile(req.user.id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await settingsService.changePassword(
      req.user.id,
      currentPassword,
      newPassword
    );
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getOrganization = async (req, res, next) => {
  try {
    const data = await settingsService.getOrganization(req.tenantId, req.user.roleId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const updateOrganization = async (req, res, next) => {
  try {
    const data = await settingsService.updateOrganization(
      req.tenantId,
      req.user.id,
      req.user.roleId,
      req.body
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const getAuditLogs = async (req, res, next) => {
  try {
    const { limit, offset } = req.query;
    const data = await settingsService.getAuditLogs(req.tenantId, {
      userId: req.user.id,
      roleId: req.user.roleId,
      limit: limit || 50,
      offset: offset || 0,
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getOrganization,
  updateOrganization,
  getAuditLogs,
};
