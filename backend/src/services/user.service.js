const prisma = require('../config/database');
const { NotFoundError, ForbiddenError } = require('../constants/errors');
const { hashPassword } = require('../utils/password.util');

/**
 * Get all users in a tenant
 * Only Tenant Admins can see all users
 * Standard users can only see themselves
 */
const getUsers = async (tenantId, userId, userRoleId) => {
  const where = {
    tenantId: parseInt(tenantId),
    isDeleted: false,
  };

  // Standard users can only see themselves
  if (userRoleId !== 1) {
    where.id = parseInt(userId);
  }

  const users = await prisma.user.findMany({
    where,
    include: {
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      isActive: true,
      roleId: true,
      createdAt: true,
      updatedAt: true,
      role: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return users;
};

/**
 * Get user by ID with tenant isolation
 */
const getUserById = async (id, tenantId, userId, userRoleId) => {
  const where = {
    id: parseInt(id),
    tenantId: parseInt(tenantId),
    isDeleted: false,
  };

  // Standard users can only access themselves
  if (userRoleId !== 1) {
    where.id = parseInt(userId);
  }

  const user = await prisma.user.findFirst({
    where,
    include: {
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      isActive: true,
      roleId: true,
      createdAt: true,
      updatedAt: true,
      role: true,
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

/**
 * Create a new user
 * Only Tenant Admins can create users
 */
const createUser = async (data, tenantId, creatorId) => {
  const {
    name,
    email,
    password,
    roleId,
    isActive = true,
  } = data;

  // Check if user already exists in this tenant
  const existingUser = await prisma.user.findFirst({
    where: {
      email,
      tenantId: parseInt(tenantId),
      isDeleted: false,
    },
  });

  if (existingUser) {
    throw new Error('User already exists in this organization');
  }

  // Generate unique user ID
  const lastUser = await prisma.user.findFirst({
    orderBy: { id: 'desc' },
  });
  const userId = lastUser ? lastUser.id + 1 : 1;

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      id: userId,
      tenantId: parseInt(tenantId),
      name: name || null,
      email,
      passwordHash,
      isActive,
      roleId: roleId ? parseInt(roleId) : 2, // Default to Standard User (role ID 2)
      isDeleted: false,
    },
    include: {
      role: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      isActive: true,
      roleId: true,
      createdAt: true,
      role: true,
    },
  });

  return user;
};

/**
 * Update a user
 * Standard users can only update themselves (limited fields)
 * Tenant Admins can update any user
 */
const updateUser = async (id, data, tenantId, userId, userRoleId) => {
  const user = await getUserById(id, tenantId, userId, userRoleId);

  // Standard users can only update their own name
  if (userRoleId !== 1) {
    if (parseInt(id) !== parseInt(userId)) {
      throw new ForbiddenError('You can only update your own profile');
    }
    // Only allow name update for standard users
    const updateData = {
      name: data.name || user.name,
    };
    return await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { role: true },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        roleId: true,
        updatedAt: true,
        role: true,
      },
    });
  }

  // Tenant Admins can update all fields
  const updateData = {
    name: data.name !== undefined ? data.name : user.name,
    isActive: data.isActive !== undefined ? data.isActive : user.isActive,
    roleId: data.roleId ? parseInt(data.roleId) : user.roleId,
  };

  if (data.password) {
    updateData.passwordHash = await hashPassword(data.password);
  }

  const updatedUser = await prisma.user.update({
    where: { id: parseInt(id) },
    data: updateData,
    include: { role: true },
    select: {
      id: true,
      name: true,
      email: true,
      isActive: true,
      roleId: true,
      updatedAt: true,
      role: true,
    },
  });

  return updatedUser;
};

/**
 * Soft delete a user (set isDeleted = true)
 * Only Tenant Admins can delete users
 */
const deleteUser = async (id, tenantId, userId, userRoleId) => {
  if (userRoleId !== 1) {
    throw new ForbiddenError('Only Tenant Admins can delete users');
  }

  const user = await getUserById(id, tenantId, userId, userRoleId);

  // Don't allow deleting yourself
  if (parseInt(id) === parseInt(userId)) {
    throw new ForbiddenError('You cannot delete your own account');
  }

  await prisma.user.update({
    where: { id: parseInt(id) },
    data: { isDeleted: true },
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
