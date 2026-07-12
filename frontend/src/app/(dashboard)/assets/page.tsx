'use client';

import { useState, useEffect } from 'react';
import { assetService } from '@/services/asset.service';
import type { Asset } from '@/types/asset';

const statusStyles: Record<string, string> = {
  available: 'bg-success/10 text-success border-success/20',
  allocated: 'bg-info/10 text-info border-info/20',
  maintenance: 'bg-warning/10 text-warning border-warning/20',
  retired: 'bg-danger/10 text-danger border-danger/20',
};

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // New Asset form states
  const [newTag, setNewTag] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Electronics');
  const [newStatus, setNewStatus] = useState<'available' | 'allocated' | 'maintenance'>('available');
  const [newLocation, setNewLocation] = useState('');

  // Setup initial wireframe mock assets conforming to Asset interface
  const wireframeAssets: Asset[] = [
    {
      id: 101,
      tag: 'AF-0012',
      name: 'Dell Laptop',
      categoryName: 'Electronics',
      status: 'allocated',
      location: 'bangalore',
      purchaseDate: '2025-01-01',
      purchaseCost: '1200.00',
      description: null,
      categoryId: null,
      qrCode: null,
      imageUrl: null,
      currentHolderId: null,
      departmentId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Asset,
    {
      id: 102,
      tag: 'AF-0062',
      name: 'Projector',
      categoryName: 'Electronics',
      status: 'maintenance',
      location: 'HR Floor 2',
      purchaseDate: '2024-05-12',
      purchaseCost: '800.00',
      description: null,
      categoryId: null,
      qrCode: null,
      imageUrl: null,
      currentHolderId: null,
      departmentId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Asset,
    {
      id: 103,
      tag: 'AF-0201',
      name: 'Office Chair',
      categoryName: 'Furniture',
      status: 'available',
      location: 'warehouse',
      purchaseDate: '2025-03-20',
      purchaseCost: '250.00',
      description: null,
      categoryId: null,
      qrCode: null,
      imageUrl: null,
      currentHolderId: null,
      departmentId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Asset,
  ];

  useEffect(() => {
    setLoading(true);
    assetService.list()
      .then(res => {
        // Merge fetched assets that aren't already represented in the wireframe list
        const fetched = res.value || [];
        const merged = [...wireframeAssets];
        fetched.forEach((a: Asset) => {
          if (!merged.some(wa => wa.tag === a.tag || wa.name === a.name)) {
            merged.push({
              ...a,
              status: a.status,
              categoryName: a.categoryName || 'Electronics'
            });
          }
        });
        setAssets(merged);
      })
      .catch(() => {
        setAssets(wireframeAssets);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag || !newName) return;

    const registered: Asset = {
      id: Date.now(),
      tag: newTag,
      name: newName,
      categoryName: newCategory,
      status: newStatus,
      location: newLocation || 'warehouse',
      purchaseDate: new Date().toISOString().split('T')[0],
      purchaseCost: '1000.00',
      description: null,
      categoryId: null,
      qrCode: null,
      imageUrl: null,
      currentHolderId: null,
      departmentId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAssets([registered, ...assets]);
    setIsRegisterOpen(false);
    setNewTag('');
    setNewName('');
    setNewLocation('');
  };

  // Search and filter logic
  const filteredAssets = assets.filter(asset => {
    const matchesSearch =
      asset.tag.toLowerCase().includes(search.toLowerCase()) ||
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      (asset.location && asset.location.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = categoryFilter ? asset.categoryName === categoryFilter : true;
    const matchesStatus = statusFilter ? asset.status === statusFilter : true;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in max-w-[1200px] mx-auto p-8 pb-24">
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-headline-lg font-bold text-text-primary">Asset Registrations and Directory</h1>
          <p className="text-body-sm text-text-secondary mt-1">Manage and track all organizational equipment and resources.</p>
        </div>
      </header>

      {/* Search and Register Row matching Screen 4 wireframe */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[20px]">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-border-subtle rounded-xl text-body-md text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow placeholder:text-text-muted/70"
            placeholder="Search by tag, serial, or QR code..."
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsRegisterOpen(true)}
          className="bg-primary hover:bg-surface-tint text-on-primary text-label-md px-6 py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg flex items-center gap-2 transition-all cursor-pointer w-full md:w-auto justify-center"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Register Asset
        </button>
      </div>

      {/* Filters selector row */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        <div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-border-subtle rounded-full text-label-md font-bold text-text-primary bg-surface-container-lowest hover:bg-surface-container-low transition-colors outline-none cursor-pointer"
          >
            <option value="">Category (All)</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Vehicles">Vehicles</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-border-subtle rounded-full text-label-md font-bold text-text-primary bg-surface-container-lowest hover:bg-surface-container-low transition-colors outline-none cursor-pointer"
          >
            <option value="">Status (All)</option>
            <option value="available">Available</option>
            <option value="allocated">Allocated</option>
            <option value="maintenance">Maintenance</option>
            <option value="retired">Retired</option>
          </select>
        </div>

        <div>
          <select
            className="px-4 py-2 border border-border-subtle rounded-full text-label-md font-bold text-text-primary bg-surface-container-lowest hover:bg-surface-container-low transition-colors outline-none cursor-pointer"
          >
            <option value="">Department (All)</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl overflow-hidden flex-1 flex flex-col shadow-sm">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-container-low text-label-md text-text-secondary uppercase tracking-wider font-semibold">
                <th className="py-4 px-6">Tag</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-body-md text-text-primary bg-surface-container-lowest">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-text-secondary">
                    Loading asset catalog...
                  </td>
                </tr>
              ) : filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-text-secondary">
                    No assets found.
                  </td>
                </tr>
              ) : (
                filteredAssets.map(asset => (
                  <tr key={asset.id} className="hover:bg-surface-container-low transition-colors items-center">
                    <td className="py-4 px-6 font-bold font-mono text-text-secondary">{asset.tag}</td>
                    <td className="py-4 px-6 font-bold">{asset.name}</td>
                    <td className="py-4 px-6 text-text-secondary">{asset.categoryName || 'Electronics'}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                          statusStyles[asset.status] || 'bg-surface-variant text-text-secondary border-border-subtle'
                        }`}
                      >
                        {asset.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-text-secondary">{asset.location || '–'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Registration Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 bg-text-primary/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl w-full max-w-md p-8 shadow-2xl animate-fade-in">
            <h3 className="text-headline-md font-bold text-text-primary mb-6">Register New Asset</h3>
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-label-md font-bold text-text-secondary mb-1" htmlFor="asset-tag">
                  Tag ID
                </label>
                <input
                  id="asset-tag"
                  type="text"
                  placeholder="e.g. AF-0112"
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  className="w-full bg-surface border border-border-subtle rounded-lg px-3 py-2 text-body-md focus:border-primary outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-label-md font-bold text-text-secondary mb-1" htmlFor="asset-name">
                  Asset Name
                </label>
                <input
                  id="asset-name"
                  type="text"
                  placeholder="e.g. Dell Latitude 14"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-surface border border-border-subtle rounded-lg px-3 py-2 text-body-md focus:border-primary outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-label-md font-bold text-text-secondary mb-1" htmlFor="asset-cat">
                    Category
                  </label>
                  <select
                    id="asset-cat"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full bg-surface border border-border-subtle rounded-lg px-3 py-2 text-body-md focus:border-primary outline-none cursor-pointer"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Vehicles">Vehicles</option>
                  </select>
                </div>
                <div>
                  <label className="block text-label-md font-bold text-text-secondary mb-1" htmlFor="asset-status">
                    Initial Status
                  </label>
                  <select
                    id="asset-status"
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as any)}
                    className="w-full bg-surface border border-border-subtle rounded-lg px-3 py-2 text-body-md focus:border-primary outline-none cursor-pointer"
                  >
                    <option value="available">Available</option>
                    <option value="allocated">Allocated</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-label-md font-bold text-text-secondary mb-1" htmlFor="asset-loc">
                  Location
                </label>
                <input
                  id="asset-loc"
                  type="text"
                  placeholder="e.g. bangalore, warehouse"
                  value={newLocation}
                  onChange={e => setNewLocation(e.target.value)}
                  className="w-full bg-surface border border-border-subtle rounded-lg px-3 py-2 text-body-md focus:border-primary outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle mt-6">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-label-md border border-border-subtle hover:bg-surface-container font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg text-label-md bg-primary text-on-primary hover:bg-surface-tint font-bold shadow-md cursor-pointer"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
