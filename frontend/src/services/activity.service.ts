import { apiGet, apiPatch } from '@/lib/api-client';
import type { ApiResponse } from '@/types/common';
import type { ActivityLog, Notification } from '@/types/activity';

export const activityService = {
  logs() {
    return apiGet<ApiResponse<ActivityLog>>('/notifications/activity');
  },

  notifications() {
    return apiGet<ApiResponse<Notification>>('/notifications');
  },

  markRead(id: number) {
    return apiPatch<Notification>(`/notifications/${id}/read`, {});
  },
};
