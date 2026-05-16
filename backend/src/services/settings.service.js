const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { NotFoundError, ForbiddenError, UnauthorizedError, BadRequestError } = require('../constants/errors');
const { hashPassword } = require('../utils/password.util');
const activityLogService = require('./activityLog.service');

const isTenantAdmin = (roleId) => parseInt(roleId, 10) === 1;

const mapUserProfile = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  phone: user.phone,
  profilePhotoUrl: user.profilePhotoUrl,
  preferences: user.preferences || {},
  roleId: user.roleId,
  roleName: user.role?.name,
  tenantId: user.tenantId,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId, 10) },
    include: { role: true },
  });
  if (!user || user.isDeleted) {
    throw new NotFoundError('User not found');
  }
  return mapUserProfile(user);
};

const updateProfile = async (userId, data) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId, 10) },
  });
  if (!user || user.isDeleted) {
    throw new NotFoundError('User not found');
  }

  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name?.trim() || null;
  if (data.phone !== undefined) updateData.phone = data.phone?.trim() || null;
  if (data.profilePhotoUrl !== undefined) updateData.profilePhotoUrl = data.profilePhotoUrl || null;
  if (data.preferences !== undefined) {
    updateData.preferences = {
      ...(user.preferences && typeof user.preferences === 'object' ? user.preferences : {}),
      ...data.preferences,
    };
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: updateData,
    include: { role: true },
  });

  await activityLogService.logActivity(
    user.id,
    user.tenantId,
    'PROFILE_UPDATED',
    'user',
    user.id,
    null,
    { fields: Object.keys(updateData) }
  );

  return mapUserProfile(updated);
};

const changePassword = async (userId, currentPassword, newPassword) => {
  if (!newPassword || newPassword.length < 6) {
    throw new BadRequestError('Password must be at least 6 characters');
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId, 10) },
  });
  if (!user || user.isDeleted) {
    throw new NotFoundError('User not found');
  }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    throw new UnauthorizedError('Current password is incorrect');
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  await activityLogService.logActivity(
    user.id,
    user.tenantId,
    'PASSWORD_CHANGED',
    'user',
    user.id
  );

  return { message: 'Password updated successfully' };
};

const getOrganization = async (tenantId, roleId) => {
  const tenant = await prisma.tenant.findUnique({
    where: { id: parseInt(tenantId, 10) },
    include: { address: true },
  });
  if (!tenant) {
    throw new NotFoundError('Organization not found');
  }

  const base = {
    id: tenant.id,
    name: tenant.name,
    baseCurrency: tenant.baseCurrency,
  };

  if (!isTenantAdmin(roleId)) {
    return base;
  }

  return {
    ...base,
    email: tenant.email,
    phoneNo: tenant.phoneNo,
    logoUrl: tenant.logoUrl,
    timezone: tenant.timezone,
    language: tenant.language,
    settings: tenant.settings || {},
    address: tenant.address,
    createdAt: tenant.createdAt,
    updatedAt: tenant.updatedAt,
  };
};

const updateOrganization = async (tenantId, userId, roleId, data) => {
  if (!isTenantAdmin(roleId)) {
    throw new ForbiddenError('Only administrators can update organization settings');
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: parseInt(tenantId, 10) },
  });
  if (!tenant) {
    throw new NotFoundError('Organization not found');
  }

  const updateData = {
    updatedBy: parseInt(userId, 10),
  };

  if (data.name !== undefined) updateData.name = data.name;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.phoneNo !== undefined) updateData.phoneNo = data.phoneNo;
  if (data.baseCurrency !== undefined) updateData.baseCurrency = data.baseCurrency;
  if (data.logoUrl !== undefined) updateData.logoUrl = data.logoUrl;
  if (data.timezone !== undefined) updateData.timezone = data.timezone;
  if (data.language !== undefined) updateData.language = data.language;
  if (data.settings !== undefined) {
    updateData.settings = {
      ...(tenant.settings && typeof tenant.settings === 'object' ? tenant.settings : {}),
      ...data.settings,
    };
  }

  const updated = await prisma.tenant.update({
    where: { id: tenant.id },
    data: updateData,
    include: { address: true },
  });

  await activityLogService.logActivity(
    userId,
    tenantId,
    'ORGANIZATION_UPDATED',
    'tenant',
    tenant.id,
    null,
    { fields: Object.keys(updateData) }
  );

  return {
    id: updated.id,
    name: updated.name,
    email: updated.email,
    phoneNo: updated.phoneNo,
    baseCurrency: updated.baseCurrency,
    logoUrl: updated.logoUrl,
    timezone: updated.timezone,
    language: updated.language,
    settings: updated.settings || {},
    address: updated.address,
    updatedAt: updated.updatedAt,
  };
};

const getAuditLogs = async (tenantId, options) => {
  if (!isTenantAdmin(options.roleId)) {
    throw new ForbiddenError('Only administrators can view audit logs');
  }
  return activityLogService.getActivityLogs(tenantId, options);
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getOrganization,
  updateOrganization,
  getAuditLogs,
  isTenantAdmin,
};
