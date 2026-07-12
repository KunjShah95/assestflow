import { apiGet } from '@/lib/api-client';

interface KpiData {
  availableAssets: number;
  allocatedAssets: number;
  activeBookings: number;
  maintenanceToday: number;
  pendingTransfers: number;
  overdueReturns: number;
}

interface UtilizationItem {
  departmentId: number | null;
  count: number;
}

export const reportService = {
  kpi() {
    return apiGet<KpiData>('/reports/kpi');
  },

  idleAssets() {
    return apiGet<{ id: number; name: string; assetTag: string; status: string; updatedAt: string }[]>('/reports/idle-assets');
  },

  utilization() {
    return apiGet<UtilizationItem[]>('/reports/utilization');
  },

  bookingHeatmap() {
    return apiGet<Record<string, unknown>[]>('/reports/booking-heatmap');
  },

  maintenanceFrequency() {
    return apiGet<{ categoryId: number; categoryName: string; count: number }[]>('/reports/maintenance-frequency');
  },
};
