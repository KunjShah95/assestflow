'use client';

import { useState, useEffect } from 'react';
import { assetService } from '@/services/asset.service';
import type { Asset, AssetFilter } from '@/types/asset';

const statusStyles: Record<string, string> = {
  available: 'bg-success/10 text-success ring-1 ring-inset ring-success/20',
  allocated: 'bg-info/10 text-info ring-1 ring-inset ring-info/20',
  maintenance: 'bg-warning/10 text-warning ring-1 ring-inset ring-warning/20',
  retired: 'bg-danger/10 text-danger ring-1 ring-inset ring-danger/20',
};

const categoryIcons: Record<string, string> = {
  Electronics: 'laptop_mac',
  Furniture: 'chair',
  Networking: 'router',
  default: 'inventory_2',
};

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const filter: AssetFilter = {};
    if (search) filter.search = search;
    assetService.list(filter).then(res => {
      setAssets(res.value || []);
      setTotal(res.Count);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [search]);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || asset.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "All" || asset.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [assets, searchQuery, selectedCategory, selectedStatus]);

  const handleRegisterAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.name) {
      showToast("Please enter asset name", "error");
      return;
    }

    const created: Asset = {
      tag: newAsset.tag,
      name: newAsset.name,
      icon: newAsset.category === "Electronics" ? "laptop_mac" : newAsset.category === "Furniture" ? "chair" : "router",
      category: newAsset.category,
      status: "Available",
      statusColor: "success",
      location: newAsset.location,
      faded: false,
    };

    setAssets([created, ...assets]);
    showToast(`Asset ${created.name} (${created.tag}) added successfully!`, "success");
    setIsRegisterOpen(false);
    setNewAsset({
      name: "",
      category: "Electronics",
      location: "Bengaluru, BLR-01",
      tag: `AF-${Math.floor(1000 + Math.random() * 9000)}`,
    });
  };

  const handleRowAction = (asset: Asset, action: string) => {
    if (action === "retire") {
      setAssets(
        assets.map((a) =>
          a.tag === asset.tag
            ? { ...a, status: "Retired", statusColor: "danger", faded: true }
            : a
        )
      );
      showToast(`Marked ${asset.tag} as Retired`, "warning");
    } else {
      showToast(`Selected ${action} action for ${asset.tag} (${asset.name})`, "info");
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in">
      <header className="bg-surface-container-lowest border-b border-border-subtle px-container py-comfortable shrink-0 z-10 flex flex-col md:flex-row md:items-center justify-between gap-comfortable shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div>
          <h1 className="text-headline-lg text-text-primary tracking-tight">Asset Directory</h1>
          <p className="text-body-sm text-text-secondary mt-1">Manage and track all organizational equipment and resources.</p>
        </div>
        <div className="flex items-center gap-standard">
          <div className="relative w-full md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[20px]">search</span>
            <input className="w-full pl-10 pr-4 py-2 bg-surface border border-border-subtle rounded text-body-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-shadow placeholder:text-text-secondary/60 outline-none h-[36px]" placeholder="Search tag, name..." type="text" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="bg-primary text-on-primary hover:bg-primary/90 text-label-md px-comfortable py-2 rounded shadow-sm flex items-center gap-2 h-[36px] transition-colors whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Register Asset
          </button>
        </div>
      </header>

      <div className="bg-surface-container-lowest border-b border-border-subtle px-container py-standard shrink-0 flex gap-standard overflow-x-auto items-center">
        <span className="text-label-md text-text-secondary shrink-0 uppercase tracking-widest">
          Filters
        </span>
        <div className="h-4 w-px bg-border-subtle mx-1 shrink-0" />
        {['Category', 'Status', 'Department'].map(f => (
          <button key={f} className="px-3 py-1.5 border border-border-subtle rounded-full text-label-md text-text-primary hover:bg-surface-container-low flex items-center gap-1 shrink-0 transition-colors bg-surface-container-lowest">
            {f}
            <span className="material-symbols-outlined text-[16px] text-text-secondary">arrow_drop_down</span>
          </button>
        ))}
      </div>

      <div className="flex-1 p-container overflow-hidden flex flex-col">
        <div className="bg-surface-container-lowest border border-border-subtle rounded-lg flex-1 flex flex-col overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 gap-4 px-comfortable py-standard bg-surface-container-low border-b border-border-subtle text-label-md text-text-secondary uppercase tracking-wider shrink-0">
            <div className="col-span-2 flex items-center gap-2">Tag ID <span className="material-symbols-outlined text-[14px] cursor-pointer hover:text-primary">arrow_downward</span></div>
            <div className="col-span-3">Asset Name</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Location</div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-text-secondary">Loading...</div>
            ) : assets.length === 0 ? (
              <div className="p-8 text-center text-text-secondary">No assets found. Seed the database first.</div>
            ) : assets.map(asset => (
              <div key={asset.id} className="grid grid-cols-12 gap-4 px-comfortable py-3 border-b border-border-subtle hover:bg-surface-container-low transition-colors items-center group cursor-pointer">
                <div className="col-span-2 text-mono-data text-text-primary">{asset.tag}</div>
                <div className="col-span-3 text-body-sm font-medium flex items-center gap-2 text-text-primary">
                  <span className="material-symbols-outlined text-[18px] text-text-secondary">{categoryIcons[asset.categoryName || ''] || categoryIcons.default}</span>
                  {asset.name}
                </div>
                <div className="col-span-2 text-body-sm text-text-secondary">{asset.categoryName || '-'}</div>
                <div className="col-span-2 flex items-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-label-md text-[10px] uppercase font-bold ${statusStyles[asset.status] || ''}`}>{asset.status}</span>
                </div>
                <div className="col-span-3 text-body-sm flex items-center gap-1.5 justify-between text-text-secondary">
                  <span>{asset.location || '-'}</span>
                  <button className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-primary transition-all p-1 rounded hover:bg-surface-container">
                    <span className="material-symbols-outlined text-[18px]">more_vert</span>
                  </button>
                </div>
              </div>
            ) : (
              filteredAssets.map((asset) => (
                <div
                  key={asset.tag}
                  onClick={() => showToast(`Selected asset: ${asset.name} (${asset.tag})`, "info")}
                  className={`grid grid-cols-12 gap-4 px-comfortable py-3 border-b border-border-subtle hover:bg-surface-container-low transition-colors items-center group cursor-pointer ${
                    asset.faded ? "bg-surface-container-lowest/50" : ""
                  }`}
                >
                  <div
                    className={`col-span-2 text-mono-data ${
                      asset.faded ? "text-text-primary/70" : "text-text-primary"
                    }`}
                  >
                    {asset.tag}
                  </div>
                  <div
                    className={`col-span-3 text-body-sm font-medium flex items-center gap-2 ${
                      asset.faded ? "text-text-primary/70" : "text-text-primary"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[18px] ${
                        asset.faded ? "text-text-secondary/50" : "text-text-secondary"
                      }`}
                    >
                      {asset.icon}
                    </span>
                    {asset.name}
                  </div>
                  <div
                    className={`col-span-2 text-body-sm ${
                      asset.faded ? "text-text-secondary/70" : "text-text-secondary"
                    }`}
                  >
                    {asset.category}
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-label-md text-[10px] uppercase font-bold ${
                        statusClasses[asset.statusColor]
                      }`}
                    >
                      {asset.status}
                    </span>
                  </div>
                  <div
                    className={`col-span-3 text-body-sm flex items-center gap-1.5 justify-between ${
                      asset.faded ? "text-text-secondary/70" : "text-text-secondary"
                    }`}
                  >
                    <span>{asset.location}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowAction(asset, "retire");
                      }}
                      className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-danger transition-all p-1 rounded hover:bg-surface-container"
                      title="Retire Asset"
                    >
                      <span className="material-symbols-outlined text-[18px]">more_vert</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-border-subtle bg-surface-container-lowest p-comfortable flex items-center justify-between shrink-0">
            <span className="text-body-sm text-text-secondary">Showing all {total} assets</span>
          </div>
        </div>
      </div>

      {/* Register Asset Modal */}
      <Modal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        title="Register New Enterprise Asset"
      >
        <form onSubmit={handleRegisterAsset} className="space-y-4">
          <div>
            <label className="block text-label-md mb-1" htmlFor="asset-tag">
              Asset Tag ID
            </label>
            <input
              id="asset-tag"
              type="text"
              value={newAsset.tag}
              onChange={(e) => setNewAsset({ ...newAsset, tag: e.target.value })}
              className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md font-mono"
            />
          </div>
          <div>
            <label className="block text-label-md mb-1" htmlFor="asset-name">
              Equipment Name
            </label>
            <input
              id="asset-name"
              type="text"
              placeholder="e.g. MacBook Pro M3 16-inch"
              value={newAsset.name}
              onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
              className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md focus:border-primary outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-label-md mb-1" htmlFor="asset-category">
                Category
              </label>
              <select
                id="asset-category"
                value={newAsset.category}
                onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
                className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md focus:border-primary outline-none"
              >
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Networking">Networking</option>
              </select>
            </div>
            <div>
              <label className="block text-label-md mb-1" htmlFor="asset-location">
                Location
              </label>
              <select
                id="asset-location"
                value={newAsset.location}
                onChange={(e) => setNewAsset({ ...newAsset, location: e.target.value })}
                className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md focus:border-primary outline-none"
              >
                <option value="Bengaluru, BLR-01">Bengaluru, BLR-01</option>
                <option value="Mumbai, Server Rm 1">Mumbai, Server Rm 1</option>
                <option value="HQ, Floor 2">HQ, Floor 2</option>
                <option value="Warehouse A">Warehouse A</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsRegisterOpen(false)}
              className="px-4 py-2 rounded text-label-md border border-border-subtle hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded text-label-md bg-primary text-on-primary hover:bg-primary/90"
            >
              Register Asset
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
