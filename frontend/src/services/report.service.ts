import { apiGet } from '@/lib/api-client';

export const reportService = {
  kpi() {
    return apiGet<Record<string, unknown>>('/reports/kpi');
  },

  idleAssets() {
    return apiGet<{ value: { name: string; tag: string; idleDays: number }[]; Count: number }>('/reports/idle-assets');
  },

  utilization() {
    return apiGet<Record<string, unknown>[]>('/reports/utilization');
  },

  bookingHeatmap() {
    return apiGet<Record<string, unknown>[]>('/reports/booking-heatmap');
  },
};
