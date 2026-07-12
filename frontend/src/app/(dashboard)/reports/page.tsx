export default function ReportsPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-background p-container animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-headline-lg text-text-primary mb-1">Reports &amp; Analytics</h2>
          <p className="text-body-md text-text-secondary">System-wide performance and utilization metrics.</p>
        </div>
        <button className="bg-primary hover:bg-primary-container text-on-primary text-label-md py-2 px-4 rounded transition-colors flex items-center">
          <span className="material-symbols-outlined text-[18px] mr-2">download</span>
          Export Report
        </button>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-comfortable">
        {/* Utilization Chart */}
        <div className="bg-surface-container-lowest rounded-lg border border-border-subtle p-comfortable lg:col-span-2">
          <h3 className="text-headline-sm mb-4">Utilization by Department</h3>
          <div className="h-64 flex items-end justify-between space-x-2 px-2 pb-6 border-b border-border-subtle relative">
            {/* Y Axis */}
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-text-secondary text-mono-data text-[10px] w-8">
              {["100%", "75%", "50%", "25%", "0%"].map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
            {/* Grid Lines */}
            <div className="absolute left-10 right-0 top-0 bottom-6 border-l border-border-subtle flex flex-col justify-between pointer-events-none">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`w-full border-t border-border-subtle ${i < 5 ? "border-dashed opacity-50" : ""} h-0`} />
              ))}
            </div>
            {/* Bars */}
            {[
              { label: "ENG", height: 85, opacity: "" },
              { label: "FAC", height: 60, opacity: "opacity-80" },
              { label: "HR", height: 45, opacity: "opacity-60" },
              { label: "OPS", height: 92, opacity: "" },
              { label: "IT", height: 55, opacity: "opacity-70" },
              { label: "R&D", height: 78, opacity: "opacity-90" },
            ].map((bar) => (
              <div key={bar.label} className="flex flex-col items-center flex-1 z-10 first:ml-10 justify-end h-full">
                <div className={`w-full max-w-[40px] chart-bar rounded-t-sm ${bar.opacity}`} style={{ height: `${(bar.height / 100) * 220}px` }} />
                <span className="text-mono-data text-text-secondary mt-2 text-[10px] uppercase truncate w-full text-center">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Line Graph */}
        <div className="bg-surface-container-lowest rounded-lg border border-border-subtle p-comfortable">
          <h3 className="text-headline-sm mb-4">Maintenance Frequency</h3>
          <div className="h-64 relative w-full">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <line stroke="#E2E8F0" strokeDasharray="2,2" strokeWidth="0.5" x1="0" x2="100" y1="25" y2="25" />
              <line stroke="#E2E8F0" strokeDasharray="2,2" strokeWidth="0.5" x1="0" x2="100" y1="50" y2="50" />
              <line stroke="#E2E8F0" strokeDasharray="2,2" strokeWidth="0.5" x1="0" x2="100" y1="75" y2="75" />
              <path className="chart-area" d="M0,80 L20,60 L40,70 L60,30 L80,45 L100,10 L100,100 L0,100 Z" />
              <path className="chart-line" d="M0,80 L20,60 L40,70 L60,30 L80,45 L100,10" />
              <circle cx="20" cy="60" fill="#005c55" r="2" />
              <circle cx="40" cy="70" fill="#005c55" r="2" />
              <circle cx="60" cy="30" fill="#005c55" r="2" />
              <circle cx="80" cy="45" fill="#005c55" r="2" />
              <circle cx="100" cy="10" fill="#005c55" r="2" />
            </svg>
            <div className="absolute bottom-0 w-full flex justify-between text-text-secondary text-mono-data text-[10px] pt-2 border-t border-border-subtle">
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Most Used Assets */}
        <div className="bg-surface-container-lowest rounded-lg border border-border-subtle p-comfortable">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-headline-sm">Most Used Assets</h3>
            <span className="material-symbols-outlined text-text-secondary text-[20px]">trending_up</span>
          </div>
          <ul className="space-y-4">
            {[
              { icon: "meeting_room", name: "Room B2", sub: "34 bookings this month" },
              { icon: "directions_car", name: "Van AF-343", sub: "21 trips this month" },
              { icon: "videocam", name: "Projector AF-335", sub: "18 uses" },
            ].map((item) => (
              <li key={item.name} className="flex items-start">
                <div className="bg-surface-container-low p-2 rounded mr-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">{item.icon}</span>
                </div>
                <div>
                  <p className="text-body-sm font-medium text-text-primary">{item.name}</p>
                  <p className="text-mono-data text-text-secondary">{item.sub}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Idle Assets */}
        <div className="bg-surface-container-lowest rounded-lg border border-border-subtle p-comfortable">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-headline-sm">Idle Assets</h3>
            <span className="material-symbols-outlined text-warning text-[20px]">warning</span>
          </div>
          <ul className="space-y-4">
            {[
              { icon: "photo_camera", name: "Camera AF-0301", sub: "Unused 60+ days" },
              { icon: "chair", name: "Chair AF-0410", sub: "Unused 45 days" },
              { icon: "print", name: "Printer AF-0992", sub: "Unused 30 days" },
            ].map((item) => (
              <li key={item.name} className="flex items-start">
                <div className="bg-surface-container-low p-2 rounded mr-3">
                  <span className="material-symbols-outlined text-text-secondary text-[20px]">{item.icon}</span>
                </div>
                <div>
                  <p className="text-body-sm font-medium text-text-primary">{item.name}</p>
                  <p className="text-mono-data text-text-secondary">{item.sub}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Maintenance / Retirement Action */}
        <div className="bg-surface-container-lowest rounded-lg border border-border-subtle p-comfortable lg:col-span-1">
          <h3 className="text-headline-sm mb-4">Maintenance / Retirement Action Required</h3>
          <div className="space-y-5">
            {[
              { name: "Forklift AF-0087", alert: "Due in 5 days", alertColor: "text-danger", barColor: "bg-danger", width: "90%", sub: "Service required" },
              { name: "Laptop AF-0020", alert: "4 years old", alertColor: "text-warning", barColor: "bg-warning", width: "75%", sub: "Nearing retirement cycle" },
              { name: "HVAC Unit B-East", alert: "Hours limit", alertColor: "text-warning", barColor: "bg-warning", width: "82%", sub: "Routine inspection" },
            ].map((item) => (
              <div key={item.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-body-sm font-medium">{item.name}</span>
                  <span className={`text-mono-data ${item.alertColor}`}>{item.alert}</span>
                </div>
                <div className="w-full bg-surface-container-high rounded-full h-1.5">
                  <div className={`${item.barColor} h-1.5 rounded-full`} style={{ width: item.width }} />
                </div>
                <p className="text-mono-data text-[10px] text-text-secondary mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
