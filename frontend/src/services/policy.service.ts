import { apiGet } from '@/lib/api-client';

export interface Policy {
  id: number;
  name: string;
  description: string | null;
  ruleType: string;
  conditions: Record<string, unknown>;
  action: string;
  priority: number;
  isActive: boolean;
  createdAt: string;
}

export const policyService = {
  list() {
    return apiGet<Policy[]>('/policies');
  },
};
