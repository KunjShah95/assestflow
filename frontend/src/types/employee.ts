export interface Employee {
  id: number;
  email: string;
  name: string;
  departmentId: number | null;
  role: string;
  status: string;
  createdAt?: string;
}
