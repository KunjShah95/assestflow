export interface MaintenanceRequest {
  id: number;
  assetId: number;
  requestedByEmployeeId: number;
  approvedByEmployeeId: number | null;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'in_progress' | 'resolved' | 'rejected';
  photoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
