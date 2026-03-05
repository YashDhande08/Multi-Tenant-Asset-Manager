const prisma = require('../config/database');
const { NotFoundError, ForbiddenError } = require('../constants/errors');
const activityLogService = require('./activityLog.service');

// Supported FR asset types mapped to AssetType.name
const SUPPORTED_ASSET_TYPES = ['Real Estate', 'Stocks', 'Crypto', 'Cash'];

/**
 * Resolve asset type to an internal assetTypeId.
 * Accepts either:
 * - assetTypeId (number/string id), or
 * - type (string name like "Real Estate", "Stocks", etc.).
 *
 * This keeps the database schema using AssetType,
 * while allowing the API/FR layer to work with a simple "type" enum.
 */
const resolveAssetTypeId = async ({ assetTypeId, type }) => {
  if (assetTypeId !== undefined && assetTypeId !== null && assetTypeId !== '') {
    return parseInt(assetTypeId);
  }

  if (!type) {
    throw new Error('Asset type is required');
  }

  if (!SUPPORTED_ASSET_TYPES.includes(type)) {
    throw new Error(
      `Invalid asset type. Supported types: ${SUPPORTED_ASSET_TYPES.join(', ')}`
    );
  }

  const assetType = await prisma.assetType.findFirst({
    where: { name: type },
  });

  if (!assetType) {
    throw new Error(`Asset type "${type}" is not configured in the system`);
  }

  return assetType.id;
};

/**
 * Get all assets for a tenant
 * Standard users can only see their own assets
 * Tenant Admins can see all tenant assets
 */
const getAssets = async (tenantId, userId, userRoleId) => {
  const where = {
    tenantId: parseInt(tenantId),
    isDeleted: false,
  };

  // Standard users can only see their own assets
  // Role ID 1 = Tenant Admin (can see all)
  if (userRoleId !== 1) {
    where.userId = parseInt(userId);
  }

  const assets = await prisma.asset.findMany({
    where,
    include: {
      assetType: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      valueHistory: {
        orderBy: { valueDate: 'desc' },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Expose FR-aligned fields:
  // - currentValue: latest value history amount
  // - type: mapped from related AssetType.name
  return assets.map(asset => ({
    ...asset,
    type: asset.assetType?.name || null,
    currentValue:
      asset.valueHistory && asset.valueHistory.length > 0
        ? parseFloat(asset.valueHistory[0].valueAmount)
        : 0,
  }));
};

/**
 * Get asset by ID with tenant isolation
 */
const getAssetById = async (id, tenantId, userId, userRoleId) => {
  const where = {
    id: parseInt(id),
    tenantId: parseInt(tenantId),
    isDeleted: false,
  };

  // Standard users can only access their own assets
  if (userRoleId !== 1) {
    where.userId = parseInt(userId);
  }

  const asset = await prisma.asset.findFirst({
    where,
    include: {
      assetType: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      valueHistory: {
        orderBy: { valueDate: 'desc' },
      },
    },
  });

  if (!asset) {
    throw new NotFoundError('Asset not found');
  }

  // Attach FR-aligned helper fields for easier frontend consumption
  const currentValue =
    asset.valueHistory && asset.valueHistory.length > 0
      ? parseFloat(asset.valueHistory[0].valueAmount)
      : 0;

  return {
    ...asset,
    type: asset.assetType?.name || null,
    currentValue,
  };
};

/**
 * Create a new asset
 * Automatically creates initial value history entry
 */
const createAsset = async (data, tenantId, userId) => {
  const {
    name,
    // Support both FR-style "type" and internal "assetTypeId"
    assetTypeId,
    type,
    description,
    currency,
    acquisitionDate,
    // Support both "currentValue" (FR) and "valueAmount" (internal)
    currentValue,
    valueAmount,
    valueDate,
  } = data;

  if (!name) {
    throw new Error('name is required');
  }

  // Resolve type -> assetTypeId
  const resolvedAssetTypeId = await resolveAssetTypeId({ assetTypeId, type });

  const resolvedValueAmount =
    valueAmount !== undefined && valueAmount !== null && valueAmount !== ''
      ? valueAmount
      : currentValue;

  if (resolvedValueAmount === undefined || resolvedValueAmount === null || resolvedValueAmount === '') {
    throw new Error('currentValue is required');
  }

  // Generate unique asset ID
  const lastAsset = await prisma.asset.findFirst({
    orderBy: { id: 'desc' },
  });
  const assetId = lastAsset ? lastAsset.id + 1 : 1;

  // Generate unique value history ID
  const lastHistory = await prisma.assetValueHistory.findFirst({
    orderBy: { id: 'desc' },
  });
  const historyId = lastHistory ? lastHistory.id + 1 : 1;

  const asset = await prisma.asset.create({
    data: {
      id: assetId,
      tenantId: parseInt(tenantId),
      userId: parseInt(userId),
      assetTypeId: resolvedAssetTypeId,
      name,
      description: description || null,
      currency: currency || 'INR',
      acquisitionDate: acquisitionDate ? new Date(acquisitionDate) : null,
      isDeleted: false,
      valueHistory: {
        create: {
          id: historyId,
          tenantId: parseInt(tenantId),
          valueDate: valueDate ? new Date(valueDate) : new Date(),
          valueAmount: parseFloat(resolvedValueAmount),
        },
      },
    },
    include: {
      assetType: true,
      valueHistory: {
        orderBy: { valueDate: 'desc' },
        take: 1,
      },
    },
  });

  await activityLogService.logActivity(
    parseInt(userId),
    parseInt(tenantId),
    'CREATE',
    'Asset',
    assetId,
    null,
    {
      name: asset.name,
      assetType: asset.assetType.name,
      currentValue: parseFloat(resolvedValueAmount),
    }
  );

  // Attach FR-aligned fields in response
  const latestHistory =
    asset.valueHistory && asset.valueHistory.length > 0
      ? asset.valueHistory[0]
      : null;

  return {
    ...asset,
    type: asset.assetType?.name || null,
    currentValue: latestHistory
      ? parseFloat(latestHistory.valueAmount)
      : parseFloat(resolvedValueAmount),
  };
};

/**
 * Update an asset
 * Standard users can only update their own assets
 */
const updateAsset = async (id, data, tenantId, userId, userRoleId) => {
  const asset = await getAssetById(id, tenantId, userId, userRoleId);

  const resolvedAssetTypeId = data.assetTypeId || data.type
    ? await resolveAssetTypeId({
        assetTypeId: data.assetTypeId,
        type: data.type,
      })
    : asset.assetTypeId;

  const updateData = {
    name: data.name !== undefined ? data.name : asset.name,
    assetTypeId: resolvedAssetTypeId,
    description:
      data.description !== undefined ? data.description : asset.description,
    currency: data.currency || asset.currency,
    acquisitionDate: data.acquisitionDate
      ? new Date(data.acquisitionDate)
      : asset.acquisitionDate,
  };

  const updatedAsset = await prisma.asset.update({
    where: { id: parseInt(id) },
    data: updateData,
    include: {
      assetType: true,
      valueHistory: {
        orderBy: { valueDate: 'desc' },
      },
    },
  });

  // If value changed, create new history entry
  const newValueAmountRaw =
    data.valueAmount !== undefined && data.valueAmount !== null && data.valueAmount !== ''
      ? data.valueAmount
      : data.currentValue;

  if (
    newValueAmountRaw !== undefined &&
    newValueAmountRaw !== null &&
    newValueAmountRaw !== '' &&
    parseFloat(newValueAmountRaw) !==
      parseFloat(asset.valueHistory[0]?.valueAmount || 0)
  ) {
    const lastHistory = await prisma.assetValueHistory.findFirst({
      orderBy: { id: 'desc' },
    });
    const historyId = lastHistory ? lastHistory.id + 1 : 1;

    await prisma.assetValueHistory.create({
      data: {
        id: historyId,
        tenantId: parseInt(tenantId),
        assetId: parseInt(id),
        valueDate: data.valueDate ? new Date(data.valueDate) : new Date(),
        valueAmount: parseFloat(newValueAmountRaw),
      },
    });
  }

  await activityLogService.logActivity(
    parseInt(userId),
    parseInt(tenantId),
    'UPDATE',
    'Asset',
    parseInt(id),
    {
      name: asset.name,
      previousType: asset.assetType?.name || null,
    },
    {
      changes: data,
    }
  );

  const latestHistory =
    updatedAsset.valueHistory && updatedAsset.valueHistory.length > 0
      ? updatedAsset.valueHistory[0]
      : null;

  return {
    ...updatedAsset,
    type: updatedAsset.assetType?.name || null,
    currentValue: latestHistory
      ? parseFloat(latestHistory.valueAmount)
      : asset.currentValue || 0,
  };
};

/**
 * Soft delete an asset (set isDeleted = true)
 */
const deleteAsset = async (id, tenantId, userId, userRoleId) => {
  const asset = await getAssetById(id, tenantId, userId, userRoleId);

  await prisma.asset.update({
    where: { id: parseInt(id) },
    data: { isDeleted: true },
  });

  await activityLogService.logActivity(
    parseInt(userId),
    parseInt(tenantId),
    'DELETE',
    'Asset',
    parseInt(id),
    { name: asset.name },
    null
  );
};

/**
 * Get asset value history
 */
const getAssetValueHistory = async (id, tenantId, userId, userRoleId) => {
  const asset = await getAssetById(id, tenantId, userId, userRoleId);

  const history = await prisma.assetValueHistory.findMany({
    where: {
      assetId: parseInt(id),
      tenantId: parseInt(tenantId),
    },
    orderBy: { valueDate: 'asc' },
  });

  return history;
};

/**
 * Add new value history entry for an asset
 */
const addValueHistory = async (id, data, tenantId, userId, userRoleId) => {
  const asset = await getAssetById(id, tenantId, userId, userRoleId);

  const lastHistory = await prisma.assetValueHistory.findFirst({
    orderBy: { id: 'desc' },
  });
  const historyId = lastHistory ? lastHistory.id + 1 : 1;

  const resolvedValueAmount =
    data.valueAmount !== undefined && data.valueAmount !== null && data.valueAmount !== ''
      ? data.valueAmount
      : data.currentValue;

  const resolvedValueDate = data.valueDate || data.recordedAt;

  if (
    resolvedValueAmount === undefined ||
    resolvedValueAmount === null ||
    resolvedValueAmount === ''
  ) {
    throw new Error('valueAmount/currentValue is required');
  }

  if (!resolvedValueDate) {
    throw new Error('valueDate/recordedAt is required');
  }

  const historyEntry = await prisma.assetValueHistory.create({
    data: {
      id: historyId,
      tenantId: parseInt(tenantId),
      assetId: parseInt(id),
      valueDate: new Date(resolvedValueDate),
      valueAmount: parseFloat(resolvedValueAmount),
    },
  });

  await activityLogService.logActivity(
    parseInt(userId),
    parseInt(tenantId),
    'UPDATE',
    'Asset',
    parseInt(id),
    null,
    {
      action: 'Value History Added',
      valueAmount: parseFloat(resolvedValueAmount),
    }
  );

  return historyEntry;
};

module.exports = {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  getAssetValueHistory,
  addValueHistory,
};
