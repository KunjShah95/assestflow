export default function AuditPage() {
  const auditItems = [
    { id: "AF-003", name: "Dell laptop", location: "Desk E12", status: "Verified", statusIcon: "check_circle", statusColor: "text-success bg-success/10", rowBg: "" },
    { id: "AF-9921", name: "Office chair", location: "Desk E14", status: "Missing", statusIcon: "error", statusColor: "text-danger bg-danger/10", rowBg: "bg-error/5" },
    { id: "AF-9838", name: "Monitor", location: "Desk E15", status: "Damaged", statusIcon: "warning", statusColor: "text-warning bg-warning/10", rowBg: "bg-warning/5" },
    { id: "AF-004", name: "MacBook Pro", location: "Desk E16", status: "Verified", statusIcon: "check_circle", statusColor: "text-success bg-success/10", rowBg: "" },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-background p-container animate-fade-in">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-headline-lg text-text-primary">Q3 Audit: Engineering Dept – 1-15 Jul</h2>
          <p className="text-body-md text-text-secondary mt-1">Auditors: A. Rao, S. Iqbal</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-border-subtle text-text-primary rounded bg-surface-container-lowest hover:bg-surface-container-low transition-colors text-label-md flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span>
            Export
          </button>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low text-label-md text-text-secondary uppercase tracking-wider border-b border-border-subtle">
              <tr>
                <th className="px-6 py-4 font-medium">Asset</th>
                <th className="px-6 py-4 font-medium">Expected Location</th>
                <th className="px-6 py-4 font-medium">Verification</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-body-md divide-y divide-border-subtle">
              {auditItems.map((item) => (
                <tr key={item.id} className={`hover:bg-surface-container transition-colors ${item.rowBg}`}>
                  <td className="px-6 py-3 text-mono-data text-text-primary">
                    <div className="font-medium">{item.id}</div>
                    <div className="text-text-secondary">{item.name}</div>
                  </td>
                  <td className="px-6 py-3 text-text-secondary">{item.location}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-md ${item.statusColor}`}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{item.statusIcon}</span>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <button className="text-text-secondary hover:text-primary transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary & Actions */}
      <div className="flex flex-col gap-4">
        <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg flex items-start gap-3">
          <span className="material-symbols-outlined text-warning">info</span>
          <div>
            <h3 className="text-headline-sm text-warning">2 assets flagged</h3>
            <p className="text-body-sm text-warning/80 mt-1">
              Discrepancy report generated automatically. Review required before closing cycle.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button className="px-6 py-2 border border-border-subtle text-text-primary rounded bg-surface-container-lowest hover:bg-surface-container-low transition-colors text-label-md">
            Save Progress
          </button>
          <button className="px-6 py-2 bg-primary text-on-primary rounded hover:bg-primary/90 transition-colors text-label-md">
            Close Audit Cycle
          </button>
        </div>
      </div>
    </div>
  );
}
