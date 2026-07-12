import { apiGet, apiPost, apiPatch } from '@/lib/api-client';
import type { AuditCycle, AuditResult } from '@/types/audit';

export const auditService = {
  listCycles() {
    return apiGet<AuditCycle[]>('/audits');
  },

  createCycle(data: {
    title: string;
    scopeDepartmentId?: number;
    scopeLocation?: string;
    startDate: string;
    endDate: string;
    auditorIds?: number[];
  }) {
    return apiPost<AuditCycle>('/audits', data);
  },

  markAsset(cycleId: number, data: { assetId: number; status: string; notes?: string }) {
    return apiPost<{ message: string }>(`/audits/${cycleId}/mark`, data);
  },

  closeCycle(id: number) {
    return apiPatch<{ message: string }>(`/audits/${id}/close`, {});
  },

  getResults(cycleId: number) {
    return apiGet<AuditResult[]>(`/audits/${cycleId}/results`);
  },
};
