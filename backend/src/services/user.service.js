const prisma = require('../config/database');
const { NotFoundError, ForbiddenError, BadRequestError } = require('../constants/errors');
const { hashPassword } = require('../utils/password.util');

const ROLE_ID_TO_NAME = {
  1: 'Tenant Admin',
  2: 'Standard User',
  3: 'Assets Only User',
  4: 'Liabilities Only User',
};

const ensureRoleExists = async (roleId) => {
  const parsedRoleId = parseInt(roleId, 10);
  if (!ROLE_ID_TO_NAME[parsedRoleId]) {
    throw new BadRequestError('Invalid roleId');
  }

  const role = await prisma.role.findUnique({ where: { id: parsedRoleId } });
  if (role) return role;

  // Create the role if it doesn't exist yet (fresh DB / seed not run)
  return await prisma.role.create({
    data: {
      id: parsedRoleId,
      name: ROLE_ID_TO_NAME[parsedRoleId],
    },
  });
};

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
    orderBy: { createdAt: 'desc' },
  });

  // Map to explicit shape so frontend only gets the fields it uses
  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    isActive: user.isActive,
    roleId: user.roleId,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    role: user.role
      ? {
          id: user.role.id,
          name: user.role.name,
        }
      : null,
  }));
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
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isActive: user.isActive,
    roleId: user.roleId,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    role: user.role
      ? {
          id: user.role.id,
          name: user.role.name,
        }
      : null,
  };
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

  const normalizedEmail = email.toLowerCase();
  const resolvedRoleId = roleId ? parseInt(roleId, 10) : 2;

  // Ensure the referenced role exists to avoid FK constraint errors
  await ensureRoleExists(resolvedRoleId);

  // If a previously soft-deleted user exists with the same email+tenant,
  // it will still block creation due to the DB unique constraint.
  // To support "delete then re-create with same email", we purge the soft-deleted row.
  const existingAny = await prisma.user.findFirst({
    where: {
      email: normalizedEmail,
      tenantId: parseInt(tenantId),
    },
  });

  if (existingAny && existingAny.isDeleted === false) {
    throw new Error('User already exists in this organization');
  }

  if (existingAny && existingAny.isDeleted === true) {
    await prisma.user.delete({
      where: { id: existingAny.id },
    });
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
      email: normalizedEmail,
      passwordHash,
      isActive,
      roleId: resolvedRoleId, // Default to Standard User (role ID 2)
      isDeleted: false,
    },
    include: {
      role: true,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isActive: user.isActive,
    roleId: user.roleId,
    createdAt: user.createdAt,
    role: user.role
      ? {
          id: user.role.id,
          name: user.role.name,
        }
      : null,
  };
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
    const updated = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { role: true },
    });

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      isActive: updated.isActive,
      roleId: updated.roleId,
      updatedAt: updated.updatedAt,
      role: updated.role
        ? {
            id: updated.role.id,
            name: updated.role.name,
          }
        : null,
    };
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
  });

  return {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    isActive: updatedUser.isActive,
    roleId: updatedUser.roleId,
    updatedAt: updatedUser.updatedAt,
    role: updatedUser.role
      ? {
          id: updatedUser.role.id,
          name: updatedUser.role.name,
        }
      : null,
  };
};

/**
 * Permanently delete a user from the database.
 * Only Tenant Admins can delete users and they cannot delete themselves.
 */
const deleteUser = async (id, tenantId, userId, userRoleId) => {
  if (userRoleId !== 1) {
    throw new ForbiddenError('Only Tenant Admins can delete users');
  }

  const user = await getUserById(id, tenantId, userId, userRoleId);

  // Don't allow deleting yourself
  if (parseInt(id, 10) === parseInt(userId, 10)) {
    throw new ForbiddenError('You cannot delete your own account');
  }

  await prisma.user.delete({
    where: { id: parseInt(id, 10) },
  });
};

/**
 * Update a user's role within the same tenant.
 * Only Tenant Admins can change roles and they cannot change their own role.
 */
const updateUserRole = async (id, newRoleId, tenantId, currentUserId, currentUserRoleId) => {
  if (currentUserRoleId !== 1) {
    throw new ForbiddenError('Only Tenant Admins can update user roles');
  }

  if (parseInt(id, 10) === parseInt(currentUserId, 10)) {
    throw new ForbiddenError('You cannot change your own role');
  }

  const user = await prisma.user.findFirst({
    where: {
      id: parseInt(id, 10),
      tenantId: parseInt(tenantId, 10),
      isDeleted: false,
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      roleId: parseInt(newRoleId, 10),
    },
  });

  return {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    isActive: updatedUser.isActive,
    roleId: updatedUser.roleId,
    updatedAt: updatedUser.updatedAt,
  };
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole,
};
