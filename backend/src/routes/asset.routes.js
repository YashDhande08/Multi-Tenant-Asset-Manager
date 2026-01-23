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

router.get('/', checkPermission(PERMISSIONS.VIEW_ASSETS), assetController.getAssets);
router.get('/:id', checkPermission(PERMISSIONS.VIEW_ASSETS), assetController.getAsset);
router.get('/:id/history', checkPermission(PERMISSIONS.VIEW_ASSETS), assetController.getAssetValueHistory);
router.post(
  '/',
  checkPermission(PERMISSIONS.CREATE_ASSET),
  [
    body('name').notEmpty(),
    body('assetTypeId').isInt({ min: 1 }),
    body('valueAmount').isFloat({ min: 0 }),
    validate,
  ],
  assetController.createAsset
);
router.put('/:id', checkPermission(PERMISSIONS.UPDATE_ASSET), assetController.updateAsset);
router.delete('/:id', checkPermission(PERMISSIONS.DELETE_ASSET), assetController.deleteAsset);
router.post('/:id/history', checkPermission(PERMISSIONS.UPDATE_ASSET), assetController.addValueHistory);

module.exports = router;

