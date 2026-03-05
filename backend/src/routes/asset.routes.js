const express = require('express');
const router = express.Router();
const assetController = require('../controllers/asset.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { tenantIsolation } = require('../middleware/tenantIsolation.middleware');
const { checkPermission } = require('../middleware/rbac.middleware');
const { PERMISSIONS } = require('../constants/permissions');
const { validate } = require('../middleware/validation.middleware');
const { body } = require('express-validator');

router.use(authenticate, tenantIsolation);

router.get(
  '/',
  checkPermission(PERMISSIONS.VIEW_ASSETS),
  assetController.getAssets
);
router.get(
  '/:id',
  checkPermission(PERMISSIONS.VIEW_ASSETS),
  assetController.getAsset
);
router.get(
  '/:id/history',
  checkPermission(PERMISSIONS.VIEW_ASSETS),
  assetController.getAssetValueHistory
);

// Create Asset (FR-3.3.1 / FR-3.3.3)
// Supports both:
// - Internal payload: { assetTypeId, valueAmount, ... }
// - FR-style payload: { type, currentValue, ... }
router.post(
  '/',
  checkPermission(PERMISSIONS.CREATE_ASSET),
  [
    body('name').notEmpty().withMessage('name is required'),
    body().custom((value) => {
      if (!value.assetTypeId && !value.type) {
        throw new Error('Either assetTypeId or type is required');
      }
      return true;
    }),
    body().custom((value) => {
      const hasValueAmount =
        value.valueAmount !== undefined &&
        value.valueAmount !== null &&
        value.valueAmount !== '';
      const hasCurrentValue =
        value.currentValue !== undefined &&
        value.currentValue !== null &&
        value.currentValue !== '';

      if (!hasValueAmount && !hasCurrentValue) {
        throw new Error('currentValue is required');
      }

      if (hasValueAmount && isNaN(parseFloat(value.valueAmount))) {
        throw new Error('valueAmount must be a valid number');
      }

      if (hasCurrentValue && isNaN(parseFloat(value.currentValue))) {
        throw new Error('currentValue must be a valid number');
      }

      return true;
    }),
    validate,
  ],
  assetController.createAsset
);

router.put(
  '/:id',
  checkPermission(PERMISSIONS.UPDATE_ASSET),
  assetController.updateAsset
);
router.delete(
  '/:id',
  checkPermission(PERMISSIONS.DELETE_ASSET),
  assetController.deleteAsset
);
router.post(
  '/:id/history',
  checkPermission(PERMISSIONS.UPDATE_ASSET),
  assetController.addValueHistory
);

module.exports = router;

