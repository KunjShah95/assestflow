import { apiGet, apiPost, apiPatch } from '@/lib/api-client';
import type { ApiResponse } from '@/types/common';
import type { MaintenanceRequest } from '@/types/maintenance';

export const maintenanceService = {
  list() {
    return apiGet<ApiResponse<MaintenanceRequest>>('/maintenance');
  },

  create(data: { assetId: number; description: string; priority: string }) {
    return apiPost<MaintenanceRequest>('/maintenance', data);
  },

  approve(id: number) {
    return apiPatch<MaintenanceRequest>(`/maintenance/${id}/approve`, {});
  },

  reject(id: number) {
    return apiPatch<MaintenanceRequest>(`/maintenance/${id}/reject`, {});
  },

  resolve(id: number) {
    return apiPatch<MaintenanceRequest>(`/maintenance/${id}/resolve`, {});
  },
};
