import { apiGet, apiPost } from '@/lib/api-client';
import type { ApiResponse } from '@/types/common';
import type { Department } from '@/types/department';

export const departmentService = {
  list() {
    return apiGet<ApiResponse<Department>>('/departments');
  },

  create(data: { name: string; description?: string }) {
    return apiPost<Department>('/departments', data);
  },
};
