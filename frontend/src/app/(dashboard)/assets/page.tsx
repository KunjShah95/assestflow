"use client";

import React, { useState, useMemo, useEffect } from "react";
import Modal from "@/components/Modal";
import { useApiError } from "@/hooks/useApiError";
import { assetService } from "@/services/asset.service";
import type { Asset, AssetCategory } from "@/types/asset";
import { Search, Plus, ChevronDown, FilterX, ArrowDown, Package, MoreHorizontal, ChevronLeft, ChevronRight, Download, FileText, Table, FileSpreadsheet } from "lucide-react";

interface AssetItem {
  id: number;
  tag: string;
  name: string;
  icon: string;
  category: string;
  categoryId: number | null;
  status: string;
  statusColor: string;
  location: string;
  faded: boolean;
}

const PAGE_SIZE = 10;

function mapAsset(a: Asset, categoryMap: Map<number, string>): AssetItem {
  const categoryId = a.categoryId != null ? Number(a.categoryId) : null;
  return {
    id: a.id,
    tag: a.assetTag || "",
    name: a.name || "",
    icon: "inventory_2",
    category: (categoryId != null ? categoryMap.get(categoryId) : null) || a.categoryName || "General",
    categoryId,
    status: a.status || "available",
    statusColor: statusToColor[a.status] || "success",
    location: a.location || "",
    faded: ["retired", "lost", "disposed"].includes(a.status),
  };
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
  const { showToast, handleError } = useApiError();

  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [categoryMap, setCategoryMap] = useState<Map<number, string>>(new Map());
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const [newAsset, setNewAsset] = useState(() => ({
    name: "",
    category: "",
    location: "",
  }));

  useEffect(() => {
    async function fetchData() {
      try {
        const [items, cats] = await Promise.all([
          assetService.list(),
          assetService.categories(),
        ]);

        const catMap = new Map<number, string>(
          (cats || []).map((c: AssetCategory) => [Number(c.id), c.name])
        );
        setCategoryMap(catMap);

        const mapped: AssetItem[] = (items || []).map((a: Asset) => mapAsset(a, catMap));

        setAssets(mapped);
        setCategories(["All", ...Array.from(new Set((cats || []).map((c: AssetCategory) => c.name)))]);
        const locs = Array.from(new Set((items || []).map((a: Asset) => a.location).filter(Boolean) as string[]));
        setLocations(locs);
        if (cats?.length && !newAsset.category) {
          setNewAsset((prev) => ({
            ...prev,
            category: cats[0].name,
            location: locs[0] || "",
          }));
        }
      } catch (err) {
        handleError(err, "Could not load assets from server");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [handleError]);

  useEffect(() => {
    const t = setTimeout(() => {
      setCurrentPage(1);
    }, 0);
    return () => clearTimeout(t);
  }, [searchQuery, selectedCategory, selectedStatus]);

  const statusClasses: Record<string, string> = {
    info: "bg-info/10 text-info ring-1 ring-inset ring-info/20",
    warning: "bg-warning/10 text-warning ring-1 ring-inset ring-warning/20",
    success: "bg-success/10 text-success ring-1 ring-inset ring-success/20",
    danger: "bg-danger/10 text-danger ring-1 ring-inset ring-danger/20",
  };

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        asset.name.toLowerCase().includes(q) ||
        asset.tag.toLowerCase().includes(q) ||
        asset.location.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === "All" || asset.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "All" || asset.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [assets, searchQuery, selectedCategory, selectedStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / PAGE_SIZE));
  const pagedAssets = filteredAssets.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleRegisterAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.name) {
      showToast("Please enter asset name", "error");
      return;
    }
    try {
      const categoryId =
        Array.from(categoryMap.entries()).find(([, name]) => name === newAsset.category)?.[0] ?? 1;
      await assetService.create({
        name: newAsset.name,
        categoryId,
        location: newAsset.location,
      });
      const [items, cats] = await Promise.all([
        assetService.list(),
        assetService.categories(),
      ]);
      const catMap = new Map<number, string>(
        (cats || []).map((c: AssetCategory) => [Number(c.id), c.name])
      );
      setCategoryMap(catMap);
      setAssets((items || []).map((a: Asset) => mapAsset(a, catMap)));
      showToast(`Asset ${newAsset.name} added successfully!`, "success");
      setIsRegisterOpen(false);
      setNewAsset({
        name: "",
        category: categories.find((c) => c !== "All") || "",
        location: locations[0] || "",
      });
    } catch (err) {
      handleError(err, "Failed to register asset");
    }
  };

  const handleRowAction = (assetItem: AssetItem, action: string) => {
    if (action === "retire") {
      setAssets(
        assets.map((a) =>
          a.id === assetItem.id
            ? { ...a, status: "Retired", statusColor: "danger", faded: true }
            : a
        )
      );
      showToast(`Marked ${assetItem.tag} as Retired`, "warning");
    } else {
      showToast(`Selected ${action} action for ${assetItem.tag}`, "info");
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const el = document.createElement("a");
    el.href = URL.createObjectURL(blob);
    el.download = filename;
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  };

  const exportToCSV = () => {
    try {
      const header = "Tag ID,Name,Category,Status,Location";
      const rows = filteredAssets.map((a) =>
        [a.tag, a.name, a.category, a.status, a.location]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      );
      const csv = "\uFEFF" + [header, ...rows].join("\r\n");
      downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8;" }), `assetflow-assets-${new Date().toISOString().slice(0, 10)}.csv`);
      showToast(`Exported ${filteredAssets.length} assets as CSV`, "success");
    } catch {
      showToast("CSV export failed", "error");
    }
  };

  const exportToExcel = () => {
    try {
      const header = "Tag ID,Name,Category,Status,Location";
      const rows = filteredAssets.map((a) =>
        [a.tag, a.name, a.category, a.status, a.location]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      );
      const xls = "\uFEFF" + [header, ...rows].join("\r\n");
      downloadBlob(new Blob([xls], { type: "application/vnd.ms-excel;charset=utf-8" }), `assetflow-assets-${new Date().toISOString().slice(0, 10)}.xls`);
      showToast(`Exported ${filteredAssets.length} assets as Excel`, "success");
    } catch {
      showToast("Excel export failed", "error");
    }
  };

  const exportToPDF = () => {
    try {
      const printWin = window.open("", "_blank");
      if (!printWin) { showToast("Pop-up blocked. Allow pop-ups for PDF export.", "error"); return; }
      const rows = filteredAssets.map((a) =>
        `<tr><td>${a.tag}</td><td>${a.name}</td><td>${a.category}</td><td>${a.status}</td><td>${a.location}</td></tr>`
      ).join("");
      printWin.document.write(`
        <html><head><title>Asset Directory</title>
        <style>body{font-family:system-ui,sans-serif;padding:2rem}
        h1{font-size:1.5rem;margin-bottom:.5rem}
        p{color:#666;margin-bottom:1.5rem}
        table{width:100%;border-collapse:collapse}
        th{background:#005c55;color:#fff;text-align:left;padding:8px 12px;font-size:.85rem}
        td{padding:8px 12px;border-bottom:1px solid #eee;font-size:.85rem}
        tr:nth-child(even){background:#f9f9f9}
        @media print{body{padding:0}} </style></head><body>
        <h1>Asset Directory</h1>
        <p>Generated: ${new Date().toLocaleDateString()} | ${filteredAssets.length} assets</p>
        <table><thead><tr><th>Tag ID</th><th>Name</th><th>Category</th><th>Status</th><th>Location</th></tr></thead>
        <tbody>${rows}</tbody></table></body></html>`);
      printWin.document.close();
      printWin.focus();
      printWin.print();
      showToast(`Exported ${filteredAssets.length} assets as PDF`, "success");
    } catch {
      showToast("PDF export failed", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] flex-1">
        <div className="text-text-secondary animate-pulse font-medium">Loading assets...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 animate-fade-in" onClick={() => setActiveDropdown(null)}>
      <header className="bg-surface-container-lowest border-b border-border-subtle px-container py-comfortable shrink-0 z-10 flex flex-col md:flex-row md:items-center justify-between gap-comfortable shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div>
          <h1 className="text-headline-lg text-text-primary tracking-tight">Asset Directory</h1>
          <p className="text-body-sm text-text-secondary mt-1">
            Manage and track all organizational equipment and resources.
          </p>
        </div>
        <div className="flex items-center gap-standard">
          <div className="relative w-full md:w-64">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              className="w-full pl-10 pr-4 py-2 bg-surface border border-border-subtle rounded text-body-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-shadow placeholder:text-text-secondary/60 outline-none h-[36px]"
              placeholder="Search tag, name, location..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => exportToCSV()} title="Export CSV" className="p-2 rounded text-text-secondary hover:text-primary hover:bg-surface-container transition-colors">
              <FileText size={18} />
            </button>
            <button onClick={() => exportToExcel()} title="Export Excel" className="p-2 rounded text-text-secondary hover:text-primary hover:bg-surface-container transition-colors">
              <Table size={18} />
            </button>
            <button onClick={() => exportToPDF()} title="Export PDF" className="p-2 rounded text-text-secondary hover:text-primary hover:bg-surface-container transition-colors">
              <FileSpreadsheet size={18} />
            </button>
          </div>
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="bg-primary text-on-primary hover:bg-primary/90 text-label-md px-comfortable py-2 rounded shadow-sm flex items-center gap-2 h-[36px] transition-colors whitespace-nowrap"
          >
            <Plus size={18} />
            Register Asset
          </button>
        </div>
      </header>

      <div className="bg-surface-container-lowest border-b border-border-subtle px-container py-standard shrink-0 flex gap-standard overflow-x-auto items-center relative z-40">
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
            <ChevronDown size={16} className="text-text-secondary" />
          </button>
          {activeDropdown === "Category" && (
            <div className="absolute top-full left-0 mt-1.5 w-44 bg-surface-container-lowest border border-border-subtle rounded-lg shadow-lg z-50 py-1 max-h-60 overflow-y-auto">
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
            <ChevronDown size={16} className="text-text-secondary" />
          </button>
          {activeDropdown === "Status" && (
            <div className="absolute top-full left-0 mt-1.5 w-44 bg-surface-container-lowest border border-border-subtle rounded-lg shadow-lg z-50 py-1 max-h-60 overflow-y-auto">
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
            <FilterX size={16} />
            Clear All
          </button>
        </div>
      </div>

      <div className="flex-1 p-container overflow-visible flex flex-col min-h-0">
        <div className="bg-surface-container-lowest border border-border-subtle rounded-lg flex-1 flex flex-col overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 gap-4 px-comfortable py-standard bg-surface-container-low border-b border-border-subtle text-label-md text-text-secondary uppercase tracking-wider shrink-0">
            <div className="col-span-2 flex items-center gap-2">Tag ID<ArrowDown size={14} className="cursor-pointer hover:text-primary" /></div>
            <div className="col-span-3">Asset Name</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Location</div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredAssets.length === 0 ? (
              <div className="p-8 text-center text-text-secondary">No assets found matching current search and filters.</div>
            ) : (
              pagedAssets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => showToast(`Selected asset: ${asset.name} (${asset.tag})`, "info")}
                  className={`grid grid-cols-12 gap-4 px-comfortable py-3 border-b border-border-subtle hover:bg-surface-container-low transition-colors items-center group cursor-pointer ${asset.faded ? "bg-surface-container-lowest/50" : ""}`}
                >
                  <div className={`col-span-2 text-mono-data ${asset.faded ? "text-text-primary/70" : "text-text-primary"}`}>{asset.tag}</div>
                  <div className={`col-span-3 text-body-sm font-medium flex items-center gap-2 ${asset.faded ? "text-text-primary/70" : "text-text-primary"}`}>
                    <Package size={18} className={asset.faded ? "text-text-secondary/50" : "text-text-secondary"} />
                    {asset.name}
                  </div>
                  <div className={`col-span-2 text-body-sm ${asset.faded ? "text-text-secondary/70" : "text-text-secondary"}`}>{asset.category}</div>
                  <div className="col-span-2 flex items-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-label-md text-[10px] uppercase font-bold ${statusClasses[asset.statusColor]}`}>{asset.status}</span>
                  </div>
                  <div className={`col-span-3 text-body-sm flex items-center gap-1.5 justify-between ${asset.faded ? "text-text-secondary/70" : "text-text-secondary"}`}>
                    <span>{asset.location}</span>
                    <button onClick={(e) => { e.stopPropagation(); handleRowAction(asset, "retire"); }} className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-danger transition-all p-1 rounded hover:bg-surface-container" title="Retire Asset">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-border-subtle bg-surface-container-lowest p-comfortable flex items-center justify-between shrink-0">
            <span className="text-body-sm text-text-secondary">Showing {filteredAssets.length} of {assets.length} assets</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="p-1 rounded text-text-secondary hover:bg-surface-container hover:text-primary disabled:opacity-50 transition-colors" disabled={currentPage === 1}>
                <ChevronLeft size={20} />
              </button>
              <span className="text-label-md text-text-primary px-2">Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage((p) => p + 1)} className="p-1 rounded text-text-secondary hover:bg-surface-container hover:text-primary disabled:opacity-50 transition-colors" disabled={currentPage >= totalPages || filteredAssets.length === 0}>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} title="Register New Enterprise Asset">
        <form onSubmit={handleRegisterAsset} className="space-y-4">
          <div>
            <label className="block text-label-md mb-1" htmlFor="asset-name">Equipment Name</label>
            <input id="asset-name" type="text" placeholder="e.g. MacBook Pro M3 16-inch" value={newAsset.name} onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })} className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md focus:border-primary outline-none" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-label-md mb-1" htmlFor="asset-category">Category</label>
              <select id="asset-category" value={newAsset.category} onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })} className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md focus:border-primary outline-none">
                {categories.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-label-md mb-1" htmlFor="asset-location">Location</label>
              <select id="asset-location" value={newAsset.location} onChange={(e) => setNewAsset({ ...newAsset, location: e.target.value })} className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md focus:border-primary outline-none">
                {locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
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
