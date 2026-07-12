export default function MaintenancePage() {
  const columns = [
    {
      title: "Pending",
      color: "bg-warning",
      count: 2,
      cards: [
        { id: "AF-0062", title: "Projector bulb not turning on", priority: "High", priorityColor: "bg-danger/10 text-danger", date: "Reported: Today" },
        { id: "AF-0112", title: "Leaking water cooler in Breakroom B", priority: "Med", priorityColor: "bg-warning/10 text-warning", date: "Reported: Yesterday" },
      ],
    },
    {
      title: "Approved",
      color: "bg-info",
      count: 1,
      cards: [
        {
          id: "AF-003",
          title: "AC unit noisy compressor",
          priority: "Low",
          priorityColor: "bg-surface-container-highest text-text-secondary",
          assignee: "Unassigned",
          borderLeft: true,
        },
      ],
    },
    {
      title: "In Progress",
      color: "bg-primary",
      count: 1,
      cards: [
        {
          id: "AF-0078",
          title: "Forklift engine diagnostic",
          priority: "High",
          priorityColor: "bg-danger/10 text-danger",
          assignee: "Tech: R. Varma",
          avatar: "RV",
        },
      ],
    },
    {
      title: "Resolved",
      color: "bg-success",
      count: 2,
      faded: true,
      cards: [
        { id: "AF-897", title: "Printer Jam - parts ordered & replaced", completed: "Completed: 5 Jul" },
        { id: "AF-873", title: "Chair repair - caster replacement", completed: "Completed: 7 Jul" },
      ],
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-surface animate-fade-in">
      {/* Page Header */}
      <div className="px-container py-comfortable border-b border-border-subtle bg-surface-container-lowest shrink-0 flex justify-between items-center">
        <div>
          <h1 className="text-headline-lg text-text-primary">Maintenance Board</h1>
          <p className="text-body-sm text-text-secondary mt-1">Track and manage asset repairs and servicing</p>
        </div>
        <div className="flex gap-standard">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" style={{ fontSize: 18 }}>search</span>
            <input className="pl-10 pr-4 py-2 border border-border-subtle rounded bg-surface-container-lowest text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64 transition-shadow" placeholder="Search tasks..." type="text" />
          </div>
          <button className="bg-primary text-on-primary px-4 py-2 rounded text-label-md flex items-center gap-2 hover:bg-primary-container transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
            New Request
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-container">
        <div className="flex gap-container h-full min-w-max">
          {columns.map((col) => (
            <div key={col.title} className={`w-80 flex flex-col bg-surface-container-low rounded-lg p-standard border border-border-subtle shrink-0 ${col.faded ? "opacity-70 hover:opacity-100 transition-opacity" : ""}`} style={{ minHeight: "calc(100vh - 200px)" }}>
              {/* Column Header */}
              <div className="flex justify-between items-center mb-standard">
                <h2 className="text-headline-sm text-text-primary flex items-center gap-2 uppercase tracking-wide">
                  <span className={`w-2 h-2 rounded-full ${col.color}`} />
                  {col.title}
                </h2>
                <span className="text-mono-data bg-surface-container-highest px-2 py-1 rounded text-text-secondary">{col.count}</span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-standard overflow-y-auto pr-1 pb-4">
                {col.cards.map((card) => {
                  if ("completed" in card) {
                    // Resolved card
                    return (
                      <div key={card.id} className="bg-success/5 border border-success/20 rounded-lg p-standard cursor-pointer kanban-card transition-all flex flex-col gap-compact">
                        <div className="flex justify-between items-start">
                          <span className="text-mono-data font-bold text-text-secondary line-through">{card.id}</span>
                        </div>
                        <div className="text-label-md text-text-secondary">{card.title}</div>
                        <div className="flex items-center gap-1 text-success mt-2">
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span>
                          <span className="text-[11px] font-medium">{card.completed}</span>
                        </div>
                      </div>
                    );
                  }

                  // Active card
                  return (
                    <div key={card.id} className={`bg-surface-container-lowest border border-border-subtle rounded-lg p-standard cursor-pointer kanban-card transition-all flex flex-col gap-compact ${"borderLeft" in card ? "border-l-2 border-l-info" : ""}`}>
                      <div className="flex justify-between items-start">
                        <span className="text-mono-data font-bold text-text-primary">{card.id}</span>
                        {"priority" in card && (
                          <span className={`${card.priorityColor} px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider`}>{card.priority}</span>
                        )}
                      </div>
                      <div className="text-label-md text-text-primary line-clamp-2">{card.title}</div>
                      {"date" in card && (
                        <div className="flex items-center gap-1 text-text-secondary mt-2">
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>calendar_today</span>
                          <span className="text-[11px]">{card.date}</span>
                        </div>
                      )}
                      {"assignee" in card && (
                        <div className="mt-2 pt-2 border-t border-border-subtle flex justify-between items-center">
                          <div className={`flex items-center gap-1 ${"avatar" in card ? "text-primary" : "text-text-secondary"}`}>
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>engineering</span>
                            <span className="text-[11px] font-medium">{card.assignee}</span>
                          </div>
                          {"avatar" in card && (
                            <div className="w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-text-secondary">
                              {card.avatar}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
