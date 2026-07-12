"use client";

import React, { useState, useMemo, useEffect } from "react";
import Modal from "@/components/Modal";
import { useToast } from "@/components/ToastProvider";
import { assetService } from "@/services/asset.service";

interface AssetItem {
  tag: string;
  name: string;
  icon: string;
  category: string;
  status: string;
  statusColor: string;
  location: string;
  faded: boolean;
}

const statusToColor: Record<string, string> = {
  available: "success",
  allocated: "info",
  under_maintenance: "warning",
  maintenance: "warning",
  retired: "danger",
  lost: "danger",
  disposed: "danger",
};

export default function AssetsPage() {
  const { showToast } = useToast();

  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const [newAsset, setNewAsset] = useState({
    name: "",
    category: "Electronics",
    location: "Bengaluru, BLR-01",
    tag: `AF-${Math.floor(1000 + Math.random() * 9000)}`,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [items, cats] = await Promise.all([
          assetService.list(),
          assetService.categories(),
        ]);

        const mapped: AssetItem[] = (items || []).map((a: any) => ({
          tag: a.assetTag || a.tag || "",
          name: a.name || "",
          icon: "inventory_2",
          category: cats?.find((c: any) => c.id === a.categoryId)?.name || "General",
          status: a.status || "available",
          statusColor: statusToColor[a.status] || "success",
          location: a.location || "",
          faded: ["retired", "lost", "disposed"].includes(a.status),
        }));

        setAssets(mapped);
        setCategories(["All", ...new Set((cats || []).map((c: any) => c.name))]);
      } catch (err) {
        console.error("Failed to load assets:", err);
        showToast("Could not load assets from server", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [showToast]);

  const statusClasses: Record<string, string> = {
    info: "bg-info/10 text-info ring-1 ring-inset ring-info/20",
    warning: "bg-warning/10 text-warning ring-1 ring-inset ring-warning/20",
    success: "bg-success/10 text-success ring-1 ring-inset ring-success/20",
    danger: "bg-danger/10 text-danger ring-1 ring-inset ring-danger/20",
  };

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

  const handleRegisterAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.name) {
      showToast("Please enter asset name", "error");
      return;
    }
    try {
      await assetService.create({
        name: newAsset.name,
        categoryId: categories.indexOf(newAsset.category) + 1 || 1,
        location: newAsset.location,
      });
      // Reload assets
      const items = await assetService.list();
      const mapped: AssetItem[] = (items || []).map((a: any) => ({
        tag: a.assetTag || a.tag || "",
        name: a.name || "",
        icon: "inventory_2",
        category: "General",
        status: a.status || "available",
        statusColor: statusToColor[a.status] || "success",
        location: a.location || "",
        faded: ["retired", "lost", "disposed"].includes(a.status),
      }));
      setAssets(mapped);
      showToast(`Asset ${newAsset.name} added successfully!`, "success");
      setIsRegisterOpen(false);
      setNewAsset({
        name: "", category: "Electronics", location: "Bengaluru, BLR-01",
        tag: `AF-${Math.floor(1000 + Math.random() * 9000)}`,
      });
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to register asset", "error");
    }
  };

  const handleRowAction = (assetItem: AssetItem, action: string) => {
    if (action === "retire") {
      setAssets(
        assets.map((a) =>
          a.tag === assetItem.tag
            ? { ...a, status: "Retired", statusColor: "danger", faded: true }
            : a
        )
      );
      showToast(`Marked ${assetItem.tag} as Retired`, "warning");
    } else {
      showToast(`Selected ${action} action for ${assetItem.tag}`, "info");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-text-secondary animate-pulse font-medium">Loading assets...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in" onClick={() => setActiveDropdown(null)}>
      {/* Header */}
      <header className="bg-surface-container-lowest border-b border-border-subtle px-container py-comfortable shrink-0 z-10 flex flex-col md:flex-row md:items-center justify-between gap-comfortable shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div>
          <h1 className="text-headline-lg text-text-primary tracking-tight">Asset Directory</h1>
          <p className="text-body-sm text-text-secondary mt-1">
            Manage and track all organizational equipment and resources.
          </p>
        </div>
        <div className="flex items-center gap-standard">
          <div className="relative w-full md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[20px]">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-surface border border-border-subtle rounded text-body-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-shadow placeholder:text-text-secondary/60 outline-none h-[36px]"
              placeholder="Search tag, name, location..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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

      {/* Filters */}
      <div className="bg-surface-container-lowest border-b border-border-subtle px-container py-standard shrink-0 flex gap-standard overflow-x-auto items-center">
        <span className="text-label-md text-text-secondary shrink-0 uppercase tracking-widest">Filters</span>
        <div className="h-4 w-px bg-border-subtle mx-1 shrink-0" />

        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setActiveDropdown(activeDropdown === "Category" ? null : "Category")}
            className={`px-3 py-1.5 border border-border-subtle rounded-full text-label-md text-text-primary hover:bg-surface-container-low flex items-center gap-1 shrink-0 transition-colors bg-surface-container-lowest ${
              selectedCategory !== "All" ? "border-primary bg-primary/10 text-primary font-bold" : ""
            }`}
          >
            Category: {selectedCategory}
            <span className="material-symbols-outlined text-[16px] text-text-secondary">arrow_drop_down</span>
          </button>
          {activeDropdown === "Category" && (
            <div className="absolute top-full left-0 mt-1.5 w-44 bg-surface-container-lowest border border-border-subtle rounded-lg shadow-lg z-30 py-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setActiveDropdown(null); }}
                  className="w-full text-left px-3 py-1.5 text-body-sm hover:bg-surface-container text-text-primary"
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setActiveDropdown(activeDropdown === "Status" ? null : "Status")}
            className={`px-3 py-1.5 border border-border-subtle rounded-full text-label-md text-text-primary hover:bg-surface-container-low flex items-center gap-1 shrink-0 transition-colors bg-surface-container-lowest ${
              selectedStatus !== "All" ? "border-primary bg-primary/10 text-primary font-bold" : ""
            }`}
          >
            Status: {selectedStatus}
            <span className="material-symbols-outlined text-[16px] text-text-secondary">arrow_drop_down</span>
          </button>
          {activeDropdown === "Status" && (
            <div className="absolute top-full left-0 mt-1.5 w-44 bg-surface-container-lowest border border-border-subtle rounded-lg shadow-lg z-30 py-1">
              {["All", "available", "allocated", "under_maintenance", "retired", "lost"].map((st) => (
                <button
                  key={st}
                  onClick={() => { setSelectedStatus(st); setActiveDropdown(null); }}
                  className="w-full text-left px-3 py-1.5 text-body-sm hover:bg-surface-container text-text-primary"
                >
                  {st === "under_maintenance" ? "Maintenance" : st.charAt(0).toUpperCase() + st.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ml-auto">
          <button
            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setSelectedStatus("All"); showToast("Filters reset", "info"); }}
            className="text-text-secondary hover:text-primary text-label-md flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">filter_list_off</span>
            Clear All
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 p-container overflow-hidden flex flex-col">
        <div className="bg-surface-container-lowest border border-border-subtle rounded-lg flex-1 flex flex-col overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-comfortable py-standard bg-surface-container-low border-b border-border-subtle text-label-md text-text-secondary uppercase tracking-wider shrink-0">
            <div className="col-span-2 flex items-center gap-2">Tag ID<span className="material-symbols-outlined text-[14px] cursor-pointer hover:text-primary">arrow_downward</span></div>
            <div className="col-span-3">Asset Name</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Location</div>
          </div>

          {/* Table Body */}
          <div className="flex-1 overflow-y-auto">
            {filteredAssets.length === 0 ? (
              <div className="p-8 text-center text-text-secondary">No assets found matching current search and filters.</div>
            ) : (
              filteredAssets.map((asset) => (
                <div
                  key={asset.tag}
                  onClick={() => showToast(`Selected asset: ${asset.name} (${asset.tag})`, "info")}
                  className={`grid grid-cols-12 gap-4 px-comfortable py-3 border-b border-border-subtle hover:bg-surface-container-low transition-colors items-center group cursor-pointer ${asset.faded ? "bg-surface-container-lowest/50" : ""}`}
                >
                  <div className={`col-span-2 text-mono-data ${asset.faded ? "text-text-primary/70" : "text-text-primary"}`}>{asset.tag}</div>
                  <div className={`col-span-3 text-body-sm font-medium flex items-center gap-2 ${asset.faded ? "text-text-primary/70" : "text-text-primary"}`}>
                    <span className={`material-symbols-outlined text-[18px] ${asset.faded ? "text-text-secondary/50" : "text-text-secondary"}`}>{asset.icon}</span>
                    {asset.name}
                  </div>
                  <div className={`col-span-2 text-body-sm ${asset.faded ? "text-text-secondary/70" : "text-text-secondary"}`}>{asset.category}</div>
                  <div className="col-span-2 flex items-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-label-md text-[10px] uppercase font-bold ${statusClasses[asset.statusColor]}`}>{asset.status}</span>
                  </div>
                  <div className={`col-span-3 text-body-sm flex items-center gap-1.5 justify-between ${asset.faded ? "text-text-secondary/70" : "text-text-secondary"}`}>
                    <span>{asset.location}</span>
                    <button onClick={(e) => { e.stopPropagation(); handleRowAction(asset, "retire"); }} className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-danger transition-all p-1 rounded hover:bg-surface-container" title="Retire Asset">
                      <span className="material-symbols-outlined text-[18px]">more_vert</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="border-t border-border-subtle bg-surface-container-lowest p-comfortable flex items-center justify-between shrink-0">
            <span className="text-body-sm text-text-secondary">Showing {filteredAssets.length} of {assets.length} assets</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="p-1 rounded text-text-secondary hover:bg-surface-container hover:text-primary disabled:opacity-50 transition-colors" disabled={currentPage === 1}>
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <span className="text-label-md text-text-primary px-2">Page {currentPage} of {Math.max(1, Math.ceil(filteredAssets.length / 10))}</span>
              <button onClick={() => setCurrentPage((p) => p + 1)} className="p-1 rounded text-text-secondary hover:bg-surface-container hover:text-primary disabled:opacity-50 transition-colors" disabled={currentPage >= Math.ceil(filteredAssets.length / 10) || filteredAssets.length === 0}>
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Register Asset Modal */}
      <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} title="Register New Enterprise Asset">
        <form onSubmit={handleRegisterAsset} className="space-y-4">
          <div>
            <label className="block text-label-md mb-1" htmlFor="asset-tag">Asset Tag ID</label>
            <input id="asset-tag" type="text" value={newAsset.tag} onChange={(e) => setNewAsset({ ...newAsset, tag: e.target.value })} className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md font-mono" />
          </div>
          <div>
            <label className="block text-label-md mb-1" htmlFor="asset-name">Equipment Name</label>
            <input id="asset-name" type="text" placeholder="e.g. MacBook Pro M3 16-inch" value={newAsset.name} onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })} className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md focus:border-primary outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-label-md mb-1" htmlFor="asset-category">Category</label>
              <select id="asset-category" value={newAsset.category} onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })} className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md focus:border-primary outline-none">
                {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-label-md mb-1" htmlFor="asset-location">Location</label>
              <select id="asset-location" value={newAsset.location} onChange={(e) => setNewAsset({ ...newAsset, location: e.target.value })} className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md focus:border-primary outline-none">
                <option value="Bengaluru, BLR-01">Bengaluru, BLR-01</option>
                <option value="Mumbai, Server Rm 1">Mumbai, Server Rm 1</option>
                <option value="HQ, Floor 2">HQ, Floor 2</option>
                <option value="Warehouse A">Warehouse A</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsRegisterOpen(false)} className="px-4 py-2 rounded text-label-md border border-border-subtle hover:bg-surface-container">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded text-label-md bg-primary text-on-primary hover:bg-primary/90">Register Asset</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
