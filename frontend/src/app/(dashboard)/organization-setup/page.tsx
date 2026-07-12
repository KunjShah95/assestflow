export default function OrganizationSetupPage() {
  const departments = [
    { name: "Engineering", head: "Aditi Rao", parent: "--", status: "Active", isChild: false },
    { name: "Facilities", head: "Rohan Mehta", parent: "--", status: "Active", isChild: false },
    { name: "Field Ops (East)", head: "Sana Iqbal", parent: "Field Ops", status: "Inactive", isChild: true },
    { name: "Field Ops (West)", head: "Marcus Johnson", parent: "Field Ops", status: "Active", isChild: true },
    { name: "Human Resources", head: "Elena Rodriguez", parent: "--", status: "Active", isChild: false },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-container animate-fade-in">
      {/* Page Header */}
      <div className="mb-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-comfortable mb-standard">
          <div>
            <h2 className="text-headline-lg text-text-primary">Organization Setup</h2>
            <p className="text-body-md text-text-secondary mt-1">
              Manage structural hierarchies and foundational data.
            </p>
          </div>
          <div className="flex items-center gap-standard">
            <button className="bg-surface-container-lowest border border-border-subtle text-text-primary px-4 py-2 rounded-md text-label-md hover:bg-surface-container-low transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span>
              Export
            </button>
            <button className="bg-primary text-on-primary px-4 py-2 rounded-md text-label-md hover:bg-surface-tint transition-colors flex items-center gap-2 shadow-sm">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
              Add Department
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border-subtle flex gap-comfortable overflow-x-auto">
          {["Departments", "Categories", "Employees", "Locations"].map((tab, i) => (
            <button
              key={tab}
              className={`pb-2 border-b-2 text-label-md px-2 whitespace-nowrap transition-colors ${
                i === 0
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-text-secondary hover:text-text-primary hover:border-border-subtle"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface-container-lowest rounded-lg border border-border-subtle shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-standard border-b border-border-subtle flex flex-col sm:flex-row gap-standard justify-between items-center bg-surface-bright">
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">
              search
            </span>
            <input
              className="w-full pl-9 pr-3 py-2 border border-border-subtle rounded-md text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow bg-surface-container-lowest"
              placeholder="Search departments..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-compact w-full sm:w-auto">
            <button className="p-2 border border-border-subtle rounded-md text-text-secondary hover:bg-surface-container-low transition-colors bg-surface-container-lowest">
              <span className="material-symbols-outlined text-sm block">filter_list</span>
            </button>
            <button className="p-2 border border-border-subtle rounded-md text-text-secondary hover:bg-surface-container-low transition-colors bg-surface-container-lowest">
              <span className="material-symbols-outlined text-sm block">view_column</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-container-low">
                <th className="py-3 px-standard text-label-md text-text-secondary uppercase tracking-wider font-semibold">Department</th>
                <th className="py-3 px-standard text-label-md text-text-secondary uppercase tracking-wider font-semibold">Head</th>
                <th className="py-3 px-standard text-label-md text-text-secondary uppercase tracking-wider font-semibold">Parent Dept</th>
                <th className="py-3 px-standard text-label-md text-text-secondary uppercase tracking-wider font-semibold">Status</th>
                <th className="py-3 px-standard text-label-md text-text-secondary uppercase tracking-wider font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-body-sm text-text-primary bg-surface-container-lowest">
              {departments.map((dept, i) => (
                <tr key={i} className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                  <td className={`py-3 px-standard font-medium ${dept.isChild ? "pl-comfortable flex items-center gap-2" : ""}`}>
                    {dept.isChild && <span className="w-4 h-px bg-border-subtle inline-block" />}
                    {dept.name}
                  </td>
                  <td className="py-3 px-standard text-text-secondary">{dept.head}</td>
                  <td className={`py-3 px-standard text-text-secondary ${dept.parent === "--" ? "italic" : ""}`}>{dept.parent}</td>
                  <td className="py-3 px-standard">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${
                        dept.status === "Active"
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-surface-variant text-text-secondary border-border-subtle"
                      }`}
                    >
                      {dept.status}
                    </span>
                  </td>
                  <td className="py-3 px-standard text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-text-secondary hover:text-primary p-1">
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-standard border-t border-border-subtle flex items-center justify-between bg-surface-container-lowest text-text-secondary text-label-md">
          <div>Showing 1 to 5 of 12 departments</div>
          <div className="flex items-center gap-compact">
            <button className="p-1 rounded hover:bg-surface-container-low disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-sm block">chevron_left</span>
            </button>
            <span className="px-2">Page 1 of 3</span>
            <button className="p-1 rounded hover:bg-surface-container-low">
              <span className="material-symbols-outlined text-sm block">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <p className="mt-comfortable text-text-secondary text-body-sm italic text-center">
        Editing a department here also drives the picklist in Asset Registrations.
      </p>
    </div>
  );
}
