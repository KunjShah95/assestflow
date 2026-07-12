import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  date,
  numeric,
  boolean,
  jsonb,
} from 'drizzle-orm/pg-core';

export const departments = pgTable('departments', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description'),
  parentDepartmentId: integer('parent_department_id'),
  headEmployeeId: integer('head_employee_id'),
  status: varchar('status', { length: 20 }).default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const employees = pgTable('employees', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  departmentId: integer('department_id'),
  role: varchar('role', { length: 20 }).default('employee').notNull(),
  status: varchar('status', { length: 20 }).default('active'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const assetCategories = pgTable('asset_categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description'),
  warrantyPeriodDays: integer('warranty_period_days'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const assets = pgTable('assets', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  categoryId: integer('category_id').notNull(),
  assetTag: varchar('asset_tag', { length: 20 }).notNull().unique(),
  serialNumber: varchar('serial_number', { length: 255 }),
  acquisitionDate: date('acquisition_date'),
  acquisitionCost: numeric('acquisition_cost', { precision: 12, scale: 2 }),
  condition: varchar('condition', { length: 50 }).default('good'),
  location: varchar('location', { length: 255 }),
  photoUrls: text('photo_urls').array(),
  isBookable: boolean('is_bookable').default(false),
  status: varchar('status', { length: 30 }).default('available').notNull(),
  currentHolderEmployeeId: integer('current_holder_employee_id'),
  currentDepartmentId: integer('current_department_id'),
  qrCode: text('qr_code'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const allocations = pgTable('allocations', {
  id: serial('id').primaryKey(),
  assetId: integer('asset_id').notNull(),
  employeeId: integer('employee_id').notNull(),
  departmentId: integer('department_id'),
  allocatedAt: timestamp('allocated_at').defaultNow(),
  expectedReturnDate: date('expected_return_date'),
  returnedAt: timestamp('returned_at'),
  conditionCheckinNotes: text('condition_checkin_notes'),
  status: varchar('status', { length: 20 }).default('active'),
});

export const transfers = pgTable('transfers', {
  id: serial('id').primaryKey(),
  assetId: integer('asset_id').notNull(),
  fromEmployeeId: integer('from_employee_id'),
  toEmployeeId: integer('to_employee_id').notNull(),
  status: varchar('status', { length: 20 }).default('requested'),
  requestedAt: timestamp('requested_at').defaultNow(),
  resolvedAt: timestamp('resolved_at'),
  approvedBy: integer('approved_by'),
  reason: text('reason'),
});

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  assetId: integer('asset_id').notNull(),
  bookerEmployeeId: integer('booker_employee_id').notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  status: varchar('status', { length: 20 }).default('upcoming'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const maintenanceRequests = pgTable('maintenance_requests', {
  id: serial('id').primaryKey(),
  assetId: integer('asset_id').notNull(),
  requestedByEmployeeId: integer('requested_by_employee_id').notNull(),
  description: text('description').notNull(),
  priority: varchar('priority', { length: 20 }).default('medium'),
  photoUrl: text('photo_url'),
  status: varchar('status', { length: 30 }).default('pending'),
  approvedBy: integer('approved_by'),
  assignedTechnician: varchar('assigned_technician', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  resolvedAt: timestamp('resolved_at'),
});

export const auditCycles = pgTable('audit_cycles', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  scopeDepartmentId: integer('scope_department_id'),
  scopeLocation: varchar('scope_location', { length: 255 }),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  status: varchar('status', { length: 20 }).default('open'),
  createdByAdminId: integer('created_by_admin_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const auditAssignments = pgTable('audit_assignments', {
  id: serial('id').primaryKey(),
  auditCycleId: integer('audit_cycle_id').notNull(),
  auditorEmployeeId: integer('auditor_employee_id').notNull(),
});

export const auditResults = pgTable('audit_results', {
  id: serial('id').primaryKey(),
  auditCycleId: integer('audit_cycle_id').notNull(),
  assetId: integer('asset_id').notNull(),
  status: varchar('status', { length: 30 }).notNull(),
  notes: text('notes'),
  checkedByEmployeeId: integer('checked_by_employee_id'),
  checkedAt: timestamp('checked_at').defaultNow(),
});

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id').notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  message: text('message').notNull(),
  referenceType: varchar('reference_type', { length: 50 }),
  referenceId: integer('reference_id'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id').notNull(),
  action: varchar('action', { length: 100 }).notNull(),
  details: jsonb('details'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const policies = pgTable('policies', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description'),
  ruleType: varchar('rule_type', { length: 50 }).notNull(),
  conditions: jsonb('conditions').notNull(),
  action: varchar('action', { length: 20 }).notNull(),
  priority: integer('priority').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});
