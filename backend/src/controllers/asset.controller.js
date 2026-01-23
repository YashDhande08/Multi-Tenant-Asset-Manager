const assetService = require('../services/asset.service');

const getAssets = async (req, res, next) => {
  try {
    const tenantId = typeof req.tenantId === 'string' ? parseInt(req.tenantId) : req.tenantId;
    const userId = typeof req.user.id === 'string' ? parseInt(req.user.id) : req.user.id;
    const roleId = typeof req.user.roleId === 'string' ? parseInt(req.user.roleId) : req.user.roleId;

    const assets = await assetService.getAssets(tenantId, userId, roleId);
    res.json({
      success: true,
      data: assets,
    });
  } catch (error) {
    next(error);
  }
};

const getAsset = async (req, res, next) => {
  try {
    const tenantId = typeof req.tenantId === 'string' ? parseInt(req.tenantId) : req.tenantId;
    const userId = typeof req.user.id === 'string' ? parseInt(req.user.id) : req.user.id;
    const roleId = typeof req.user.roleId === 'string' ? parseInt(req.user.roleId) : req.user.roleId;

    const asset = await assetService.getAssetById(req.params.id, tenantId, userId, roleId);
    res.json({
      success: true,
      data: asset,
    });
  } catch (error) {
    next(error);
  }
};

const createAsset = async (req, res, next) => {
  try {
    const tenantId = typeof req.tenantId === 'string' ? parseInt(req.tenantId) : req.tenantId;
    const userId = typeof req.user.id === 'string' ? parseInt(req.user.id) : req.user.id;

    const asset = await assetService.createAsset(req.body, tenantId, userId);
    res.status(201).json({
      success: true,
      data: asset,
    });
  } catch (error) {
    next(error);
  }
};

const updateAsset = async (req, res, next) => {
  try {
    const tenantId = typeof req.tenantId === 'string' ? parseInt(req.tenantId) : req.tenantId;
    const userId = typeof req.user.id === 'string' ? parseInt(req.user.id) : req.user.id;
    const roleId = typeof req.user.roleId === 'string' ? parseInt(req.user.roleId) : req.user.roleId;

    const asset = await assetService.updateAsset(req.params.id, req.body, tenantId, userId, roleId);
    res.json({
      success: true,
      data: asset,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAsset = async (req, res, next) => {
  try {
    const tenantId = typeof req.tenantId === 'string' ? parseInt(req.tenantId) : req.tenantId;
    const userId = typeof req.user.id === 'string' ? parseInt(req.user.id) : req.user.id;
    const roleId = typeof req.user.roleId === 'string' ? parseInt(req.user.roleId) : req.user.roleId;

    await assetService.deleteAsset(req.params.id, tenantId, userId, roleId);
    res.json({
      success: true,
      message: 'Asset deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getAssetValueHistory = async (req, res, next) => {
  try {
    const tenantId = typeof req.tenantId === 'string' ? parseInt(req.tenantId) : req.tenantId;
    const userId = typeof req.user.id === 'string' ? parseInt(req.user.id) : req.user.id;
    const roleId = typeof req.user.roleId === 'string' ? parseInt(req.user.roleId) : req.user.roleId;

    const history = await assetService.getAssetValueHistory(req.params.id, tenantId, userId, roleId);
    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

const addValueHistory = async (req, res, next) => {
  try {
    const tenantId = typeof req.tenantId === 'string' ? parseInt(req.tenantId) : req.tenantId;
    const userId = typeof req.user.id === 'string' ? parseInt(req.user.id) : req.user.id;
    const roleId = typeof req.user.roleId === 'string' ? parseInt(req.user.roleId) : req.user.roleId;

    const history = await assetService.addValueHistory(req.params.id, req.body, tenantId, userId, roleId);
    res.status(201).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssets,
  getAsset,
  createAsset,
  updateAsset,
  deleteAsset,
  getAssetValueHistory,
  addValueHistory,
};
