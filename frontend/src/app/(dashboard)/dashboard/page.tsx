export default function DashboardPage() {
  return (
    <div className="flex-1 overflow-y-auto p-container pb-24 animate-fade-in">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-headline-lg text-text-primary">Today&apos;s Overview</h1>
          <p className="text-body-sm text-text-secondary mt-1">
            Real-time status of your enterprise assets.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Available", value: "128" },
          { label: "Allocated", value: "76" },
          { label: "Active Bookings", value: "9" },
          { label: "Pending Transfers", value: "3" },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-surface-container-lowest border border-border-subtle rounded-lg p-standard flex flex-col hover:shadow-sm transition-shadow"
          >
            <span className="text-label-md text-text-secondary uppercase tracking-wider mb-2">
              {card.label}
            </span>
            <span className="text-headline-lg text-text-primary font-bold">
              {card.value}
            </span>
          </div>
        ))}
      </div>

      {/* Alert Banner */}
      <div className="bg-error-container text-on-error-container border border-error/20 rounded-lg p-standard flex items-center gap-3 mb-8">
        <span className="material-symbols-outlined">warning</span>
        <span className="text-body-md font-medium">
          3 assets overdue for return – flagged for follow-up
        </span>
      </div>

      {/* Primary Actions */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button className="bg-primary text-on-primary text-label-md px-6 py-2.5 rounded-md flex items-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            add
          </span>
          Register Asset
        </button>
        <button className="border border-border-subtle bg-surface-container-lowest text-text-primary text-label-md px-6 py-2.5 rounded-md flex items-center gap-2 hover:bg-surface-container-low transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            event
          </span>
          Book Resource
        </button>
        <button className="border border-border-subtle bg-surface-container-lowest text-text-primary text-label-md px-6 py-2.5 rounded-md flex items-center gap-2 hover:bg-surface-container-low transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            support_agent
          </span>
          Raise Requests
        </button>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden">
        <div className="px-comfortable py-standard border-b border-border-subtle bg-surface-bright">
          <h2 className="text-headline-sm text-text-primary">Recent Activity</h2>
        </div>
        <div className="divide-y divide-border-subtle">
          {[
            {
              icon: "computer",
              iconBg: "bg-secondary-container text-primary",
              title: "Laptop AF-0114",
              desc: "Allocated to Priya Shah – IT Dept",
              time: "10:42 AM",
            },
            {
              icon: "meeting_room",
              iconBg: "bg-tertiary-container/20 text-tertiary",
              title: "Room B2",
              desc: "Booking confirmed – 2:00 to 3:00 PM",
              time: "09:15 AM",
            },
            {
              icon: "check_circle",
              iconBg: "bg-success/10 text-success",
              title: "Projector AF-0062",
              desc: "Maintenance resolved – ready for allocation",
              time: "Yesterday",
            },
            {
              icon: "chair",
              iconBg: "bg-secondary-container text-primary",
              title: "Office Chair AF-0201",
              desc: "Returned by Field Ops (East)",
              time: "Yesterday",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="px-comfortable py-standard flex items-start gap-4 hover:bg-surface-container transition-colors group"
            >
              <div
                className={`w-8 h-8 rounded-full ${item.iconBg} flex items-center justify-center shrink-0 mt-1`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                  {item.icon}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-label-md text-text-primary font-bold">
                    {item.title}
                  </span>
                  <span className="text-mono-data text-text-secondary">{item.time}</span>
                </div>
                <p className="text-body-sm text-text-secondary">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
