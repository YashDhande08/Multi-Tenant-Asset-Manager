const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { tenantIsolation } = require('../middleware/tenantIsolation.middleware');
const { checkPermission } = require('../middleware/rbac.middleware');
const { PERMISSIONS } = require('../constants/permissions');

router.use(authenticate, tenantIsolation);

router.get('/yoy-comparison', checkPermission(PERMISSIONS.VIEW_REPORTS), reportController.getYearOverYearComparison);
router.get('/performance', checkPermission(PERMISSIONS.VIEW_REPORTS), reportController.getPerformanceReport);
router.get('/networth-growth', checkPermission(PERMISSIONS.VIEW_REPORTS), reportController.getNetWorthGrowth);

module.exports = router;

