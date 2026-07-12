export interface AuditCycle {
  id: number;
  title: string;
  status: string;
  scopeDepartmentId: number | null;
  scopeLocation: string | null;
  startDate: string;
  endDate: string;
  createdByEmployeeId: number;
  createdAt: string;
}

export interface AuditResult {
  id: number;
  auditCycleId: number;
  assetId: number;
  status: 'verified' | 'discrepancy' | 'missing';
  notes: string | null;
  auditedByEmployeeId: number;
  auditedAt: string;
}
