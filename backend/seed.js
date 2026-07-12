import bcrypt from 'bcryptjs';
import { db, sql } from './src/config/db.js';
import {
  employees,
  departments,
  assetCategories,
  assets,
  allocations,
  transfers,
  bookings,
  maintenanceRequests,
  auditCycles,
  auditAssignments,
  auditResults,
  notifications,
  activityLogs,
  policies
} from './src/models/schema.js';
import { eq } from 'drizzle-orm';

// Helper utilities for generating relative date strings and timestamps
const getOffsetDateString = (offsetDays) => new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const getOffsetTimestamp = (offsetDays) => new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000);

async function seed() {
  console.log('Seeding database...');

  // Clear existing data in reverse FK order
  console.log('Clearing existing data...');
  await sql`TRUNCATE TABLE assets CASCADE`;
  await sql`TRUNCATE TABLE allocations CASCADE`;
  await sql`TRUNCATE TABLE transfers CASCADE`;
  await sql`TRUNCATE TABLE bookings CASCADE`;
  await sql`TRUNCATE TABLE maintenance_requests CASCADE`;
  await sql`TRUNCATE TABLE audit_cycles CASCADE`;
  await sql`TRUNCATE TABLE audit_assignments CASCADE`;
  await sql`TRUNCATE TABLE audit_results CASCADE`;
  await sql`TRUNCATE TABLE notifications CASCADE`;
  await sql`TRUNCATE TABLE activity_logs CASCADE`;
  await sql`TRUNCATE TABLE policies CASCADE`;
  await sql`TRUNCATE TABLE asset_categories CASCADE`;
  await sql`TRUNCATE TABLE employees CASCADE`;
  await sql`TRUNCATE TABLE departments CASCADE`;
  console.log('Existing data cleared.');

  // 1. Seed Departments
  console.log('Seeding departments...');
  const [eng] = await db.insert(departments).values({ name: 'Engineering', description: 'Software & Hardware Engineering' }).returning();
  const [mkt] = await db.insert(departments).values({ name: 'Marketing', description: 'Marketing & Communications' }).returning();
  const [hr] = await db.insert(departments).values({ name: 'Human Resources', description: 'HR & Admin' }).returning();
  const [fin] = await db.insert(departments).values({ name: 'Finance', description: 'Finance & Accounts' }).returning();
  const [qa] = await db.insert(departments).values({ name: 'QA / Testing', description: 'Quality Assurance & Testing', parentDepartmentId: eng.id }).returning();

  // 2. Seed Employees
  console.log('Seeding employees...');
  const hash = await bcrypt.hash('password123', 10);
  const [admin] = await db.insert(employees).values({ email: 'admin@assetflow.com', passwordHash: hash, name: 'Admin User', role: 'admin', departmentId: eng.id }).returning();
  const [deptHead] = await db.insert(employees).values({ email: 'head@assetflow.com', passwordHash: hash, name: 'Sarah Chen', role: 'department_head', departmentId: eng.id }).returning();
  const [manager] = await db.insert(employees).values({ email: 'manager@assetflow.com', passwordHash: hash, name: 'Raj Patel', role: 'asset_manager', departmentId: eng.id }).returning();
  const [emp1] = await db.insert(employees).values({ email: 'emp1@assetflow.com', passwordHash: hash, name: 'Priya Sharma', role: 'employee', departmentId: eng.id }).returning();
  const [emp2] = await db.insert(employees).values({ email: 'emp2@assetflow.com', passwordHash: hash, name: 'Alex Kim', role: 'employee', departmentId: mkt.id }).returning();
  const [mktHead] = await db.insert(employees).values({ email: 'mkt_head@assetflow.com', passwordHash: hash, name: 'Emily Cooper', role: 'department_head', departmentId: mkt.id }).returning();
  const [hrHead] = await db.insert(employees).values({ email: 'hr_head@assetflow.com', passwordHash: hash, name: 'Jane Doe', role: 'department_head', departmentId: hr.id }).returning();
  const [finHead] = await db.insert(employees).values({ email: 'fin_head@assetflow.com', passwordHash: hash, name: 'Michael Scott', role: 'department_head', departmentId: fin.id }).returning();
  const [qaHead] = await db.insert(employees).values({ email: 'qa_head@assetflow.com', passwordHash: hash, name: 'Dwight Schrute', role: 'department_head', departmentId: qa.id }).returning();
  const [emp3] = await db.insert(employees).values({ email: 'emp3@assetflow.com', passwordHash: hash, name: 'Pam Beesly', role: 'employee', departmentId: fin.id }).returning();
  const [emp4] = await db.insert(employees).values({ email: 'emp4@assetflow.com', passwordHash: hash, name: 'Jim Halpert', role: 'employee', departmentId: qa.id }).returning();
  const [emp5] = await db.insert(employees).values({ email: 'emp5@assetflow.com', passwordHash: hash, name: 'Stanley Hudson', role: 'employee', departmentId: fin.id }).returning();

  // Update Departments with Head Employee IDs
  await db.update(departments).set({ headEmployeeId: deptHead.id }).where(eq(departments.id, eng.id));
  await db.update(departments).set({ headEmployeeId: mktHead.id }).where(eq(departments.id, mkt.id));
  await db.update(departments).set({ headEmployeeId: hrHead.id }).where(eq(departments.id, hr.id));
  await db.update(departments).set({ headEmployeeId: finHead.id }).where(eq(departments.id, fin.id));
  await db.update(departments).set({ headEmployeeId: qaHead.id }).where(eq(departments.id, qa.id));

  // 3. Seed Asset Categories
  console.log('Seeding asset categories...');
  const [catLaptop] = await db.insert(assetCategories).values({ name: 'Laptops', description: 'Portable computers', warrantyPeriodDays: 1095 }).returning();
  const [catPhone] = await db.insert(assetCategories).values({ name: 'Mobile Phones', description: 'Smartphones', warrantyPeriodDays: 730 }).returning();
  const [catFurniture] = await db.insert(assetCategories).values({ name: 'Furniture', description: 'Office furniture' }).returning();
  const [catVehicle] = await db.insert(assetCategories).values({ name: 'Vehicles', description: 'Company vehicles', warrantyPeriodDays: 1460 }).returning();
  const [catProjector] = await db.insert(assetCategories).values({ name: 'Projectors', description: 'AV equipment', warrantyPeriodDays: 730 }).returning();
  const [catSpace] = await db.insert(assetCategories).values({ name: 'Shared Spaces', description: 'Meeting rooms and workspace facilities' }).returning();

  // 4. Seed Assets
  console.log('Seeding assets...');
  const insertedAssets = await db.insert(assets).values([
    { name: 'MacBook Pro 16"', categoryId: catLaptop.id, assetTag: 'AF-0001', serialNumber: 'SN-MBP-001', acquisitionDate: getOffsetDateString(-500), acquisitionCost: '2499.00', condition: 'excellent', location: 'Engineering Floor 2', isBookable: false, status: 'allocated', currentHolderEmployeeId: emp1.id, currentDepartmentId: eng.id },
    { name: 'Dell XPS 15', categoryId: catLaptop.id, assetTag: 'AF-0002', serialNumber: 'SN-DELL-002', acquisitionDate: getOffsetDateString(-400), acquisitionCost: '1899.00', condition: 'good', location: 'Engineering Floor 2', isBookable: false, status: 'available' },
    { name: 'iPhone 15 Pro', categoryId: catPhone.id, assetTag: 'AF-0003', serialNumber: 'SN-IP-003', acquisitionDate: getOffsetDateString(-300), acquisitionCost: '1099.00', condition: 'excellent', location: 'Marketing Floor 1', isBookable: false, status: 'allocated', currentHolderEmployeeId: emp2.id, currentDepartmentId: mkt.id },
    { name: 'Meeting Room B2 Projector', categoryId: catProjector.id, assetTag: 'AF-0004', serialNumber: 'SN-PRJ-004', acquisitionDate: getOffsetDateString(-600), acquisitionCost: '899.00', condition: 'good', location: 'Building B Room 2', isBookable: true, status: 'available' },
    { name: 'Standing Desk - Oak', categoryId: catFurniture.id, assetTag: 'AF-0005', serialNumber: 'SN-DESK-005', acquisitionDate: getOffsetDateString(-700), acquisitionCost: '450.00', condition: 'good', location: 'Engineering Floor 2', isBookable: false, status: 'available' },
    { name: 'Toyota Camry 2024', categoryId: catVehicle.id, assetTag: 'AF-0006', serialNumber: 'SN-CAR-006', acquisitionDate: getOffsetDateString(-550), acquisitionCost: '32000.00', condition: 'excellent', location: 'Basement Parking', isBookable: true, status: 'available' },
    { name: 'MacBook Air M3', categoryId: catLaptop.id, assetTag: 'AF-0007', serialNumber: 'SN-MBA-007', acquisitionDate: getOffsetDateString(-90), acquisitionCost: '1299.00', condition: 'excellent', location: 'HR Floor 3', isBookable: false, status: 'allocated', currentHolderEmployeeId: emp3.id, currentDepartmentId: fin.id },
    { name: 'Samsung Galaxy S24', categoryId: catPhone.id, assetTag: 'AF-0008', serialNumber: 'SN-SG-008', acquisitionDate: getOffsetDateString(-30), acquisitionCost: '999.00', condition: 'excellent', location: 'Engineering Floor 2', isBookable: false, status: 'under_maintenance' },
    { name: 'Tesla Model 3', categoryId: catVehicle.id, assetTag: 'AF-0009', serialNumber: 'SN-TES-009', acquisitionDate: getOffsetDateString(-120), acquisitionCost: '45000.00', condition: 'excellent', location: 'Basement Parking', isBookable: true, status: 'available' },
    { name: 'Conference Room A', categoryId: catSpace.id, assetTag: 'AF-0010', serialNumber: 'SN-ROOM-010', acquisitionDate: getOffsetDateString(-1000), acquisitionCost: '5000.00', condition: 'good', location: 'Building A Floor 1', isBookable: true, status: 'available' },
    { name: 'Boardroom Large', categoryId: catSpace.id, assetTag: 'AF-0011', serialNumber: 'SN-ROOM-011', acquisitionDate: getOffsetDateString(-1000), acquisitionCost: '8000.00', condition: 'good', location: 'Building A Floor 3', isBookable: true, status: 'available' },
    { name: 'ThinkPad X1 Carbon', categoryId: catLaptop.id, assetTag: 'AF-0012', serialNumber: 'SN-THINK-012', acquisitionDate: getOffsetDateString(-60), acquisitionCost: '1799.00', condition: 'excellent', location: 'QA Floor 2', isBookable: false, status: 'reserved' },
    { name: 'iPad Pro', categoryId: catPhone.id, assetTag: 'AF-0013', serialNumber: 'SN-IPAD-013', acquisitionDate: getOffsetDateString(-365), acquisitionCost: '899.00', condition: 'poor', location: 'Finance Floor 4', isBookable: false, status: 'lost' },
    { name: 'Ergonomic Office Chair', categoryId: catFurniture.id, assetTag: 'AF-0014', serialNumber: 'SN-CHAIR-014', acquisitionDate: getOffsetDateString(-800), acquisitionCost: '350.00', condition: 'fair', location: 'Storage Room B', isBookable: false, status: 'retired' },
    { name: 'Broken Projector Screen', categoryId: catProjector.id, assetTag: 'AF-0015', serialNumber: 'SN-SCRN-015', acquisitionDate: getOffsetDateString(-900), acquisitionCost: '150.00', condition: 'poor', location: 'Storage Room B', isBookable: false, status: 'disposed' },
  ]).returning();

  // Create an asset tag to ID map for convenience
  const assetMap = {};
  insertedAssets.forEach(a => {
    assetMap[a.assetTag] = a;
  });

  // 5. Seed Allocations
  console.log('Seeding allocations...');
  const insertedAllocations = await db.insert(allocations).values([
    { assetId: assetMap['AF-0001'].id, employeeId: emp1.id, departmentId: eng.id, allocatedAt: getOffsetTimestamp(-10), expectedReturnDate: getOffsetDateString(20), status: 'active' },
    { assetId: assetMap['AF-0003'].id, employeeId: emp2.id, departmentId: mkt.id, allocatedAt: getOffsetTimestamp(-20), expectedReturnDate: getOffsetDateString(10), status: 'active' },
    { assetId: assetMap['AF-0007'].id, employeeId: emp3.id, departmentId: fin.id, allocatedAt: getOffsetTimestamp(-30), expectedReturnDate: getOffsetDateString(-5), status: 'active' }, // Overdue return
    { assetId: assetMap['AF-0002'].id, employeeId: emp1.id, departmentId: eng.id, allocatedAt: getOffsetTimestamp(-60), expectedReturnDate: getOffsetDateString(-50), returnedAt: getOffsetTimestamp(-50), conditionCheckinNotes: 'Returned in perfect condition', status: 'completed' },
  ]).returning();

  // 6. Seed Transfers
  console.log('Seeding transfers...');
  const insertedTransfers = await db.insert(transfers).values([
    { assetId: assetMap['AF-0001'].id, fromEmployeeId: emp1.id, toEmployeeId: emp2.id, status: 'requested', reason: 'Need high-perf machine for upcoming design campaign', requestedAt: getOffsetTimestamp(-2) },
    { assetId: assetMap['AF-0002'].id, fromEmployeeId: emp2.id, toEmployeeId: emp1.id, status: 'approved', approvedBy: manager.id, reason: 'QA testing requirements', requestedAt: getOffsetTimestamp(-45), resolvedAt: getOffsetTimestamp(-44) },
  ]).returning();

  // 7. Seed Bookings
  console.log('Seeding bookings...');
  const bookingStart1 = new Date();
  bookingStart1.setDate(bookingStart1.getDate() + 1); // tomorrow
  bookingStart1.setHours(10, 0, 0, 0);
  const bookingEnd1 = new Date(bookingStart1.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

  const bookingStart2 = new Date();
  bookingStart2.setDate(bookingStart2.getDate() + 2); // day after tomorrow
  bookingStart2.setHours(14, 0, 0, 0);
  const bookingEnd2 = new Date(bookingStart2.getTime() + 3 * 60 * 60 * 1000);

  const bookingStart3 = new Date();
  bookingStart3.setDate(bookingStart3.getDate() - 3); // 3 days ago
  bookingStart3.setHours(9, 0, 0, 0);
  const bookingEnd3 = new Date(bookingStart3.getTime() + 8 * 60 * 60 * 1000);

  const bookingStart4 = new Date();
  bookingStart4.setDate(bookingStart4.getDate() - 1); // yesterday
  bookingStart4.setHours(11, 0, 0, 0);
  const bookingEnd4 = new Date(bookingStart4.getTime() + 1.5 * 60 * 60 * 1000);

  const insertedBookings = await db.insert(bookings).values([
    { assetId: assetMap['AF-0004'].id, bookerEmployeeId: emp1.id, startTime: bookingStart1, endTime: bookingEnd1, status: 'upcoming', createdAt: getOffsetTimestamp(-1) },
    { assetId: assetMap['AF-0006'].id, bookerEmployeeId: deptHead.id, startTime: bookingStart2, endTime: bookingEnd2, status: 'upcoming', createdAt: getOffsetTimestamp(-1) },
    { assetId: assetMap['AF-0010'].id, bookerEmployeeId: emp2.id, startTime: bookingStart3, endTime: bookingEnd3, status: 'completed', createdAt: getOffsetTimestamp(-4) },
    { assetId: assetMap['AF-0011'].id, bookerEmployeeId: emp3.id, startTime: bookingStart4, endTime: bookingEnd4, status: 'cancelled', createdAt: getOffsetTimestamp(-2) },
  ]).returning();

  // 8. Seed Maintenance Requests
  console.log('Seeding maintenance requests...');
  const insertedMaintenance = await db.insert(maintenanceRequests).values([
    { assetId: assetMap['AF-0005'].id, requestedByEmployeeId: emp1.id, description: 'Height adjustment motor is making loud noise and getting stuck.', priority: 'medium', status: 'pending', createdAt: getOffsetTimestamp(-2) },
    { assetId: assetMap['AF-0008'].id, requestedByEmployeeId: emp2.id, description: 'Screen is flickering and battery drains too quickly.', priority: 'high', status: 'approved', approvedBy: manager.id, assignedTechnician: 'Mike Miller (IT Support)', createdAt: getOffsetTimestamp(-5) },
    { assetId: assetMap['AF-0002'].id, requestedByEmployeeId: emp1.id, description: 'OS reinstall and thermal paste replacement.', priority: 'low', status: 'resolved', approvedBy: manager.id, assignedTechnician: 'Alice Vance (Hardware Lab)', createdAt: getOffsetTimestamp(-12), resolvedAt: getOffsetTimestamp(-10) },
  ]).returning();

  // 9. Seed Audit Cycles, Assignments, and Results
  console.log('Seeding audit cycles, assignments, and results...');
  const [cycleClosed] = await db.insert(auditCycles).values({
    title: 'Q2 2026 Electronics Audit',
    scopeDepartmentId: eng.id,
    scopeLocation: 'Engineering Floor 2',
    startDate: getOffsetDateString(-60),
    endDate: getOffsetDateString(-55),
    status: 'closed',
    createdByAdminId: admin.id,
    createdAt: getOffsetTimestamp(-61)
  }).returning();

  const [cycleOpen] = await db.insert(auditCycles).values({
    title: 'July 2026 Vehicle Fleet Audit',
    scopeLocation: 'Basement Parking',
    startDate: getOffsetDateString(-2),
    endDate: getOffsetDateString(5),
    status: 'open',
    createdByAdminId: admin.id,
    createdAt: getOffsetTimestamp(-3)
  }).returning();

  // Seed assignments
  await db.insert(auditAssignments).values([
    { auditCycleId: cycleClosed.id, auditorEmployeeId: deptHead.id },
    { auditCycleId: cycleClosed.id, auditorEmployeeId: manager.id },
    { auditCycleId: cycleOpen.id, auditorEmployeeId: manager.id },
  ]);

  // Seed closed audit cycle results
  await db.insert(auditResults).values([
    { auditCycleId: cycleClosed.id, assetId: assetMap['AF-0001'].id, status: 'verified', notes: 'Verified in employee possession', checkedByEmployeeId: deptHead.id, checkedAt: getOffsetTimestamp(-58) },
    { auditCycleId: cycleClosed.id, assetId: assetMap['AF-0002'].id, status: 'verified', notes: 'Found in cabinet', checkedByEmployeeId: manager.id, checkedAt: getOffsetTimestamp(-57) },
    { auditCycleId: cycleClosed.id, assetId: assetMap['AF-0008'].id, status: 'damaged', notes: 'Battery swollen, needs repair', checkedByEmployeeId: manager.id, checkedAt: getOffsetTimestamp(-57) },
    { auditCycleId: cycleClosed.id, assetId: assetMap['AF-0013'].id, status: 'missing', notes: 'Not found in drawer, employee reports lost', checkedByEmployeeId: deptHead.id, checkedAt: getOffsetTimestamp(-58) },
  ]);

  // Seed open audit cycle results (partial)
  await db.insert(auditResults).values([
    { auditCycleId: cycleOpen.id, assetId: assetMap['AF-0006'].id, status: 'verified', notes: 'Odometer checked, clean condition', checkedByEmployeeId: manager.id, checkedAt: getOffsetTimestamp(-1) },
    { auditCycleId: cycleOpen.id, assetId: assetMap['AF-0009'].id, status: 'verified', notes: 'No issues found', checkedByEmployeeId: manager.id, checkedAt: getOffsetTimestamp(-1) },
  ]);

  // 10. Seed Notifications
  console.log('Seeding notifications...');
  await db.insert(notifications).values([
    { employeeId: emp1.id, type: 'asset_assigned', message: 'Asset AF-0001 (MacBook Pro 16") assigned to you', referenceType: 'allocation', referenceId: insertedAllocations[0].id, isRead: true, createdAt: getOffsetTimestamp(-10) },
    { employeeId: emp3.id, type: 'overdue_return_alert', message: `Asset AF-0007 (MacBook Air M3) is overdue for return! Expected return date was ${getOffsetDateString(-5)}`, referenceType: 'allocation', referenceId: insertedAllocations[2].id, isRead: false, createdAt: getOffsetTimestamp(-4) },
    { employeeId: manager.id, type: 'maintenance_request', message: 'Priya Sharma raised a maintenance request for Standing Desk - Oak', referenceType: 'maintenance_request', referenceId: insertedMaintenance[0].id, isRead: false, createdAt: getOffsetTimestamp(-2) },
    { employeeId: emp2.id, type: 'maintenance_approved', message: 'Your maintenance request for Samsung Galaxy S24 has been approved', referenceType: 'maintenance_request', referenceId: insertedMaintenance[1].id, isRead: true, createdAt: getOffsetTimestamp(-5) },
    { employeeId: deptHead.id, type: 'booking_confirmed', message: 'Your booking for Toyota Camry 2024 has been confirmed', referenceType: 'booking', referenceId: insertedBookings[1].id, isRead: false, createdAt: getOffsetTimestamp(-1) },
  ]);

  // 11. Seed Activity Logs
  console.log('Seeding activity logs...');
  await db.insert(activityLogs).values([
    { employeeId: admin.id, action: 'department_created', details: { departmentId: fin.id, name: 'Finance' }, createdAt: getOffsetTimestamp(-100) },
    { employeeId: admin.id, action: 'employee_promoted', details: { employeeId: deptHead.id, role: 'department_head' }, createdAt: getOffsetTimestamp(-99) },
    { employeeId: manager.id, action: 'asset_registered', details: { assetId: assetMap['AF-0001'].id, assetTag: 'AF-0001' }, createdAt: getOffsetTimestamp(-50) },
    { employeeId: manager.id, action: 'asset_allocated', details: { assetId: assetMap['AF-0001'].id, employeeId: emp1.id }, createdAt: getOffsetTimestamp(-10) },
    { employeeId: manager.id, action: 'maintenance_approved', details: { requestId: insertedMaintenance[1].id, assetId: assetMap['AF-0008'].id }, createdAt: getOffsetTimestamp(-5) },
    { employeeId: emp1.id, action: 'maintenance_requested', details: { assetId: assetMap['AF-0005'].id }, createdAt: getOffsetTimestamp(-2) },
    { employeeId: emp2.id, action: 'booking_created', details: { bookingId: insertedBookings[2].id, assetId: assetMap['AF-0010'].id }, createdAt: getOffsetTimestamp(-4) },
  ]);

  // 12. Seed Policies
  console.log('Seeding allocation policies...');
  await db.insert(policies).values([
    { name: 'Laptops High-Value Check', description: 'Laptops costing more than $2000 require manager approval', ruleType: 'allocate', conditions: { categoryId: catLaptop.id, maxCost: 2000 }, action: 'require_approval', priority: 1, isActive: true },
    { name: 'Vehicles Department Restriction', description: 'Only specific roles or departments can request company vehicles', ruleType: 'allocate', conditions: { categoryId: catVehicle.id }, action: 'require_approval', priority: 2, isActive: true },
  ]);

  console.log('Seed complete!');
  console.log('Login credentials:');
  console.log('  admin@assetflow.com / password123      (Admin)');
  console.log('  head@assetflow.com / password123       (Dept Head)');
  console.log('  manager@assetflow.com / password123    (Asset Manager)');
  console.log('  emp1@assetflow.com / password123       (Employee)');
  console.log('  emp2@assetflow.com / password123       (Employee)');
  console.log('  mkt_head@assetflow.com / password123   (Dept Head - Marketing)');
  console.log('  hr_head@assetflow.com / password123    (Dept Head - HR)');
  console.log('  fin_head@assetflow.com / password123   (Dept Head - Finance)');
  console.log('  qa_head@assetflow.com / password123    (Dept Head - QA)');
}

seed().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });
