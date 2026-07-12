import { apiGet, apiPost, apiPatch } from '@/lib/api-client';
import type { ApiResponse } from '@/types/common';
import type { Asset, AssetCategory, AssetFilter } from '@/types/asset';

function buildQuery(filters?: AssetFilter): string {
  if (!filters) return '';
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.status) params.set('status', filters.status);
  if (filters.department) params.set('departmentId', filters.department);
  if (filters.search) params.set('search', filters.search);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const assetService = {
  list(filters?: AssetFilter) {
    return apiGet<ApiResponse<Asset>>(`/assets${buildQuery(filters)}`);
  },

  getById(id: number) {
    return apiGet<Asset>(`/assets/${id}`);
  },

  create(data: Partial<Asset>) {
    return apiPost<Asset>('/assets', data);
  },

  update(id: number, data: Partial<Asset>) {
    return apiPatch<Asset>(`/assets/${id}`, data);
  },

  categories() {
    return apiGet<ApiResponse<AssetCategory>>('/categories');
  },

  createCategory(data: { name: string; description?: string }) {
    return apiPost<AssetCategory>('/categories', data);
  },
};
