const prisma = require('../config/database');
const { NotFoundError } = require('../constants/errors');
const { parseId } = require('../utils/validation.util');

const createTenant = async (data) => {
  const tenant = await prisma.tenant.create({
    data: {
      name: data.name,
      subdomain: data.subdomain,
    },
  });

  return tenant;
};

const getTenants = async () => {
  const tenants = await prisma.tenant.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return tenants;
};

/**
 * Get tenant by ID with proper type conversion
 * @param {string|number} id - Tenant ID (will be converted to integer)
 * @returns {Promise<Object>} - Tenant object
 * @throws {BadRequestError} - If ID is invalid
 * @throws {NotFoundError} - If tenant not found
 */
const getTenantById = async (id) => {
  // Convert string ID to integer for Prisma
  const tenantId = parseId(id, 'tenantId');

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
  });

  if (!tenant) {
    throw new NotFoundError('Tenant not found');
  }

  return tenant;
};

module.exports = {
  createTenant,
  getTenants,
  getTenantById,
};

