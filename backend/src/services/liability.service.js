const prisma = require('../config/database');
const { NotFoundError } = require('../constants/errors');
const activityLogService = require('./activityLog.service');

// Supported FR liability types mapped to LiabilityType.name
const SUPPORTED_LIABILITY_TYPES = ['Mortgage', 'Personal Loan', 'Credit Card Debt'];

/**
 * Resolve liability type to an internal liabilityTypeId.
 * Accepts either:
 * - liabilityTypeId (number/string id), or
 * - type (string name like "Mortgage", "Personal Loan", etc.).
 */
const resolveLiabilityTypeId = async ({ liabilityTypeId, type }) => {
  if (liabilityTypeId !== undefined && liabilityTypeId !== null && liabilityTypeId !== '') {
    return parseInt(liabilityTypeId);
  }

  if (!type) {
    throw new Error('Liability type is required');
  }

  if (!SUPPORTED_LIABILITY_TYPES.includes(type)) {
    throw new Error(`Invalid liability type. Supported types: ${SUPPORTED_LIABILITY_TYPES.join(', ')}`);
  }

  const liabilityType = await prisma.liabilityType.findFirst({
    where: { name: type },
  });

  if (!liabilityType) {
    throw new Error(`Liability type "${type}" is not configured in the system`);
  }

  return liabilityType.id;
};

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

  // Attach FR-aligned helper field:
  // - type: liabilityType.name
  return liabilities.map((liability) => ({
    ...liability,
    type: liability.liabilityType?.name || null,
  }));
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

  return {
    ...liability,
    type: liability.liabilityType?.name || null,
  };
};

/**
 * Create a new liability
 */
const createLiability = async (data, tenantId, userId) => {
  const {
    name,
    // Support both FR-style "type" and internal "liabilityTypeId"
    liabilityTypeId,
    type,
    description,
    // Support both FR "amount" and internal "currentValue"
    amount,
    currentValue,
    interestRate,
    monthlyPayment,
    currency,
    acquisitionDate,
  } = data;

  if (!name) {
    throw new Error('name is required');
  }

  const resolvedLiabilityTypeId = await resolveLiabilityTypeId({
    liabilityTypeId,
    type,
  });

  const resolvedCurrentValue =
    currentValue !== undefined && currentValue !== null && currentValue !== ''
      ? currentValue
      : amount;

  if (
    resolvedCurrentValue === undefined ||
    resolvedCurrentValue === null ||
    resolvedCurrentValue === ''
  ) {
    throw new Error('currentValue/amount is required');
  }

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
      liabilityTypeId: resolvedLiabilityTypeId,
      name,
      description: description || null,
      currentValue: parseFloat(resolvedCurrentValue),
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
    {
      name: liability.name,
      liabilityType: liability.liabilityType.name,
      currentValue: parseFloat(resolvedCurrentValue),
    }
  );

  return {
    ...liability,
    type: liability.liabilityType?.name || null,
  };
};

/**
 * Update a liability
 * Standard users can only update their own liabilities
 */
const updateLiability = async (id, data, tenantId, userId, userRoleId) => {
  const liability = await getLiabilityById(id, tenantId, userId, userRoleId);

  const resolvedLiabilityTypeId =
    data.liabilityTypeId || data.type
      ? await resolveLiabilityTypeId({
          liabilityTypeId: data.liabilityTypeId,
          type: data.type,
        })
      : liability.liabilityTypeId;

  const resolvedCurrentValue =
    data.currentValue !== undefined &&
    data.currentValue !== null &&
    data.currentValue !== ''
      ? data.currentValue
      : data.amount;

  const updateData = {
    name: data.name !== undefined ? data.name : liability.name,
    liabilityTypeId: resolvedLiabilityTypeId,
    description:
      data.description !== undefined ? data.description : liability.description,
    currentValue:
      resolvedCurrentValue !== undefined &&
      resolvedCurrentValue !== null &&
      resolvedCurrentValue !== ''
        ? parseFloat(resolvedCurrentValue)
        : liability.currentValue,
    interestRate:
      data.interestRate !== undefined
        ? data.interestRate
          ? parseFloat(data.interestRate)
          : null
        : liability.interestRate,
    monthlyPayment:
      data.monthlyPayment !== undefined
        ? data.monthlyPayment
          ? parseFloat(data.monthlyPayment)
          : null
        : liability.monthlyPayment,
    currency: data.currency || liability.currency,
    acquisitionDate: data.acquisitionDate
      ? new Date(data.acquisitionDate)
      : liability.acquisitionDate,
  };

  const oldData = {
    name: liability.name,
    currentValue: parseFloat(liability.currentValue),
    interestRate: liability.interestRate
      ? parseFloat(liability.interestRate)
      : null,
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
    {
      name: updatedLiability.name,
      currentValue: parseFloat(updatedLiability.currentValue),
    }
  );

  return {
    ...updatedLiability,
    type: updatedLiability.liabilityType?.name || null,
  };
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
