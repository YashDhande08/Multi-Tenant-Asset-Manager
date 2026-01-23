const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { tenantIsolation } = require('../middleware/tenantIsolation.middleware');

router.use(authenticate, tenantIsolation);

router.get('/', dashboardController.getDashboardData);

module.exports = router;

