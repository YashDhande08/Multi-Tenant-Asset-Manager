# Multi-Tenant Personal Asset Management (PAM) System

A comprehensive multi-tenant application for managing personal assets and liabilities with role-based access control.

## Project Structure

```
multi-tenant-pam/
├── backend/          # Node.js/Express backend API
├── frontend/         # React frontend application
└── README.md         # This file
```

## Features

- **Multi-Tenant Architecture**: Complete tenant isolation with secure data separation
- **User Management**: Role-based access control (Super Admin, Admin, User)
- **Asset Management**: Track and manage various types of assets
- **Liability Management**: Monitor and manage liabilities
- **Dashboard**: Real-time overview of financial status
- **Reports**: Year-over-year comparisons and performance reports
- **Activity Logging**: Comprehensive audit trail

## Tech Stack

### Backend
- Node.js & Express
- PostgreSQL with Prisma ORM
- JWT Authentication
- Role-Based Access Control (RBAC)

### Frontend
- React 19
- React Router
- Tailwind CSS
- Vite

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

5. Start the backend server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your API base URL
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Default Credentials

After seeding the database, you can login with:
- Email: `admin@example.com`
- Password: `admin123`

## API Endpoints

- `/api/auth` - Authentication routes
- `/api/tenants` - Tenant management
- `/api/users` - User management
- `/api/assets` - Asset management
- `/api/liabilities` - Liability management
- `/api/dashboard` - Dashboard data
- `/api/reports` - Reports

## License

ISC

