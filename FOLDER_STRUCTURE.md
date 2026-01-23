# Multi-Tenant PAM - Complete Folder Structure

```
multi-tenant-pam/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   └── migrations/
│   │       └── [migration_files]
│   │
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── env.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── tenantIsolation.middleware.js
│   │   │   ├── rbac.middleware.js
│   │   │   ├── errorHandler.middleware.js
│   │   │   ├── validation.middleware.js
│   │   │   └── rateLimiter.middleware.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── tenant.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── asset.controller.js
│   │   │   ├── liability.controller.js
│   │   │   ├── dashboard.controller.js
│   │   │   ├── report.controller.js
│   │   │   └── activityLog.controller.js
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── tenant.service.js
│   │   │   ├── user.service.js
│   │   │   ├── asset.service.js
│   │   │   ├── liability.service.js
│   │   │   ├── dashboard.service.js
│   │   │   ├── report.service.js
│   │   │   └── activityLog.service.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── tenant.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── asset.routes.js
│   │   │   ├── liability.routes.js
│   │   │   ├── dashboard.routes.js
│   │   │   ├── report.routes.js
│   │   │   └── index.js
│   │   │
│   │   ├── utils/
│   │   │   ├── jwt.util.js
│   │   │   ├── password.util.js
│   │   │   ├── validation.util.js
│   │   │   ├── prisma.util.js
│   │   │   └── logger.util.js
│   │   │
│   │   ├── constants/
│   │   │   ├── roles.js
│   │   │   ├── permissions.js
│   │   │   └── errors.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   │
│   ├── .env.example
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── ErrorBoundary.jsx
│   │   │   │   ├── Table.jsx
│   │   │   │   └── Pagination.jsx
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── DashboardLayout.jsx
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   └── PrivateRoute.jsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── NetWorthCard.jsx
│   │   │   │   ├── AssetAllocationChart.jsx
│   │   │   │   ├── NetWorthGrowthChart.jsx
│   │   │   │   └── RecentActivity.jsx
│   │   │   │
│   │   │   ├── assets/
│   │   │   │   ├── AssetList.jsx
│   │   │   │   ├── AssetForm.jsx
│   │   │   │   ├── AssetCard.jsx
│   │   │   │   ├── AssetValueHistory.jsx
│   │   │   │   └── AssetTypeSelector.jsx
│   │   │   │
│   │   │   ├── liabilities/
│   │   │   │   ├── LiabilityList.jsx
│   │   │   │   ├── LiabilityForm.jsx
│   │   │   │   ├── LiabilityCard.jsx
│   │   │   │   └── LiabilityTypeSelector.jsx
│   │   │   │
│   │   │   ├── reports/
│   │   │   │   ├── YoYComparison.jsx
│   │   │   │   ├── PerformanceReport.jsx
│   │   │   │   └── AssetClassComparison.jsx
│   │   │   │
│   │   │   └── users/
│   │   │       ├── UserList.jsx
│   │   │       ├── UserForm.jsx
│   │   │       └── UserCard.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Assets.jsx
│   │   │   ├── Liabilities.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── Users.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.service.js
│   │   │   ├── asset.service.js
│   │   │   ├── liability.service.js
│   │   │   ├── dashboard.service.js
│   │   │   ├── report.service.js
│   │   │   ├── tenant.service.js
│   │   │   └── user.service.js
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── TenantContext.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useTenant.js
│   │   │   ├── useApi.js
│   │   │   └── useRefreshToken.js
│   │   │
│   │   ├── utils/
│   │   │   ├── formatters.js
│   │   │   ├── validators.js
│   │   │   ├── constants.js
│   │   │   └── tokenManager.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env.example
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── README.md
│
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   └── SECURITY.md
│
├── .gitignore
├── README.md
└── docker-compose.yml
```

## Key Files Description

### Backend Core Files

**prisma/schema.prisma**
- All Prisma models with tenant_id on every business table
- Proper relations and indexes
- Tenant isolation enforced at schema level

**src/middleware/tenantIsolation.middleware.js**
- Enforces tenant isolation on every request
- Validates tenant_id from JWT
- Prevents cross-tenant data access

**src/middleware/rbac.middleware.js**
- Role-based access control
- Permission checking from database
- Dynamic permission validation

**src/utils/jwt.util.js**
- Access token generation (15min expiry)
- Refresh token generation (7 days expiry)
- Token verification utilities

**src/services/auth.service.js**
- Registration with tenant creation
- Login with access + refresh tokens
- Token refresh functionality

### Frontend Core Files

**src/services/api.js**
- Axios instance with interceptors
- Automatic token refresh on 401
- Request/response interceptors

**src/hooks/useRefreshToken.js**
- Automatic token refresh logic
- Token storage management
- Silent refresh before expiry

**src/context/AuthContext.jsx**
- Global auth state management
- Token refresh handling
- User session management

### Security Features

1. **Tenant Isolation**
   - Every query filtered by tenant_id
   - Middleware validation
   - Prisma query filtering

2. **JWT Security**
   - Access tokens (short-lived)
   - Refresh tokens (long-lived)
   - Secure token storage

3. **RBAC**
   - Database-driven permissions
   - Dynamic role checking
   - Permission-based route protection

