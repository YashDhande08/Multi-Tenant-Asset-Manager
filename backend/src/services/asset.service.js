const prisma = require('../config/database');
const { NotFoundError, ForbiddenError } = require('../constants/errors');
const activityLogService = require('./activityLog.service');

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

  return assets.map(asset => ({
    ...asset,
    currentValue: asset.valueHistory && asset.valueHistory.length > 0
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

  return asset;
};

/**
 * Create a new asset
 * Automatically creates initial value history entry
 */
const createAsset = async (data, tenantId, userId) => {
  const {
    name,
    assetTypeId,
    description,
    currency,
    acquisitionDate,
    valueAmount,
    valueDate,
    source,
    notes,
  } = data;

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
      assetTypeId: parseInt(assetTypeId),
      name,
      description: description || null,
      currency: currency || 'INR',
      acquisitionDate: acquisitionDate ? new Date(acquisitionDate) : null,
      isDeleted: false,
      valueHistory: {
        create: {
          id: historyId,
          tenantId: parseInt(tenantId),
          assetId: assetId,
          valueDate: valueDate ? new Date(valueDate) : new Date(),
          valueAmount: parseFloat(valueAmount),
          source: source || null,
          notes: notes || null,
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
    { name: asset.name, assetType: asset.assetType.name, valueAmount }
  );

  return asset;
};

/**
 * Update an asset
 * Standard users can only update their own assets
 */
const updateAsset = async (id, data, tenantId, userId, userRoleId) => {
  const asset = await getAssetById(id, tenantId, userId, userRoleId);

  const updateData = {
    name: data.name,
    assetTypeId: data.assetTypeId ? parseInt(data.assetTypeId) : asset.assetTypeId,
    description: data.description !== undefined ? data.description : asset.description,
    currency: data.currency || asset.currency,
    acquisitionDate: data.acquisitionDate ? new Date(data.acquisitionDate) : asset.acquisitionDate,
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
  if (data.valueAmount && parseFloat(data.valueAmount) !== parseFloat(asset.valueHistory[0]?.valueAmount || 0)) {
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
        valueAmount: parseFloat(data.valueAmount),
        source: data.source || null,
        notes: data.notes || null,
      },
    });
  }

  await activityLogService.logActivity(
    parseInt(userId),
    parseInt(tenantId),
    'UPDATE',
    'Asset',
    parseInt(id),
    { changes: data }
  );

  return updatedAsset;
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
    { name: asset.name }
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

  const historyEntry = await prisma.assetValueHistory.create({
    data: {
      id: historyId,
      tenantId: parseInt(tenantId),
      assetId: parseInt(id),
      valueDate: new Date(data.valueDate),
      valueAmount: parseFloat(data.valueAmount),
      source: data.source || null,
      notes: data.notes || null,
    },
  });

  await activityLogService.logActivity(
    parseInt(userId),
    parseInt(tenantId),
    'UPDATE',
    'Asset',
    parseInt(id),
    { action: 'Value History Added', valueAmount: data.valueAmount }
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
