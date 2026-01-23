const prisma = require('../config/database');

/**
 * Log user activity with tenant isolation
 */
const logActivity = async (userId, tenantId, action, entityType, entityId, oldData = null, newData = null, ipAddress = null, userAgent = null) => {
  try {
    const lastLog = await prisma.userActivityLog.findFirst({
      orderBy: { id: 'desc' },
    });
    const logId = lastLog ? BigInt(lastLog.id) + BigInt(1) : BigInt(1);

    const activityLog = await prisma.userActivityLog.create({
      data: {
        id: logId,
        userId: parseInt(userId),
        tenantId: parseInt(tenantId),
        action,
        entityType,
        entityId: entityId ? parseInt(entityId) : null,
        oldData: oldData ? oldData : null,
        newData: newData ? newData : null,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      },
    });

    return activityLog;
  } catch (error) {
    // Don't throw - logging should not break the main flow
    console.error('Error logging activity:', error);
    return null;
  }
};

/**
 * Get activity logs for a tenant
 * Standard users can only see their own activities
 * Tenant Admins can see all tenant activities
 */
const getActivityLogs = async (tenantId, options = {}) => {
  const { userId, roleId, limit = 50, offset = 0 } = options;

  const where = {
    tenantId: parseInt(tenantId),
  };

  // Standard users can only see their own activities
  if (roleId !== 1 && userId) {
    where.userId = parseInt(userId);
  }

  const [logs, total] = await Promise.all([
    prisma.userActivityLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset),
    }),
    prisma.userActivityLog.count({ where }),
  ]);

  return {
    logs: logs.map(log => ({
      ...log,
      id: log.id.toString(),
    })),
    total,
    limit: parseInt(limit),
    offset: parseInt(offset),
  };
};

module.exports = {
  logActivity,
  getActivityLogs,
};
