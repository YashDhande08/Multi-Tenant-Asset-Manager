const dashboardService = require('../services/dashboard.service');

const getDashboardData = async (req, res, next) => {
  try {
    // Ensure tenantId is an integer
    const tenantId = typeof req.tenantId === 'string' ? parseInt(req.tenantId) : req.tenantId;
    const data = await dashboardService.getDashboardData(tenantId);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardData,
};

