const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenant.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { tenantIsolation } = require('../middleware/tenantIsolation.middleware');
const { checkPermission } = require('../middleware/rbac.middleware');
const { PERMISSIONS } = require('../constants/permissions');
const { validate } = require('../middleware/validation.middleware');
const { body } = require('express-validator');

router.use(authenticate, tenantIsolation);

router.post(
  '/',
  checkPermission(PERMISSIONS.MANAGE_TENANT),
  [
    body('name').notEmpty(),
    body('email').optional().isEmail(),
    validate,
  ],
  tenantController.createTenant
);

router.get('/', checkPermission(PERMISSIONS.MANAGE_TENANT), tenantController.getTenants);
router.get('/:id', checkPermission(PERMISSIONS.MANAGE_TENANT), tenantController.getTenant);

module.exports = router;

