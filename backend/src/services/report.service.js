const prisma = require('../config/database');

/**
 * Get year-over-year comparison
 * Compares current year vs previous year performance
 */
const getYearOverYearComparison = async (tenantId, query = {}) => {
  const currentYear = query.year ? parseInt(query.year) : new Date().getFullYear();
  const previousYear = currentYear - 1;

  const startCurrentYear = new Date(`${currentYear}-01-01`);
  const endCurrentYear = new Date(`${currentYear + 1}-01-01`);
  const startPreviousYear = new Date(`${previousYear}-01-01`);
  const endPreviousYear = new Date(`${previousYear + 1}-01-01`);

  // Get assets with their latest values
  const [currentYearAssets, previousYearAssets] = await Promise.all([
    prisma.asset.findMany({
      where: {
        tenantId: parseInt(tenantId),
        isDeleted: false,
        createdAt: {
          gte: startCurrentYear,
          lt: endCurrentYear,
        },
      },
      include: {
        valueHistory: {
          orderBy: { valueDate: 'desc' },
          take: 1,
        },
      },
    }),
    prisma.asset.findMany({
      where: {
        tenantId: parseInt(tenantId),
        isDeleted: false,
        createdAt: {
          gte: startPreviousYear,
          lt: endPreviousYear,
        },
      },
      include: {
        valueHistory: {
          orderBy: { valueDate: 'desc' },
          take: 1,
        },
      },
    }),
  ]);

  // Get liabilities
  const [currentYearLiabilities, previousYearLiabilities] = await Promise.all([
    prisma.liability.findMany({
      where: {
        tenantId: parseInt(tenantId),
        isDeleted: false,
        createdAt: {
          gte: startCurrentYear,
          lt: endCurrentYear,
        },
      },
    }),
    prisma.liability.findMany({
      where: {
        tenantId: parseInt(tenantId),
        isDeleted: false,
        createdAt: {
          gte: startPreviousYear,
          lt: endPreviousYear,
        },
      },
    }),
  ]);

  // Calculate totals
  const currentYearTotalAssets = currentYearAssets.reduce((sum, asset) => {
    const value = asset.valueHistory && asset.valueHistory.length > 0
      ? parseFloat(asset.valueHistory[0].valueAmount)
      : 0;
    return sum + value;
  }, 0);

  const previousYearTotalAssets = previousYearAssets.reduce((sum, asset) => {
    const value = asset.valueHistory && asset.valueHistory.length > 0
      ? parseFloat(asset.valueHistory[0].valueAmount)
      : 0;
    return sum + value;
  }, 0);

  const currentYearTotalLiabilities = currentYearLiabilities.reduce(
    (sum, liability) => sum + parseFloat(liability.currentValue),
    0
  );

  const previousYearTotalLiabilities = previousYearLiabilities.reduce(
    (sum, liability) => sum + parseFloat(liability.currentValue),
    0
  );

  const currentYearNetWorth = currentYearTotalAssets - currentYearTotalLiabilities;
  const previousYearNetWorth = previousYearTotalAssets - previousYearTotalLiabilities;

  const growth = previousYearNetWorth !== 0
    ? ((currentYearNetWorth - previousYearNetWorth) / Math.abs(previousYearNetWorth)) * 100
    : 0;

  return {
    currentYear: {
      year: currentYear,
      totalAssets: currentYearTotalAssets,
      totalLiabilities: currentYearTotalLiabilities,
      netWorth: currentYearNetWorth,
    },
    previousYear: {
      year: previousYear,
      totalAssets: previousYearTotalAssets,
      totalLiabilities: previousYearTotalLiabilities,
      netWorth: previousYearNetWorth,
    },
    growth: parseFloat(growth.toFixed(2)),
  };
};

/**
 * Get performance report with asset class breakdown
 */
const getPerformanceReport = async (tenantId, query = {}) => {
  const startDate = query.startDate ? new Date(query.startDate) : new Date(new Date().setMonth(new Date().getMonth() - 12));
  const endDate = query.endDate ? new Date(query.endDate) : new Date();

  // Get all assets with their types and latest values
  const assets = await prisma.asset.findMany({
    where: {
      tenantId: parseInt(tenantId),
      isDeleted: false,
      createdAt: {
        gte: startDate,
        lte: endDate,
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

  // Get all liabilities
  const liabilities = await prisma.liability.findMany({
    where: {
      tenantId: parseInt(tenantId),
      isDeleted: false,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      liabilityType: true,
    },
  });

  // Calculate asset breakdown by type
  const assetBreakdown = {};
  let totalAssetValue = 0;

  assets.forEach((asset) => {
    const typeName = asset.assetType?.name || 'Unknown';
    const value = asset.valueHistory && asset.valueHistory.length > 0
      ? parseFloat(asset.valueHistory[0].valueAmount)
      : 0;
    
    assetBreakdown[typeName] = (assetBreakdown[typeName] || 0) + value;
    totalAssetValue += value;
  });

  // Calculate liability breakdown by type
  const liabilityBreakdown = {};
  let totalLiabilityValue = 0;

  liabilities.forEach((liability) => {
    const typeName = liability.liabilityType?.name || 'Unknown';
    const value = parseFloat(liability.currentValue);
    
    liabilityBreakdown[typeName] = (liabilityBreakdown[typeName] || 0) + value;
    totalLiabilityValue += value;
  });

  return {
    period: {
      startDate,
      endDate,
    },
    assets: {
      count: assets.length,
      totalValue: totalAssetValue,
      byType: assetBreakdown,
    },
    liabilities: {
      count: liabilities.length,
      totalAmount: totalLiabilityValue,
      byType: liabilityBreakdown,
    },
    netWorth: totalAssetValue - totalLiabilityValue,
  };
};

/**
 * Get net worth growth over time
 * Returns monthly snapshots for charting
 */
const getNetWorthGrowth = async (tenantId, query = {}) => {
  const months = query.months ? parseInt(query.months) : 12;
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  // Get net worth snapshots if available
  const snapshots = await prisma.networthSnapshot.findMany({
    where: {
      tenantId: parseInt(tenantId),
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  // If no snapshots, calculate from current data
  if (snapshots.length === 0) {
    // Get current assets and liabilities
    const assets = await prisma.asset.findMany({
      where: {
        tenantId: parseInt(tenantId),
        isDeleted: false,
      },
      include: {
        valueHistory: {
          orderBy: { valueDate: 'desc' },
          take: 1,
        },
      },
    });

    const liabilities = await prisma.liability.findMany({
      where: {
        tenantId: parseInt(tenantId),
        isDeleted: false,
      },
    });

    const totalAssets = assets.reduce((sum, asset) => {
      const value = asset.valueHistory && asset.valueHistory.length > 0
        ? parseFloat(asset.valueHistory[0].valueAmount)
        : 0;
      return sum + value;
    }, 0);

    const totalLiabilities = liabilities.reduce(
      (sum, liability) => sum + parseFloat(liability.currentValue),
      0
    );

    return [{
      date: endDate.toISOString(),
      netWorth: totalAssets - totalLiabilities,
      totalAssets,
      totalLiabilities,
    }];
  }

  return snapshots.map(snapshot => ({
    date: snapshot.createdAt.toISOString(),
    netWorth: parseFloat(snapshot.netWorth),
    totalAssets: parseFloat(snapshot.totalAssets),
    totalLiabilities: parseFloat(snapshot.totalLiabilities),
  }));
};

module.exports = {
  getYearOverYearComparison,
  getPerformanceReport,
  getNetWorthGrowth,
};
