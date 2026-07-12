export interface Allocation {
  id: number;
  assetId: number;
  fromEmployeeId: number | null;
  toEmployeeId: number;
  allocatedByEmployeeId: number;
  status: string;
  notes: string | null;
  allocatedAt: string;
  returnedAt: string | null;
}

export interface Transfer {
  id: number;
  assetId: number;
  fromEmployeeId: number;
  toEmployeeId: number;
  reason: string | null;
  approvedByEmployeeId: number | null;
  status: string;
  createdAt: string;
}
