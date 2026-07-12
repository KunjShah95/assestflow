export interface ActivityLog {
  id: number;
  employeeId: number;
  action: string;
  entityType: string;
  entityId: number;
  details: string | null;
  createdAt: string;
}

export interface Notification {
  id: number;
  employeeId: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}
