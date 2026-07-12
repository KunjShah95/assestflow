import { apiGet, apiPost, apiPatch } from '@/lib/api-client';
import type { ApiResponse } from '@/types/common';
import type { Allocation } from '@/types/allocation';

export const allocationService = {
  list() {
    return apiGet<ApiResponse<Allocation>>('/allocations');
  },

  assign(data: { assetId: number; toEmployeeId: number; notes?: string }) {
    return apiPost<Allocation>('/allocations', data);
  },

  transfer(id: number, data: { toEmployeeId: number; reason?: string }) {
    return apiPatch<Allocation>(`/allocations/${id}/transfer`, data);
  },

  returnAsset(id: number) {
    return apiPost<Allocation>(`/allocations/${id}/return`, {});
  },
};
