const crypto = require('crypto');
const prisma = require('../config/database');
const { hashPassword } = require('../utils/password.util');
const {
  BadRequestError,
  NotFoundError,
} = require('../constants/errors');
const {
  generateToken,
  generateRefreshToken,
} = require('../utils/jwt.util');

// 7 days in milliseconds
const INVITE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

const ALLOWED_ROLE_IDS = [1, 2]; // 1: Tenant Admin, 2: Standard User

const createInvite = async (email, roleId, tenantId, inviterId) => {
  const normalizedEmail = email.toLowerCase();
  const parsedRoleId = parseInt(roleId, 10);

  if (!ALLOWED_ROLE_IDS.includes(parsedRoleId)) {
    throw new BadRequestError('Invalid role for invitation');
  }

  // Ensure role exists
  const role = await prisma.role.findUnique({
    where: { id: parsedRoleId },
  });

  if (!role) {
    throw new BadRequestError('Role does not exist');
  }

  // Check if user already exists in this tenant
  const existingUser = await prisma.user.findFirst({
    where: {
      email: normalizedEmail,
      tenantId: parseInt(tenantId, 10),
      isDeleted: false,
    },
  });

  if (existingUser) {
    throw new BadRequestError('User already exists in this tenant');
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + INVITE_EXPIRY_MS);

  // Optional: clean up previous invites for same email + tenant
  await prisma.invite.deleteMany({
    where: {
      email: normalizedEmail,
      tenantId: parseInt(tenantId, 10),
    },
  });

  const invite = await prisma.invite.create({
    data: {
      email: normalizedEmail,
      roleId: parsedRoleId,
      token,
      tenantId: parseInt(tenantId, 10),
      expiresAt,
    },
    include: {
      role: true,
      tenant: true,
    },
  });

  const inviteUrl = `https://app-domain.com/invite/${invite.token}`;

  return {
    id: invite.id,
    email: invite.email,
    roleId: invite.roleId,
    roleName: invite.role?.name,
    tenantId: invite.tenantId,
    expiresAt: invite.expiresAt,
    token: invite.token,
    inviteUrl,
  };
};

const acceptInvite = async ({ token, password, name }) => {
  const invite = await prisma.invite.findFirst({
    where: {
      token,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      role: true,
      tenant: true,
    },
  });

  if (!invite) {
    throw new NotFoundError('Invalid or expired invitation token');
  }

  // Check again that user does not already exist
  const existingUser = await prisma.user.findFirst({
    where: {
      email: invite.email,
      tenantId: invite.tenantId,
      isDeleted: false,
    },
  });

  if (existingUser) {
    // Clean up invite to prevent reuse
    await prisma.invite.delete({ where: { id: invite.id } });
    throw new BadRequestError('User already exists for this invitation');
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
      tenantId: invite.tenantId,
      name: name || null,
      email: invite.email,
      passwordHash,
      isActive: true,
      roleId: invite.roleId,
      isDeleted: false,
    },
  });

  // Consume invite so it cannot be reused
  await prisma.invite.delete({
    where: { id: invite.id },
  });

  const tokenPayload = {
    id: user.id,
    email: user.email,
    roleId: user.roleId,
    tenantId: user.tenantId,
  };

  const accessToken = generateToken(tokenPayload);
  const refreshToken = generateRefreshToken({
    id: user.id,
    tenantId: user.tenantId,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      roleId: user.roleId,
      tenantId: user.tenantId,
    },
    accessToken,
    refreshToken,
  };
};

module.exports = {
  createInvite,
  acceptInvite,
};

