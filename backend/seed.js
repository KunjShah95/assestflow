import bcrypt from 'bcryptjs';
import { db } from './src/config/db.js';
import { employees, departments, assetCategories, assets } from './src/models/schema.js';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('Seeding database...');

  const [eng] = await db.insert(departments).values({ name: 'Engineering', description: 'Software & Hardware Engineering' }).returning();
  const [mkt] = await db.insert(departments).values({ name: 'Marketing', description: 'Marketing & Communications' }).returning();
  const [hr] = await db.insert(departments).values({ name: 'Human Resources', description: 'HR & Admin' }).returning();
  const [fin] = await db.insert(departments).values({ name: 'Finance', description: 'Finance & Accounts' }).returning();

  const hash = await bcrypt.hash('password123', 10);
  const [admin] = await db.insert(employees).values({ email: 'admin@assetflow.com', passwordHash: hash, name: 'Admin User', role: 'admin', departmentId: eng.id }).returning();
  const [deptHead] = await db.insert(employees).values({ email: 'head@assetflow.com', passwordHash: hash, name: 'Sarah Chen', role: 'department_head', departmentId: eng.id }).returning();
  const [manager] = await db.insert(employees).values({ email: 'manager@assetflow.com', passwordHash: hash, name: 'Raj Patel', role: 'asset_manager', departmentId: eng.id }).returning();
  const [emp1] = await db.insert(employees).values({ email: 'emp1@assetflow.com', passwordHash: hash, name: 'Priya Sharma', role: 'employee', departmentId: eng.id }).returning();
  const [emp2] = await db.insert(employees).values({ email: 'emp2@assetflow.com', passwordHash: hash, name: 'Alex Kim', role: 'employee', departmentId: mkt.id }).returning();

  await db.update(departments).set({ headEmployeeId: deptHead.id }).where(eq(departments.id, eng.id));

  const [catLaptop] = await db.insert(assetCategories).values({ name: 'Laptops', description: 'Portable computers', warrantyPeriodDays: 1095 }).returning();
  const [catPhone] = await db.insert(assetCategories).values({ name: 'Mobile Phones', description: 'Smartphones', warrantyPeriodDays: 730 }).returning();
  const [catFurniture] = await db.insert(assetCategories).values({ name: 'Furniture', description: 'Office furniture' }).returning();
  const [catVehicle] = await db.insert(assetCategories).values({ name: 'Vehicles', description: 'Company vehicles', warrantyPeriodDays: 1460 }).returning();
  const [catProjector] = await db.insert(assetCategories).values({ name: 'Projectors', description: 'AV equipment', warrantyPeriodDays: 730 }).returning();

  await db.insert(assets).values([
    { name: 'MacBook Pro 16"', categoryId: catLaptop.id, assetTag: 'AF-0001', serialNumber: 'SN-MBP-001', acquisitionDate: '2025-01-15', acquisitionCost: '2499.00', condition: 'excellent', location: 'Engineering Floor 2', isBookable: false, status: 'available' },
    { name: 'Dell XPS 15', categoryId: catLaptop.id, assetTag: 'AF-0002', serialNumber: 'SN-DELL-002', acquisitionDate: '2025-03-10', acquisitionCost: '1899.00', condition: 'good', location: 'Engineering Floor 2', isBookable: false, status: 'available' },
    { name: 'iPhone 15 Pro', categoryId: catPhone.id, assetTag: 'AF-0003', serialNumber: 'SN-IP-003', acquisitionDate: '2025-02-20', acquisitionCost: '1099.00', condition: 'excellent', location: 'Marketing Floor 1', isBookable: false, status: 'available' },
    { name: 'Meeting Room B2 Projector', categoryId: catProjector.id, assetTag: 'AF-0004', serialNumber: 'SN-PRJ-004', acquisitionDate: '2024-11-01', acquisitionCost: '899.00', condition: 'good', location: 'Building B Room 2', isBookable: true, status: 'available' },
    { name: 'Standing Desk - Oak', categoryId: catFurniture.id, assetTag: 'AF-0005', serialNumber: 'SN-DESK-005', acquisitionDate: '2024-08-15', acquisitionCost: '450.00', condition: 'good', location: 'Engineering Floor 2', isBookable: false, status: 'available' },
    { name: 'Toyota Camry 2024', categoryId: catVehicle.id, assetTag: 'AF-0006', serialNumber: 'SN-CAR-006', acquisitionDate: '2024-12-01', acquisitionCost: '32000.00', condition: 'excellent', location: 'Basement Parking', isBookable: true, status: 'available' },
    { name: 'MacBook Air M3', categoryId: catLaptop.id, assetTag: 'AF-0007', serialNumber: 'SN-MBA-007', acquisitionDate: '2025-04-01', acquisitionCost: '1299.00', condition: 'excellent', location: 'HR Floor 3', isBookable: false, status: 'available' },
    { name: 'Samsung Galaxy S24', categoryId: catPhone.id, assetTag: 'AF-0008', serialNumber: 'SN-SG-008', acquisitionDate: '2025-06-01', acquisitionCost: '999.00', condition: 'excellent', location: 'Engineering Floor 2', isBookable: false, status: 'available' },
  ]);

  console.log('Seed complete!');
  console.log('Login credentials:');
  console.log('  admin@assetflow.com / password123  (Admin)');
  console.log('  head@assetflow.com / password123    (Dept Head)');
  console.log('  manager@assetflow.com / password123 (Asset Manager)');
  console.log('  emp1@assetflow.com / password123    (Employee)');
}

seed().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });
