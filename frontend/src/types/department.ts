export interface Department {
  id: number;
  name: string;
  description: string | null;
  parentDepartmentId: number | null;
  headEmployeeId: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}
