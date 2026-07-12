import { apiGet, apiPost, apiDelete } from '@/lib/api-client';
import type { ApiResponse } from '@/types/common';
import type { Booking } from '@/types/booking';

export const bookingService = {
  create(data: { assetId: number; startTime: string; endTime: string }) {
    return apiPost<Booking>('/bookings', data);
  },

  cancel(id: number) {
    return apiDelete(`/bookings/${id}`);
  },

  myBookings() {
    return apiGet<Booking[]>('/bookings/mine');
  },

  calendar(assetId: number, startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    const qs = params.toString();
    return apiGet<Booking[]>(`/bookings/asset/${assetId}/calendar${qs ? `?${qs}` : ''}`);
  },
};
