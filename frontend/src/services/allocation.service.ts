import { apiPost, apiPatch } from '@/lib/api-client';

export const allocationService = {
  assign(data: { assetId: number; employeeId: number; departmentId?: number; expectedReturnDate?: string }) {
    return apiPost<{ allocation: Record<string, unknown>; intelligence: Record<string, unknown> }>('/allocations', data);
  },

  requestTransfer(data: { assetId: number; toEmployeeId: number; reason?: string }) {
    return apiPost<Record<string, unknown>>('/allocations/transfer', data);
  },

  approveTransfer(id: number) {
    return apiPatch<Record<string, unknown>>(`/allocations/transfer/${id}/approve`, {});
  },

  returnAsset(id: number, conditionNotes?: string) {
    return apiPost<Record<string, unknown>>(`/allocations/${id}/return`, { conditionNotes });
  },
};
