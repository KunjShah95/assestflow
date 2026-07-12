import { apiGet, apiPatch } from '@/lib/api-client';
import type { ActivityLog, Notification } from '@/types/activity';

export const activityService = {
  logs() {
    return apiGet<ActivityLog[]>('/notifications/activity-log');
  },

  notifications() {
    return apiGet<Notification[]>('/notifications');
  },

  markRead(id: number) {
    return apiPatch<Notification>(`/notifications/${id}/read`, {});
  },
};
