const prisma = require('../config/database');

const withTenantFilter = (query, tenantId) => {
  return {
    ...query,
    where: {
      ...query.where,
      tenantId,
    },
  };
};

const handlePrismaError = (error) => {
  if (error.code === 'P2002') {
    return new Error('Duplicate entry');
  }
  if (error.code === 'P2025') {
    return new Error('Record not found');
  }
  return error;
};

module.exports = {
  withTenantFilter,
  handlePrismaError,
};

