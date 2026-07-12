import { db } from '../config/db.js';
import { policies } from '../models/schema.js';
import { eq, and } from 'drizzle-orm';

export async function evaluate(actionType, context) {
  const rules = await db.select().from(policies).where(and(eq(policies.ruleType, actionType), eq(policies.isActive, true))).orderBy(policies.priority);

  for (const rule of rules) {
    const c = rule.conditions;
    let matched = true;
    if (c.employeeRole && context.employeeRole !== c.employeeRole) matched = false;
    if (c.categoryId && context.asset?.categoryId !== c.categoryId) matched = false;
    if (c.maxCost && context.asset && parseFloat(context.asset.acquisitionCost) > c.maxCost) matched = false;
    if (matched) {
      return { allowed: rule.action === 'allow' || rule.action === 'require_approval', requiresApproval: rule.action === 'require_approval', reason: `${rule.name}: ${rule.description || `Policy ${rule.action}`}`, ruleId: rule.id };
    }
  }
  return { allowed: true, requiresApproval: false, reason: 'No matching policy restrictions' };
}

export async function createPolicy(data) {
  const [policy] = await db.insert(policies).values(data).returning();
  return policy;
}

export async function listPolicies() {
  return db.select().from(policies).orderBy(policies.priority);
}
