const express = require('express');
const router = express.Router();
const liabilityController = require('../controllers/liability.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { tenantIsolation } = require('../middleware/tenantIsolation.middleware');
const { checkPermission } = require('../middleware/rbac.middleware');
const { PERMISSIONS } = require('../constants/permissions');
const { validate } = require('../middleware/validation.middleware');
const { body } = require('express-validator');

router.use(authenticate, tenantIsolation);

router.get('/', checkPermission(PERMISSIONS.VIEW_LIABILITIES), liabilityController.getLiabilities);
router.get('/:id', checkPermission(PERMISSIONS.VIEW_LIABILITIES), liabilityController.getLiability);
router.post(
  '/',
  checkPermission(PERMISSIONS.CREATE_LIABILITY),
  [
    body('name').notEmpty(),
    body('liabilityTypeId').isInt({ min: 1 }),
    body('currentValue').isFloat({ min: 0 }),
    validate,
  ],
  liabilityController.createLiability
);
router.put('/:id', checkPermission(PERMISSIONS.UPDATE_LIABILITY), liabilityController.updateLiability);
router.delete('/:id', checkPermission(PERMISSIONS.DELETE_LIABILITY), liabilityController.deleteLiability);

module.exports = router;

