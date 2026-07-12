export interface ApiResponse<T> {
  value: T[];
  Count: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'asset_manager' | 'department_head' | 'employee';
  departmentId: number | null;
  status: string;
  createdAt?: string;
}
