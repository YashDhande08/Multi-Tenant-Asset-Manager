const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { tenantIsolation } = require('../middleware/tenantIsolation.middleware');
const { requireRole } = require('../middleware/rbac.middleware');
const { validate } = require('../middleware/validation.middleware');
const { body } = require('express-validator');

router.use(authenticate, tenantIsolation);

router.get('/profile', settingsController.getProfile);
router.patch(
  '/profile',
  [
    body('name').optional().trim().isLength({ min: 1, max: 120 }),
    body('phone').optional().trim().isLength({ max: 30 }),
    body('profilePhotoUrl').optional().isString(),
    body('preferences').optional().isObject(),
    validate,
  ],
  settingsController.updateProfile
);

router.post(
  '/change-password',
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 }),
    validate,
  ],
  settingsController.changePassword
);

router.get('/organization', settingsController.getOrganization);
router.patch(
  '/organization',
  requireRole('TENANT_ADMIN'),
  [
    body('name').optional().trim().notEmpty(),
    body('email').optional().isEmail(),
    body('baseCurrency').optional().trim(),
    body('settings').optional().isObject(),
    validate,
  ],
  settingsController.updateOrganization
);

router.get('/audit-logs', requireRole('TENANT_ADMIN'), settingsController.getAuditLogs);

module.exports = router;
