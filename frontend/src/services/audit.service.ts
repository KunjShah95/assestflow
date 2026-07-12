import { apiGet, apiPost, apiPatch } from '@/lib/api-client';
import type { ApiResponse } from '@/types/common';
import type { AuditCycle, AuditResult } from '@/types/audit';

export const auditService = {
  listCycles() {
    return apiGet<ApiResponse<AuditCycle>>('/audits/cycles');
  },

  createCycle(data: {
    title: string;
    scopeDepartmentId?: number;
    scopeLocation?: string;
    startDate: string;
    endDate: string;
    auditorIds?: number[];
  }) {
    return apiPost<AuditCycle>('/audits/cycles', data);
  },

  markAsset(cycleId: number, data: { assetId: number; status: string; notes?: string }) {
    return apiPost<AuditResult>(`/audits/cycles/${cycleId}/mark`, data);
  },

  closeCycle(id: number) {
    return apiPatch<AuditResult>(`/audits/cycles/${id}/close`, {});
  },

  getResults(cycleId: number) {
    return apiGet<AuditResult[]>(`/audits/cycles/${cycleId}/results`);
  },
};
