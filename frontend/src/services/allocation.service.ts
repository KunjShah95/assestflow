import { apiGet, apiPost, apiPatch } from '@/lib/api-client';

interface AllocationRecord {
  id: number;
  assetId: number;
  assetName: string | null;
  assetTag: string | null;
  employeeId: number;
  employeeName: string | null;
  departmentId: number | null;
  departmentName: string | null;
  allocatedAt: string | null;
  expectedReturnDate: string | null;
  returnedAt: string | null;
  conditionCheckinNotes: string | null;
  status: string;
}

export const allocationService = {
  list() {
    return apiGet<AllocationRecord[]>('/allocations');
  },

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
