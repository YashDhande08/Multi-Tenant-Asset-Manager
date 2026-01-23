const reportService = require('../services/report.service');

const getYearOverYearComparison = async (req, res, next) => {
  try {
    const tenantId = typeof req.tenantId === 'string' ? parseInt(req.tenantId) : req.tenantId;
    const data = await reportService.getYearOverYearComparison(tenantId, req.query);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getPerformanceReport = async (req, res, next) => {
  try {
    const tenantId = typeof req.tenantId === 'string' ? parseInt(req.tenantId) : req.tenantId;
    const data = await reportService.getPerformanceReport(tenantId, req.query);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getNetWorthGrowth = async (req, res, next) => {
  try {
    const tenantId = typeof req.tenantId === 'string' ? parseInt(req.tenantId) : req.tenantId;
    const data = await reportService.getNetWorthGrowth(tenantId, req.query);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getYearOverYearComparison,
  getPerformanceReport,
  getNetWorthGrowth,
};
