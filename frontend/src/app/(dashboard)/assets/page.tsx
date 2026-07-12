export default function AssetsPage() {
  const assets = [
    { tag: "AF-0012", name: "Dell Laptop", icon: "laptop_mac", category: "Electronics", status: "Allocated", statusColor: "info", location: "Bengaluru, BLR-01", faded: false },
    { tag: "AF-0062", name: "Projector 4K", icon: "videocam", category: "Electronics", status: "Maintenance", statusColor: "warning", location: "HQ, Floor 2", faded: false },
    { tag: "AF-0201", name: "Office Chair Ergo", icon: "chair", category: "Furniture", status: "Available", statusColor: "success", location: "Warehouse A", faded: false },
    { tag: "AF-0202", name: "Cisco Router X1", icon: "router", category: "Networking", status: "Allocated", statusColor: "info", location: "Mumbai, Server Rm 1", faded: false },
    { tag: "AF-0099", name: "LaserJet Pro M404", icon: "print", category: "Electronics", status: "Retired", statusColor: "danger", location: "Disposal Unit", faded: true },
  ];

  const statusClasses: Record<string, string> = {
    info: "bg-info/10 text-info ring-1 ring-inset ring-info/20",
    warning: "bg-warning/10 text-warning ring-1 ring-inset ring-warning/20",
    success: "bg-success/10 text-success ring-1 ring-inset ring-success/20",
    danger: "bg-danger/10 text-danger ring-1 ring-inset ring-danger/20",
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in">
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
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[20px]">search</span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-surface border border-border-subtle rounded text-body-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-shadow placeholder:text-text-secondary/60 outline-none h-[36px]"
              placeholder="Search tag, name..."
              type="text"
            />
          </div>
          <button className="bg-primary text-on-primary hover:bg-surface-tint text-label-md px-comfortable py-2 rounded shadow-sm flex items-center gap-2 h-[36px] transition-colors whitespace-nowrap">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Register Asset
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-surface-container-lowest border-b border-border-subtle px-container py-standard shrink-0 flex gap-standard overflow-x-auto items-center">
        <span className="text-label-md text-text-secondary shrink-0 uppercase tracking-widest">Filters</span>
        <div className="h-4 w-px bg-border-subtle mx-1 shrink-0" />
        {["Category", "Status", "Department"].map((filter) => (
          <button key={filter} className="px-3 py-1.5 border border-border-subtle rounded-full text-label-md text-text-primary hover:bg-surface-container-low flex items-center gap-1 shrink-0 transition-colors bg-surface-container-lowest">
            {filter}
            <span className="material-symbols-outlined text-[16px] text-text-secondary">arrow_drop_down</span>
          </button>
        ))}
        <div className="ml-auto">
          <button className="text-text-secondary hover:text-primary text-label-md flex items-center gap-1 transition-colors">
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
            <div className="col-span-2 flex items-center gap-2">
              Tag ID
              <span className="material-symbols-outlined text-[14px] cursor-pointer hover:text-primary">arrow_downward</span>
            </div>
            <div className="col-span-3">Asset Name</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Location</div>
          </div>

          {/* Table Body */}
          <div className="flex-1 overflow-y-auto">
            {assets.map((asset) => (
              <div
                key={asset.tag}
                className={`grid grid-cols-12 gap-4 px-comfortable py-3 border-b border-border-subtle hover:bg-surface-container-low transition-colors items-center group cursor-pointer ${
                  asset.faded ? "bg-surface-container-lowest/50" : ""
                }`}
              >
                <div className={`col-span-2 text-mono-data ${asset.faded ? "text-text-primary/70" : "text-text-primary"}`}>{asset.tag}</div>
                <div className={`col-span-3 text-body-sm font-medium flex items-center gap-2 ${asset.faded ? "text-text-primary/70" : "text-text-primary"}`}>
                  <span className={`material-symbols-outlined text-[18px] ${asset.faded ? "text-text-secondary/50" : "text-text-secondary"}`}>{asset.icon}</span>
                  {asset.name}
                </div>
                <div className={`col-span-2 text-body-sm ${asset.faded ? "text-text-secondary/70" : "text-text-secondary"}`}>{asset.category}</div>
                <div className="col-span-2 flex items-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-label-md text-[10px] uppercase font-bold ${statusClasses[asset.statusColor]}`}>
                    {asset.status}
                  </span>
                </div>
                <div className={`col-span-3 text-body-sm flex items-center gap-1.5 justify-between ${asset.faded ? "text-text-secondary/70" : "text-text-secondary"}`}>
                  <span>{asset.location}</span>
                  <button className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-primary transition-all p-1 rounded hover:bg-surface-container">
                    <span className="material-symbols-outlined text-[18px]">more_vert</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="border-t border-border-subtle bg-surface-container-lowest p-comfortable flex items-center justify-between shrink-0">
            <span className="text-body-sm text-text-secondary">Showing 1-5 of 248 assets</span>
            <div className="flex items-center gap-2">
              <button className="p-1 rounded text-text-secondary hover:bg-surface-container hover:text-primary disabled:opacity-50 transition-colors" disabled>
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <span className="text-label-md text-text-primary px-2">Page 1 of 50</span>
              <button className="p-1 rounded text-text-secondary hover:bg-surface-container hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
