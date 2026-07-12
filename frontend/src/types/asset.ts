export interface AssetCategory {
  id: number;
  name: string;
  description: string | null;
  status: string;
}

export interface Asset {
  id: number;
  tag: string;
  name: string;
  description: string | null;
  categoryId: number | null;
  categoryName?: string;
  isBookable?: boolean;
  status: 'available' | 'allocated' | 'maintenance' | 'retired';
  location: string | null;
  purchaseDate: string | null;
  purchaseCost: string | null;
  qrCode: string | null;
  imageUrl: string | null;
  currentHolderId: number | null;
  departmentId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface AssetFilter {
  category?: string;
  status?: string;
  department?: string;
  search?: string;
}
