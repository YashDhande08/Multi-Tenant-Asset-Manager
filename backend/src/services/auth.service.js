const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { generateToken, generateRefreshToken, verifyRefreshToken, generateAccessToken } = require('../utils/jwt.util');
const { hashPassword } = require('../utils/password.util');
const { NotFoundError, UnauthorizedError } = require('../constants/errors');

const register = async (data) => {
  const {
    name,
    email,
    password,
    tenantName,
    tenantEmail,
    phoneNo,
    baseCurrency,
    line1,
    line2,
    city,
    state,
    country,
    postalCode,
  } = data;

  // Generate unique tenant ID
  const lastTenant = await prisma.tenant.findFirst({
    orderBy: { id: 'desc' },
  });
  const tenantId = lastTenant ? lastTenant.id + 1 : 1;

  // Create address first
  const address = await prisma.address.create({
    data: {
      line1,
      line2: line2 || null,
      city,
      state,
      country: country || 'India',
      postalCode: postalCode || null,
    },
  });

  // Create tenant
  const tenant = await prisma.tenant.create({
    data: {
      id: tenantId,
      name: tenantName,
      email: tenantEmail || null,
      phoneNo: phoneNo || null,
      addressId: address.id,
      baseCurrency: baseCurrency || 'INR',
      createdBy: null, // Will be set after user creation
    },
  });

  // Get or create Tenant Admin role (role ID 1)
  let adminRole = await prisma.role.findUnique({ where: { id: 1 } });
  if (!adminRole) {
    adminRole = await prisma.role.create({
      data: { id: 1, name: 'Tenant Admin' },
    });
  }

  // Generate unique user ID
  const lastUser = await prisma.user.findFirst({
    orderBy: { id: 'desc' },
  });
  const userId = lastUser ? lastUser.id + 1 : 1;

  // Check if user already exists in this tenant
  const existingUser = await prisma.user.findFirst({
    where: {
      email,
      tenantId: tenant.id,
      isDeleted: false,
    },
  });

  if (existingUser) {
    throw new Error('User already exists in this organization');
  }

  const passwordHash = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      id: userId,
      tenantId: tenant.id,
      name: name || null,
      email,
      passwordHash,
      isActive: true,
      roleId: adminRole.id, // First user becomes Tenant Admin
      isDeleted: false,
    },
  });

  // Update tenant with createdBy
  await prisma.tenant.update({
    where: { id: tenant.id },
    data: { createdBy: user.id },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      tenantId: user.tenantId,
      roleId: user.roleId,
    },
    tenant: {
      id: tenant.id,
      name: tenant.name,
    },
  };
};

const login = async (email, password) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
      isDeleted: false,
      isActive: true,
    },
    include: {
      tenant: {
        include: {
          address: true,
        },
      },
      role: true,
    },
  });

  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const tokenPayload = {
    id: user.id,
    email: user.email,
    roleId: user.roleId,
    tenantId: user.tenantId,
  };

  const accessToken = generateToken(tokenPayload);
  const refreshToken = generateRefreshToken({ id: user.id, tenantId: user.tenantId });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      roleId: user.roleId,
      roleName: user.role?.name,
      tenantId: user.tenantId,
    },
    accessToken,
    refreshToken,
  };
};

const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      tenant: {
        include: {
          address: true,
        },
      },
      role: true,
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    roleId: user.roleId,
    roleName: user.role?.name,
    tenantId: user.tenantId,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = verifyRefreshToken(refreshToken);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { role: true },
    });

    if (!user || !user.isActive || user.isDeleted) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Verify tenant still exists and user still belongs to it
    const tenant = await prisma.tenant.findUnique({
      where: { id: user.tenantId },
    });

    if (!tenant) {
      throw new UnauthorizedError('Tenant not found');
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      roleId: user.roleId,
      tenantId: user.tenantId,
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken({ id: user.id, tenantId: user.tenantId });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    throw new UnauthorizedError('Invalid refresh token');
  }
};

module.exports = {
  register,
  login,
  getProfile,
  refreshAccessToken,
};
