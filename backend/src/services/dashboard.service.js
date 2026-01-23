const prisma = require('../config/database');

const getDashboardData = async (tenantId) => {
  // Get assets with their latest value from history
  const assets = await prisma.asset.findMany({
    where: { 
      tenantId: parseInt(tenantId),
      isDeleted: false,
    },
    include: {
      assetType: true,
      valueHistory: {
        orderBy: { valueDate: 'desc' },
        take: 1,
      },
    },
  });

  // Get liabilities
  const liabilities = await prisma.liability.findMany({
    where: { 
      tenantId: parseInt(tenantId),
      isDeleted: false,
    },
    include: {
      liabilityType: true,
    },
  });

  // Calculate totals - assets use latest value from history
  let totalAssets = 0;
  assets.forEach(asset => {
    if (asset.valueHistory && asset.valueHistory.length > 0) {
      totalAssets += parseFloat(asset.valueHistory[0].valueAmount);
    }
  });

  const totalLiabilities = liabilities.reduce((sum, liability) => {
    return sum + parseFloat(liability.currentValue);
  }, 0);

  const netWorth = totalAssets - totalLiabilities;

  // Asset allocation by type
  const assetAllocation = {};
  assets.forEach(asset => {
    const typeName = asset.assetType?.name || 'Unknown';
    const value = asset.valueHistory && asset.valueHistory.length > 0 
      ? parseFloat(asset.valueHistory[0].valueAmount) 
      : 0;
    assetAllocation[typeName] = (assetAllocation[typeName] || 0) + value;
  });

  // Liability breakdown by type
  const liabilityBreakdown = {};
  liabilities.forEach(liability => {
    const typeName = liability.liabilityType?.name || 'Unknown';
    const value = parseFloat(liability.currentValue);
    liabilityBreakdown[typeName] = (liabilityBreakdown[typeName] || 0) + value;
  });

  // Recent activity
  const recentActivity = await prisma.userActivityLog.findMany({
    where: { tenantId: parseInt(tenantId) },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return {
    summary: {
      totalAssets,
      totalLiabilities,
      netWorth,
    },
    assetAllocation,
    liabilityBreakdown,
    recentActivity: recentActivity.map(activity => ({
      id: activity.id.toString(),
      action: activity.action,
      entityType: activity.entityType,
      user: activity.user,
      createdAt: activity.createdAt,
    })),
  };
};

module.exports = {
  getDashboardData,
};
