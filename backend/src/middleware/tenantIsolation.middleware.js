const prisma = require('../config/database');
const { ForbiddenError } = require('../constants/errors');

const tenantIsolation = async (req, res, next) => {
  try {
    if (!req.user || !req.user.tenantId) {
      throw new ForbiddenError('Tenant information missing');
    }

    // Attach tenantId to request for use in controllers
    // Convert to Int if it's a string
    req.tenantId = typeof req.user.tenantId === 'string' 
      ? parseInt(req.user.tenantId) 
      : req.user.tenantId;

    // Verify tenant exists
    const tenant = await prisma.tenant.findUnique({
      where: { id: req.tenantId },
    });

    if (!tenant) {
      throw new ForbiddenError('Invalid tenant');
    }

    req.tenant = tenant;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { tenantIsolation };

