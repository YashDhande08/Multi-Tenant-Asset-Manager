const prisma = require('../config/database');
const { NotFoundError } = require('../constants/errors');
const activityLogService = require('./activityLog.service');

/**
 * Get all liabilities for a tenant
 * Standard users can only see their own liabilities
 * Tenant Admins can see all tenant liabilities
 */
const getLiabilities = async (tenantId, userId, userRoleId) => {
  const where = {
    tenantId: parseInt(tenantId),
    isDeleted: false,
  };

  // Standard users can only see their own liabilities
  // Role ID 1 = Tenant Admin (can see all)
  if (userRoleId !== 1) {
    where.ownerUserId = parseInt(userId);
  }

  const liabilities = await prisma.liability.findMany({
    where,
    include: {
      liabilityType: true,
      ownerUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return liabilities;
};

/**
 * Get liability by ID with tenant isolation
 */
const getLiabilityById = async (id, tenantId, userId, userRoleId) => {
  const where = {
    id: parseInt(id),
    tenantId: parseInt(tenantId),
    isDeleted: false,
  };

  // Standard users can only access their own liabilities
  if (userRoleId !== 1) {
    where.ownerUserId = parseInt(userId);
  }

  const liability = await prisma.liability.findFirst({
    where,
    include: {
      liabilityType: true,
      ownerUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!liability) {
    throw new NotFoundError('Liability not found');
  }

  return liability;
};

/**
 * Create a new liability
 */
const createLiability = async (data, tenantId, userId) => {
  const {
    name,
    liabilityTypeId,
    description,
    currentValue,
    interestRate,
    monthlyPayment,
    currency,
    acquisitionDate,
  } = data;

  // Generate unique liability ID
  const lastLiability = await prisma.liability.findFirst({
    orderBy: { id: 'desc' },
  });
  const liabilityId = lastLiability ? lastLiability.id + 1 : 1;

  const liability = await prisma.liability.create({
    data: {
      id: liabilityId,
      tenantId: parseInt(tenantId),
      ownerUserId: parseInt(userId),
      liabilityTypeId: parseInt(liabilityTypeId),
      name,
      description: description || null,
      currentValue: parseFloat(currentValue),
      interestRate: interestRate ? parseFloat(interestRate) : null,
      monthlyPayment: monthlyPayment ? parseFloat(monthlyPayment) : null,
      currency: currency || 'INR',
      acquisitionDate: acquisitionDate ? new Date(acquisitionDate) : null,
      isDeleted: false,
    },
    include: {
      liabilityType: true,
    },
  });

  await activityLogService.logActivity(
    parseInt(userId),
    parseInt(tenantId),
    'CREATE',
    'Liability',
    liabilityId,
    null,
    { name: liability.name, liabilityType: liability.liabilityType.name, currentValue }
  );

  return liability;
};

/**
 * Update a liability
 * Standard users can only update their own liabilities
 */
const updateLiability = async (id, data, tenantId, userId, userRoleId) => {
  const liability = await getLiabilityById(id, tenantId, userId, userRoleId);

  const updateData = {
    name: data.name,
    liabilityTypeId: data.liabilityTypeId ? parseInt(data.liabilityTypeId) : liability.liabilityTypeId,
    description: data.description !== undefined ? data.description : liability.description,
    currentValue: data.currentValue ? parseFloat(data.currentValue) : liability.currentValue,
    interestRate: data.interestRate !== undefined ? (data.interestRate ? parseFloat(data.interestRate) : null) : liability.interestRate,
    monthlyPayment: data.monthlyPayment !== undefined ? (data.monthlyPayment ? parseFloat(data.monthlyPayment) : null) : liability.monthlyPayment,
    currency: data.currency || liability.currency,
    acquisitionDate: data.acquisitionDate ? new Date(data.acquisitionDate) : liability.acquisitionDate,
  };

  const oldData = {
    name: liability.name,
    currentValue: parseFloat(liability.currentValue),
    interestRate: liability.interestRate ? parseFloat(liability.interestRate) : null,
  };

  const updatedLiability = await prisma.liability.update({
    where: { id: parseInt(id) },
    data: updateData,
    include: {
      liabilityType: true,
    },
  });

  await activityLogService.logActivity(
    parseInt(userId),
    parseInt(tenantId),
    'UPDATE',
    'Liability',
    parseInt(id),
    oldData,
    { name: updatedLiability.name, currentValue: parseFloat(updatedLiability.currentValue) }
  );

  return updatedLiability;
};

/**
 * Soft delete a liability (set isDeleted = true)
 */
const deleteLiability = async (id, tenantId, userId, userRoleId) => {
  const liability = await getLiabilityById(id, tenantId, userId, userRoleId);

  await prisma.liability.update({
    where: { id: parseInt(id) },
    data: { isDeleted: true },
  });

  await activityLogService.logActivity(
    parseInt(userId),
    parseInt(tenantId),
    'DELETE',
    'Liability',
    parseInt(id),
    { name: liability.name },
    null
  );
};

module.exports = {
  getLiabilities,
  getLiabilityById,
  createLiability,
  updateLiability,
  deleteLiability,
};
