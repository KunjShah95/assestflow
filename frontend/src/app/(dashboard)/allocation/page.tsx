export default function AllocationPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-surface animate-fade-in">
      <div className="max-w-6xl mx-auto p-container md:p-8 space-y-comfortable">
        {/* Page Header */}
        <div className="flex justify-between items-end pb-4 border-b border-border-subtle">
          <div>
            <h1 className="text-headline-lg text-text-primary">Allocation &amp; Transfer</h1>
            <p className="text-body-sm text-text-secondary mt-1">
              Manage asset assignments and process transfer requests.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span className="material-symbols-outlined text-text-secondary cursor-pointer hover:text-primary transition-colors">search</span>
            <span className="material-symbols-outlined text-text-secondary cursor-pointer hover:text-primary transition-colors">notifications</span>
            <span className="material-symbols-outlined text-text-secondary cursor-pointer hover:text-primary transition-colors">account_circle</span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-container">
          {/* Transfer Request Form */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-lg border border-border-subtle p-6 shadow-sm flex flex-col gap-6">
            <h2 className="text-headline-md text-text-primary">Transfer Request</h2>
            <form className="space-y-5">
              {/* Asset Input */}
              <div className="space-y-1.5">
                <label className="text-label-md text-text-primary block" htmlFor="asset-input">Asset</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">laptop_mac</span>
                  <input className="w-full pl-10 pr-3 py-2 bg-surface border border-border-subtle rounded text-body-md text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" id="asset-input" readOnly type="text" defaultValue="AF-0114 - Dell Laptop" />
                </div>
              </div>

              {/* Error Banner */}
              <div className="bg-error-container/30 border border-error/50 rounded p-3 flex gap-3 items-start">
                <span className="material-symbols-outlined text-error mt-0.5">error</span>
                <div>
                  <p className="text-label-md text-error font-semibold">Already Allocated to Priya Shah (Engineering)</p>
                  <p className="text-body-sm text-error mt-0.5">Direct re-allocation is blocked – submit a transfer request below.</p>
                </div>
              </div>

              {/* From / To Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-label-md text-text-primary block" htmlFor="from-user">From</label>
                  <input className="w-full px-3 py-2 bg-surface-container-low border border-border-subtle rounded text-body-md text-text-secondary cursor-not-allowed" disabled id="from-user" type="text" defaultValue="Priya Shah" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-label-md text-text-primary block" htmlFor="to-user">To</label>
                  <div className="relative">
                    <select className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded text-body-md text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none" id="to-user" defaultValue="">
                      <option disabled value="">Select Employee...</option>
                      <option value="emp1">Rahul Desai</option>
                      <option value="emp2">Anita Sharma</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">expand_more</span>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-1.5">
                <label className="text-label-md text-text-primary block" htmlFor="reason-text">Reason</label>
                <textarea className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded text-body-md text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none" id="reason-text" placeholder="Provide justification for this transfer..." rows={3} />
              </div>

              {/* Submit */}
              <div className="pt-4 flex justify-end">
                <button className="bg-primary hover:bg-primary-container text-on-primary text-label-md py-2 px-6 rounded transition-colors shadow-sm flex items-center gap-2" type="button">
                  <span className="material-symbols-outlined text-sm">send</span>
                  Submit Request
                </button>
              </div>
            </form>
          </div>

          {/* Contextual Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-container">
            {/* Asset Summary Card */}
            <div className="bg-surface-container-lowest rounded-lg border border-border-subtle p-5 shadow-sm">
              <h3 className="text-label-md uppercase tracking-wider text-text-secondary mb-4 border-b border-border-subtle pb-2">Asset Details</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-secondary-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">laptop_mac</span>
                </div>
                <div>
                  <p className="text-headline-sm text-text-primary">AF-0114</p>
                  <p className="text-body-sm text-text-secondary">Dell Latitude 7420</p>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                {[
                  { label: "Category:", value: "Electronics" },
                  { label: "Status:", value: "Allocated", badge: true },
                  { label: "Location:", value: "HQ Floor 3" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-body-sm">
                    <span className="text-text-secondary">{item.label}</span>
                    {item.badge ? (
                      <span className="bg-error/10 text-error px-2 py-0.5 rounded-full text-[10px] font-bold">{item.value}</span>
                    ) : (
                      <span className="text-text-primary font-medium">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Allocation History Timeline */}
            <div className="bg-surface-container-lowest rounded-lg border border-border-subtle p-5 shadow-sm flex-1">
              <h3 className="text-label-md uppercase tracking-wider text-text-secondary mb-5 border-b border-border-subtle pb-2">Allocation History</h3>
              <div className="relative border-l border-border-subtle ml-3 space-y-6">
                {[
                  { date: "Mar 12, 2023", desc: <>Allocated to <strong>Priya Shah</strong></>, sub: "Dept: Engineering", active: true },
                  { date: "Jan 04, 2023", desc: <>Returned by <strong>Arjun Nair</strong></>, sub: "Condition reported: Good", active: false },
                  { date: "Nov 15, 2022", desc: "Asset Registered", sub: "Procurement Batch #8892", active: false },
                ].map((item, i) => (
                  <div key={i} className="relative pl-6">
                    <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ${item.active ? "bg-primary ring-4 ring-surface-container-lowest" : "bg-border-subtle"}`} />
                    <p className="text-mono-data text-text-secondary mb-1">{item.date}</p>
                    <p className="text-body-sm text-text-primary">{item.desc}</p>
                    <p className="text-body-sm text-text-secondary text-xs mt-0.5">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
