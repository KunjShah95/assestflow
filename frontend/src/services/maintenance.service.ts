import { apiGet, apiPost, apiPatch } from '@/lib/api-client';
import type { MaintenanceRequest } from '@/types/maintenance';

export const maintenanceService = {
  list() {
    return apiGet<MaintenanceRequest[]>('/maintenance');
  },

  create(data: { assetId: number; description: string; priority: string; photoUrl?: string }) {
    return apiPost<MaintenanceRequest>('/maintenance', data);
  },

  approve(id: number) {
    return apiPatch<{ message: string }>(`/maintenance/${id}/approve`, {});
  },

  reject(id: number) {
    return apiPatch<{ message: string }>(`/maintenance/${id}/reject`, {});
  },

  resolve(id: number) {
    return apiPatch<{ message: string }>(`/maintenance/${id}/resolve`, {});
  },
};
