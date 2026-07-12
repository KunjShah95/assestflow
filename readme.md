# AssetFlow OS

> Enterprise Asset & Resource Management System — engine-based backend for tracking, allocating, booking, maintaining, and auditing organizational assets.

## Architecture

```
Express 5 Controllers → 7 Engines → Drizzle ORM → NeonDB (Serverless PostgreSQL)
```

| Engine | Responsibility |
|--------|---------------|
| **Allocation** | Assign & transfer assets with conflict detection |
| **Booking** | Time-slot reservations with overlap validation |
| **Maintenance** | Request → Approve → Assign → Resolve workflow |
| **Audit** | Cycle creation, asset auditing, discrepancy reporting |
| **Policy** | Configurable business rules & guardrails |
| **Intelligence** | Decision reasoning & smart suggestions |
| **Notification** | Event-driven alerts & activity logging |

## Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Express 5 (ESM)
- **Database:** NeonDB (serverless PostgreSQL)
- **ORM:** Drizzle ORM + drizzle-kit
- **Auth:** JWT (bcrypt hashed passwords, role-based access)
- **Validation:** Zod

## Schema (14 Tables)

`departments`, `employees`, `assetCategories`, `assets`, `allocations`, `transfers`, `bookings`, `maintenanceRequests`, `auditCycles`, `auditAssignments`, `auditResults`, `notifications`, `activityLogs`, `policies`

## Quick Start

```bash
# 1. Install dependencies
cd backend && npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your NeonDB connection string

# 3. Push schema to database
npx drizzle-kit push

# 4. Seed demo data
node seed.js

# 5. Start server
node src/index.js
```

Server runs on `http://localhost:3001`.

## Test Credentials

After seeding (`node seed.js`), the following accounts are available:

| Email | Password | Role |
|-------|----------|------|
| `admin@assetflow.com` | `password123` | Admin (full system access) |
| `head@assetflow.com` | `password123` | Department Head (approve requests within dept) |
| `manager@assetflow.com` | `password123` | Asset Manager (manage assets, approve allocations/maintenance) |
| `emp1@assetflow.com` | `password123` | Employee (request assets, book resources) |
| `emp2@assetflow.com` | `password123` | Employee (request assets, book resources) |

**JWT Secret:** Auto-generated 512-bit cryptographically secure secret (see `backend/.env`).

## Roles & Permissions

| Role | Scope |
|------|-------|
| `admin` | Full system access |
| `asset_manager` | Manage assets, approve allocations/maintenance |
| `department_head` | Approve requests within department |
| `employee` | Request assets, book resources |

## API Endpoints

### Auth

```
POST /api/auth/signup              Register employee
POST /api/auth/login               Login → JWT token
GET  /api/auth/me                  Current user profile
PATCH /api/employees/:id/role      Promote role (admin only)
```

### Directory

```
GET    /api/departments             List departments
POST   /api/departments             Create department (admin)
GET    /api/categories              List asset categories
POST   /api/categories              Create category (admin)
GET    /api/employees               List employees
GET    /api/assets                  List assets (with filters)
POST   /api/assets                  Create asset (asset_manager+)
GET    /api/assets/:id              Asset detail
PATCH  /api/assets/:id              Update asset
```

### Allocation

```
POST   /api/allocations             Assign asset to employee
PATCH  /api/allocations/:id/transfer  Transfer asset
POST   /api/allocations/:id/return  Return asset
```

### Booking

```
POST   /api/bookings                Book asset (time-slot)
DELETE /api/bookings/:id            Cancel booking
GET    /api/bookings/asset/:assetId/calendar  Calendar view
GET    /api/bookings/mine           My bookings
```

### Maintenance

```
POST   /api/maintenance              Create request
PATCH  /api/maintenance/:id/approve  Approve (manager)
PATCH  /api/maintenance/:id/reject   Reject
PATCH  /api/maintenance/:id/resolve  Mark resolved
```

### Audit

```
POST   /api/audits/cycles            Create audit cycle
PATCH  /api/audits/cycles/:id/close  Close cycle
GET    /api/audits/cycles            List cycles
GET    /api/audits/cycles/:id/results  Cycle results
```

### Reports

```
GET    /api/reports/kpi              Mission Control KPIs
GET    /api/reports/idle-assets      Idle asset list
GET    /api/reports/utilization      Asset utilization stats
GET    /api/reports/booking-heatmap  Booking density heatmap
```

### Policies & Notifications

```
GET    /api/policies                 List policy rules
POST   /api/policies                 Create policy rule (admin)
PATCH  /api/policies/:id/toggle      Enable/disable rule
GET    /api/notifications            My notifications
PATCH  /api/notifications/:id/read   Mark as read
```

## File Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js              ← NeonDB + Drizzle connection
│   │   └── env.js             ← Environment validation
│   ├── models/
│   │   └── schema.js          ← 14 Drizzle table definitions
│   ├── middleware/
│   │   ├── auth.middleware.js  ← JWT verification
│   │   ├── role.middleware.js  ← Role-based access control
│   │   └── validate.middleware.js ← Zod request validation
│   ├── engines/               ← 7 business logic engines
│   │   ├── allocation.engine.js
│   │   ├── booking.engine.js
│   │   ├── maintenance.engine.js
│   │   ├── audit.engine.js
│   │   ├── policy.engine.js
│   │   ├── intelligence.engine.js
│   │   └── notification.engine.js
│   ├── controllers/           ← 12 route controllers
│   ├── routes/                ← API route definitions
│   └── index.js               ← Express 5 entry point
├── drizzle.config.ts          ← Drizzle Kit configuration
├── seed.js                    ← Demo data seeder
└── package.json
```
