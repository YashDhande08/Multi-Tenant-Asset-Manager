# Multi-Tenant PAM Backend

Backend API for Multi-Tenant Personal Asset Management system.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Set up database:
```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

4. Start the server:
```bash
npm run dev
```

## API Endpoints

- `/api/auth` - Authentication routes
- `/api/tenants` - Tenant management
- `/api/users` - User management
- `/api/assets` - Asset management
- `/api/liabilities` - Liability management
- `/api/dashboard` - Dashboard data
- `/api/reports` - Reports

## Database

Uses PostgreSQL with Prisma ORM.

