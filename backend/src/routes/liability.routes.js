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

router.get(
  '/',
  checkPermission(PERMISSIONS.VIEW_LIABILITIES),
  liabilityController.getLiabilities
);
router.get(
  '/:id',
  checkPermission(PERMISSIONS.VIEW_LIABILITIES),
  liabilityController.getLiability
);

// Create Liability (FR-3.3.2 / FR-3.3.3)
// Supports both:
// - Internal payload: { liabilityTypeId, currentValue, ... }
// - FR-style payload: { type, amount, ... }
router.post(
  '/',
  checkPermission(PERMISSIONS.CREATE_LIABILITY),
  [
    body('name').notEmpty().withMessage('name is required'),
    body().custom((value) => {
      if (!value.liabilityTypeId && !value.type) {
        throw new Error('Either liabilityTypeId or type is required');
      }
      return true;
    }),
    body().custom((value) => {
      const hasCurrentValue =
        value.currentValue !== undefined &&
        value.currentValue !== null &&
        value.currentValue !== '';
      const hasAmount =
        value.amount !== undefined &&
        value.amount !== null &&
        value.amount !== '';

      if (!hasCurrentValue && !hasAmount) {
        throw new Error('currentValue/amount is required');
      }

      if (hasCurrentValue && isNaN(parseFloat(value.currentValue))) {
        throw new Error('currentValue must be a valid number');
      }

      if (hasAmount && isNaN(parseFloat(value.amount))) {
        throw new Error('amount must be a valid number');
      }

      return true;
    }),
    validate,
  ],
  liabilityController.createLiability
);

router.put(
  '/:id',
  checkPermission(PERMISSIONS.UPDATE_LIABILITY),
  liabilityController.updateLiability
);
router.delete(
  '/:id',
  checkPermission(PERMISSIONS.DELETE_LIABILITY),
  liabilityController.deleteLiability
);

module.exports = router;

