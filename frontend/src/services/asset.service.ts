import { apiGet, apiPost, apiPatch } from '@/lib/api-client';
import type { Asset, AssetCategory, AssetFilter } from '@/types/asset';

function buildQuery(filters?: AssetFilter): string {
  if (!filters) return '';
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.status) params.set('status', filters.status);
  if (filters.search) params.set('search', filters.search);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const assetService = {
  list(filters?: AssetFilter) {
    return apiGet<Asset[]>(`/assets${buildQuery(filters)}`);
  },

  getById(id: number) {
    return apiGet<Asset>(`/assets/${id}`);
  },

  create(data: { name: string; categoryId: number; serialNumber?: string; location?: string; acquisitionDate?: string; acquisitionCost?: string; condition?: string; isBookable?: boolean }) {
    return apiPost<Asset>('/assets', data);
  },

  update(id: number, data: Partial<Asset>) {
    return apiPatch<Asset>(`/assets/${id}`, data);
  },

  categories() {
    return apiGet<AssetCategory[]>('/categories');
  },

  createCategory(data: { name: string; description?: string }) {
    return apiPost<AssetCategory>('/categories', data);
  },
};
