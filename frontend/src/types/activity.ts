export interface ActivityLog {
  id: number;
  employeeId: number;
  action: string;
  details: Record<string, unknown> | string | null;
  displayText?: string;
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
