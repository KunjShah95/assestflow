import { db } from '../config/db.js';
import { assets, allocations, employees } from '../models/schema.js';
import { eq, and, count } from 'drizzle-orm';

export async function generateAllocationReasoning(assetId, employeeId) {
  const [asset] = await db.select().from(assets).where(eq(assets.id, assetId)).limit(1);
  const [emp] = await db.select().from(employees).where(eq(employees.id, employeeId)).limit(1);
  const reasoning = [];
  if (asset.condition) reasoning.push(`Asset condition: ${asset.condition}`);
  if (asset.acquisitionDate) {
    const yearsHeld = new Date().getFullYear() - new Date(asset.acquisitionDate).getFullYear();
    const remaining = 5 - yearsHeld;
    if (remaining > 0) reasoning.push(`Estimated remaining useful life: ${remaining} year(s)`);
  }
  const [activeAllocCount] = await db.select({ count: count() }).from(allocations).where(and(eq(allocations.employeeId, employeeId), eq(allocations.status, 'active')));
  reasoning.push(`Employee has ${activeAllocCount.count} active allocation(s)`);
  return { reasoning, riskScore: asset.condition === 'excellent' ? 0.05 : asset.condition === 'good' ? 0.15 : 0.3 };
}
