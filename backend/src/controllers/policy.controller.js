import * as policyEngine from '../engines/policy.engine.js';
import { z } from 'zod';

export async function create(req, res) {
  const data = z.object({ name: z.string().min(1), description: z.string().optional(), ruleType: z.string().min(1), conditions: z.any(), action: z.enum(['allow', 'deny', 'require_approval']), priority: z.number().optional() }).parse(req.body);
  const policy = await policyEngine.createPolicy(data);
  res.status(201).json(policy);
}

export async function list(req, res) {
  const policies = await policyEngine.listPolicies();
  res.json(policies);
}
