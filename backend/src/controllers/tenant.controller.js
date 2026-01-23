const tenantService = require('../services/tenant.service');

const createTenant = async (req, res, next) => {
  try {
    const tenant = await tenantService.createTenant(req.body);
    res.status(201).json({
      success: true,
      data: tenant,
    });
  } catch (error) {
    next(error);
  }
};

const getTenants = async (req, res, next) => {
  try {
    const tenants = await tenantService.getTenants();
    res.json({
      success: true,
      data: tenants,
    });
  } catch (error) {
    next(error);
  }
};

const getTenant = async (req, res, next) => {
  try {
    const tenant = await tenantService.getTenantById(req.params.id);
    res.json({
      success: true,
      data: tenant,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTenant,
  getTenants,
  getTenant,
};

