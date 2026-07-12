import { apiGet, apiPost, apiPatch } from '@/lib/api-client';
import type { Department } from '@/types/department';

export const departmentService = {
  list() {
    return apiGet<Department[]>('/departments');
  },

  create(data: { name: string; description?: string }) {
    return apiPost<Department>('/departments', data);
  },

  update(id: number, data: { name?: string; description?: string; status?: string }) {
    return apiPatch<Department>(`/departments/${id}`, data);
  },
};
