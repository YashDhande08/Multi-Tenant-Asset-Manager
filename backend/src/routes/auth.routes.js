const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { body } = require('express-validator');

router.post(
  '/register',
  [
    body('name').notEmpty().trim(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('tenantName').notEmpty().trim(),
    body('tenantEmail').optional().isEmail().normalizeEmail(),
    body('phoneNo').optional().trim(),
    body('baseCurrency').optional().trim(),
    body('line1').notEmpty().trim(),
    body('city').notEmpty().trim(),
    body('state').notEmpty().trim(),
    body('country').optional().trim(),
    validate,
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
    validate,
  ],
  authController.login
);

router.get('/profile', authenticate, authController.getProfile);
router.post('/refresh', authController.refreshToken);

module.exports = router;

