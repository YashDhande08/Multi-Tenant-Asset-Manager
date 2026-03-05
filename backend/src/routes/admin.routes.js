const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { tenantIsolation } = require('../middleware/tenantIsolation.middleware');
const { requireRole } = require('../middleware/rbac.middleware');
const { validate } = require('../middleware/validation.middleware');
const { body, param } = require('express-validator');

// Only authenticated Tenant Admins can access admin routes
router.use(authenticate, tenantIsolation, requireRole('TENANT_ADMIN'));

router.post(
  '/invite-user',
  [
    body('email').isEmail().normalizeEmail(),
    body('roleId')
      .isInt({ min: 1 })
      .withMessage('roleId must be a valid role identifier'),
    validate,
  ],
  adminController.inviteUser
);

router.get('/users', adminController.getUsers);

router.patch(
  '/update-role/:userId',
  [
    param('userId').isInt().withMessage('userId must be an integer'),
    body('roleId')
      .isInt({ min: 1 })
      .withMessage('roleId must be a valid role identifier'),
    validate,
  ],
  adminController.updateUserRole
);

router.delete(
  '/remove-user/:userId',
  [param('userId').isInt().withMessage('userId must be an integer'), validate],
  adminController.removeUser
);

module.exports = router;

