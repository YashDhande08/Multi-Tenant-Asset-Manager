const prisma = require('../config/database');
const { ForbiddenError } = require('../constants/errors');

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.roleId) {
        throw new ForbiddenError('User role not found');
      }

      // Get user's role with permissions
      const userRole = await prisma.role.findUnique({
        where: { id: req.user.roleId },
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      });

      if (!userRole) {
        throw new ForbiddenError('Invalid role');
      }

      // Check if user has the required permission
      const hasPermission = userRole.rolePermissions.some(
        (rp) => rp.permission.name === requiredPermission
      );

      if (!hasPermission) {
        throw new ForbiddenError('Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

const checkRole = (...allowedRoleIds) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.roleId) {
        throw new ForbiddenError('User role not found');
      }

      if (!allowedRoleIds.includes(req.user.roleId)) {
        throw new ForbiddenError('Insufficient role privileges');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Require one of the given high-level role names.
 *
 * Expected names (from SRS):
 * - "TENANT_ADMIN"
 * - "STANDARD_USER"
 *
 * We keep this middleware layered on top of the existing numeric role IDs
 * to avoid changing the current DB schema or auth logic.
 */
const ROLE_NAME_TO_ID = {
  TENANT_ADMIN: 1,
  STANDARD_USER: 2,
};

const requireRole = (...allowedRoleNames) => {
  const allowedRoleIds = allowedRoleNames
    .map((name) => ROLE_NAME_TO_ID[name])
    .filter((id) => typeof id === 'number');

  return (req, res, next) => {
    try {
      if (!req.user || !req.user.roleId) {
        // Return the exact 403 structure required by the SRS
        return res.status(403).json({ message: 'Access denied' });
      }

      if (!allowedRoleIds.includes(req.user.roleId)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { checkPermission, checkRole, requireRole };
