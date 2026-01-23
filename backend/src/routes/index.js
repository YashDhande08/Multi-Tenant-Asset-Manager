const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const tenantRoutes = require('./tenant.routes');
const userRoutes = require('./user.routes');
const assetRoutes = require('./asset.routes');
const liabilityRoutes = require('./liability.routes');
const dashboardRoutes = require('./dashboard.routes');
const reportRoutes = require('./report.routes');

router.use('/auth', authRoutes);
router.use('/tenants', tenantRoutes);
router.use('/users', userRoutes);
router.use('/assets', assetRoutes);
router.use('/liabilities', liabilityRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportRoutes);

module.exports = router;

