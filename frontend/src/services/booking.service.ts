import { apiGet, apiPost, apiPatch } from '@/lib/api-client';
import type { Booking } from '@/types/booking';

export const bookingService = {
  list() {
    return apiGet<Booking[]>('/bookings');
  },

  create(data: { assetId: number; startTime: string; endTime: string }) {
    return apiPost<Booking>('/bookings', data);
  },

  cancel(id: number) {
    return apiPatch<{ message: string }>(`/bookings/${id}/cancel`, {});
  },

  calendar(assetId: number, startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    const qs = params.toString();
    return apiGet<Booking[]>(`/bookings/calendar/${assetId}${qs ? `?${qs}` : ''}`);
  },
};
