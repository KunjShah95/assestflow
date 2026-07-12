import { apiGet, apiPatch } from '@/lib/api-client';
import type { Employee } from '@/types/employee';

export const employeeService = {
  list() {
    return apiGet<Employee[]>('/employees');
  },

  promote(id: number, role: string) {
    return apiPatch<Employee>(`/employees/${id}/role`, { role });
  },

  deactivate(id: number) {
    return apiPatch<Employee>(`/employees/${id}/deactivate`, {});
  },
};
