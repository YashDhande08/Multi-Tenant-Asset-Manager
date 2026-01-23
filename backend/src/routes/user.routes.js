const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { tenantIsolation } = require('../middleware/tenantIsolation.middleware');
const { checkPermission } = require('../middleware/rbac.middleware');
const { PERMISSIONS } = require('../constants/permissions');
const { validate } = require('../middleware/validation.middleware');
const { body } = require('express-validator');

router.use(authenticate, tenantIsolation);

router.get('/', checkPermission(PERMISSIONS.VIEW_USERS), userController.getUsers);
router.get('/:id', checkPermission(PERMISSIONS.VIEW_USERS), userController.getUser);
router.post(
  '/',
  checkPermission(PERMISSIONS.CREATE_USER),
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    validate,
  ],
  userController.createUser
);
router.put('/:id', checkPermission(PERMISSIONS.UPDATE_USER), userController.updateUser);
router.delete('/:id', checkPermission(PERMISSIONS.DELETE_USER), userController.deleteUser);

module.exports = router;

