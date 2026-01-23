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

module.exports = { checkPermission, checkRole };
