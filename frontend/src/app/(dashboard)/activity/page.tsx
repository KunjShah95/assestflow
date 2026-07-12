export default function ActivityPage() {
  const logs = [
    {
      icon: "swap_horiz",
      iconBg: "bg-secondary-container",
      iconColor: "text-info",
      title: <><span className="font-medium">Laptop AF-0114</span> assigned to <span className="font-medium">Priya Shah</span></>,
      sub: "Asset Allocation",
      time: "2m ago",
      bg: "",
    },
    {
      icon: "check_circle",
      iconBg: "bg-tertiary-container/20",
      iconColor: "text-success",
      title: <>Maintenance request <span className="font-medium text-info">AF-0055</span> approved</>,
      sub: "Approval Flow",
      time: "18m ago",
      bg: "",
    },
    {
      icon: "event_seat",
      iconBg: "bg-surface-container-high",
      iconColor: "text-text-secondary",
      title: "Booking confirmed : Room B2 : 2:00 to 3:00 PM",
      sub: "Resource Booking",
      time: "1h ago",
      bg: "",
    },
    {
      icon: "check_circle",
      iconBg: "bg-tertiary-container/20",
      iconColor: "text-success",
      title: "Transfer approved : AF-0033 to facilities dept",
      sub: "Approval Flow",
      time: "3h ago",
      bg: "",
    },
    {
      icon: "warning",
      iconBg: "bg-error/10",
      iconColor: "text-error",
      title: <span className="font-medium">Overdue return : AF-0021 was due 3 days ago</span>,
      sub: "System Alert",
      subColor: "text-error",
      time: "1d ago",
      timeColor: "text-error font-medium",
      bg: "bg-error-container/20",
    },
    {
      icon: "assignment_late",
      iconBg: "bg-warning/20",
      iconColor: "text-warning",
      title: <>Audit discrepancy flagged : <span className="font-medium">AF-0088</span> damaged</>,
      sub: "Audit Report",
      subColor: "text-warning",
      time: "2d ago",
      bg: "bg-warning/10",
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in">
      {/* Desktop Header */}
      <header className="bg-surface-container-lowest border-b border-border-subtle px-container py-standard sticky top-0 z-30 hidden md:flex justify-between items-center">
        <div>
          <h1 className="text-headline-lg text-text-primary">Activity Logs &amp; Notifications</h1>
          <p className="text-body-sm text-text-secondary mt-1">Chronological audit trail of system events.</p>
        </div>
        <div className="flex items-center gap-standard">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-lg">search</span>
            <input className="pl-10 pr-4 py-2 bg-surface-container-low border border-border-subtle rounded-md text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow w-64" placeholder="Search logs..." type="text" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-low border border-border-subtle rounded-md text-label-md text-text-primary hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Filter
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-container max-w-5xl mx-auto w-full">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 mb-comfortable overflow-x-auto pb-2">
          {["All", "Alerts", "Approvals", "Bookings"].map((filter, i) => (
            <button
              key={filter}
              className={`px-4 py-1.5 rounded-full text-label-md whitespace-nowrap transition-colors ${
                i === 0
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container-low text-text-secondary border border-border-subtle hover:bg-surface-container-high"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Activity Feed */}
        <div className="bg-surface-container-lowest border border-border-subtle rounded-lg shadow-sm">
          {logs.map((log, i) => (
            <div
              key={i}
              className={`flex gap-4 p-4 border-b border-border-subtle last:border-b-0 hover:bg-surface-container-low transition-colors group ${log.bg}`}
            >
              <div className={`w-10 h-10 rounded-full ${log.iconBg} flex items-center justify-center shrink-0`}>
                <span className={`material-symbols-outlined ${log.iconColor}`}>{log.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body-md text-text-primary truncate">{log.title}</p>
                <p className={`text-body-sm mt-0.5 ${"subColor" in log ? log.subColor : "text-text-secondary"}`}>{log.sub}</p>
              </div>
              <div className="text-right shrink-0">
                <span className={`text-mono-data ${"timeColor" in log ? log.timeColor : "text-text-secondary"}`}>{log.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <button className="px-4 py-2 text-primary text-label-md hover:bg-surface-container-low rounded-md transition-colors">
            Load More Activity
          </button>
        </div>
      </div>
    </div>
  );
}
