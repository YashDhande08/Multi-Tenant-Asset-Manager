const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create Roles
  const adminRole = await prisma.role.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Tenant Admin',
    },
  });

  const standardUserRole = await prisma.role.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Standard User',
    },
  });

  const assetOnlyRole = await prisma.role.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: 'Assets Only User',
    },
  });

  const liabilityOnlyRole = await prisma.role.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      name: 'Liabilities Only User',
    },
  });

  console.log('Roles created:', {
    adminRole,
    standardUserRole,
    assetOnlyRole,
    liabilityOnlyRole,
  });

  // Create Permissions
  const permissions = [
    { id: 1, name: 'VIEW_ASSETS' },
    { id: 2, name: 'CREATE_ASSET' },
    { id: 3, name: 'UPDATE_ASSET' },
    { id: 4, name: 'DELETE_ASSET' },
    { id: 5, name: 'VIEW_LIABILITIES' },
    { id: 6, name: 'CREATE_LIABILITY' },
    { id: 7, name: 'UPDATE_LIABILITY' },
    { id: 8, name: 'DELETE_LIABILITY' },
    { id: 9, name: 'VIEW_USERS' },
    { id: 10, name: 'CREATE_USER' },
    { id: 11, name: 'UPDATE_USER' },
    { id: 12, name: 'DELETE_USER' },
    { id: 13, name: 'VIEW_REPORTS' },
    { id: 14, name: 'MANAGE_TENANT' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { id: perm.id },
      update: {},
      create: perm,
    });
  }

  // Assign all permissions to Tenant Admin
  for (const perm of permissions) {
    await prisma.rolePermission.upsert({
      where: { id: perm.id },
      update: {},
      create: {
        id: perm.id,
        roleId: adminRole.id,
        permissionId: perm.id,
      },
    });
  }

  // Assign STANDARD_USER permissions:
  // - Assets: VIEW, CREATE, UPDATE, DELETE (1-4)
  // - Liabilities: VIEW, CREATE, UPDATE, DELETE (5-8)
  // - Reports: VIEW_REPORTS (13)
  const standardUserPermissionIds = [1, 2, 3, 4, 5, 6, 7, 8, 13];

  for (const permId of standardUserPermissionIds) {
    await prisma.rolePermission.upsert({
      where: { id: 100 + permId },
      update: {},
      create: {
        id: 100 + permId,
        roleId: standardUserRole.id,
        permissionId: permId,
      },
    });
  }

  // Assign ASSET_ONLY_USER permissions:
  // - Assets: VIEW, CREATE, UPDATE, DELETE (1-4)
  // - Reports: VIEW_REPORTS (13)
  const assetOnlyPermissionIds = [1, 2, 3, 4, 13];

  for (const permId of assetOnlyPermissionIds) {
    await prisma.rolePermission.upsert({
      where: { id: 200 + permId },
      update: {},
      create: {
        id: 200 + permId,
        roleId: assetOnlyRole.id,
        permissionId: permId,
      },
    });
  }

  // Assign LIABILITY_ONLY_USER permissions:
  // - Liabilities: VIEW, CREATE, UPDATE, DELETE (5-8)
  // - Reports: VIEW_REPORTS (13)
  const liabilityOnlyPermissionIds = [5, 6, 7, 8, 13];

  for (const permId of liabilityOnlyPermissionIds) {
    await prisma.rolePermission.upsert({
      where: { id: 300 + permId },
      update: {},
      create: {
        id: 300 + permId,
        roleId: liabilityOnlyRole.id,
        permissionId: permId,
      },
    });
  }

  // Create Asset Types
  const assetTypes = [
    { id: 1, name: 'Real Estate' },
    { id: 2, name: 'Stocks' },
    { id: 3, name: 'Bonds' },
    { id: 4, name: 'Mutual Funds' },
    { id: 5, name: 'Cash' },
    { id: 6, name: 'Crypto' },
    { id: 7, name: 'Retirement Accounts' },
    { id: 8, name: 'Other' },
  ];

  for (const type of assetTypes) {
    await prisma.assetType.upsert({
      where: { id: type.id },
      update: {},
      create: type,
    });
  }

  // Create Liability Types
  const liabilityTypes = [
    { id: 1, name: 'Mortgage' },
    { id: 2, name: 'Personal Loan' },
    { id: 3, name: 'Credit Card Debt' },
    { id: 4, name: 'Car Loan' },
    { id: 5, name: 'Student Loan' },
    { id: 6, name: 'Other' },
  ];

  for (const type of liabilityTypes) {
    await prisma.liabilityType.upsert({
      where: { id: type.id },
      update: {},
      create: type,
    });
  }

  // Create default address
  const address = await prisma.address.create({
    data: {
      line1: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400001',
    },
  });

  // Create default tenant
  const tenant = await prisma.tenant.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Default Tenant',
      email: 'admin@example.com',
      phoneNo: '+91 1234567890',
      addressId: address.id,
      baseCurrency: 'INR',
    },
  });

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: {
      email_tenantId: {
        email: 'admin@example.com',
        tenantId: tenant.id,
      },
    },
    update: {},
    create: {
      id: 1,
      tenantId: tenant.id,
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: hashedPassword,
      isActive: true,
      roleId: adminRole.id,
      isDeleted: false,
    },
  });

  // Update tenant with createdBy
  await prisma.tenant.update({
    where: { id: tenant.id },
    data: { createdBy: admin.id },
  });

  console.log('Seed data created:', { tenant, admin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
