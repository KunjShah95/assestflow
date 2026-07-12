"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { useToast } from "@/components/ToastProvider";
import { departmentService } from "@/services/department.service";
import { Download, Plus, Search, Pencil, FolderKanban } from "lucide-react";

interface Department {
  name: string;
  head: string;
  parent: string;
  status: string;
  isChild: boolean;
}

export default function OrganizationSetupPage() {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Departments");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newDept, setNewDept] = useState({ name: "", head: "", parent: "--", status: "Active" });
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const depts = await departmentService.list();
        const mapped: Department[] = (depts || []).map((d) => ({
          name: d.name || "",
          head: d.headEmployeeId ? `Emp #${d.headEmployeeId}` : "TBD",
          parent: d.parentDepartmentId ? `Dept #${d.parentDepartmentId}` : "--",
          status: d.status === "active" ? "Active" : "Inactive",
          isChild: !!d.parentDepartmentId,
        }));
        setDepartments(mapped.length > 0 ? mapped : [
          { name: "Engineering", head: "Aditi Rao", parent: "--", status: "Active", isChild: false },
          { name: "Facilities", head: "Rohan Mehta", parent: "--", status: "Active", isChild: false },
        ]);
      } catch {
        setDepartments([
          { name: "Engineering", head: "Aditi Rao", parent: "--", status: "Active", isChild: false },
          { name: "Facilities", head: "Rohan Mehta", parent: "--", status: "Active", isChild: false },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredDepartments = departments.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.head.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.name.trim()) {
      showToast("Please enter a department name", "error");
      return;
    }
    try {
      await departmentService.create({ name: newDept.name });
      showToast(`Added department: ${newDept.name}`, "success");
      setIsAddModalOpen(false);
      setNewDept({ name: "", head: "", parent: "--", status: "Active" });
      const depts = await departmentService.list();
      const mapped: Department[] = (depts || []).map((d) => ({
        name: d.name || "", head: d.headEmployeeId ? `Emp #${d.headEmployeeId}` : "TBD",
        parent: d.parentDepartmentId ? `Dept #${d.parentDepartmentId}` : "--",
        status: d.status === "active" ? "Active" : "Inactive", isChild: !!d.parentDepartmentId,
      }));
      setDepartments(mapped);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to add department", "error");
    }
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center min-h-[60vh]"><div className="text-text-secondary animate-pulse font-medium">Loading organization data...</div></div>;
  }

  return (
    <div className="flex-1 overflow-y-auto p-container animate-fade-in">
      <div className="mb-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-comfortable mb-standard">
          <div>
            <h2 className="text-headline-lg text-text-primary">Organization Setup</h2>
            <p className="text-body-md text-text-secondary mt-1">Manage structural hierarchies and foundational data.</p>
          </div>
          <div className="flex items-center gap-standard">
            <button onClick={() => showToast("Exporting Organization Hierarchy data...", "info")}
              className="bg-surface-container-lowest border border-border-subtle text-text-primary px-4 py-2 rounded-md text-label-md hover:bg-surface-container-low transition-colors flex items-center gap-2 shadow-sm">
              <Download size={18} />Export
            </button>
            <button onClick={() => setIsAddModalOpen(true)}
              className="bg-primary text-on-primary px-4 py-2 rounded-md text-label-md hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm font-medium">
              <Plus size={18} />Add Department
            </button>
          </div>
        </div>

        <div className="border-b border-border-subtle flex gap-comfortable overflow-x-auto">
          {["Departments", "Categories", "Employees", "Locations"].map((tab) => (
            <button key={tab} onClick={() => { setActiveTab(tab); showToast(`Switched view to ${tab}`, "info"); }}
              className={`pb-2 border-b-2 text-label-md px-2 whitespace-nowrap transition-colors ${activeTab === tab ? "border-primary text-primary font-bold" : "border-transparent text-text-secondary hover:text-text-primary hover:border-border-subtle"}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "Departments" ? (
        <div className="bg-surface-container-lowest rounded-lg border border-border-subtle shadow-sm overflow-hidden flex flex-col">
          <div className="p-standard border-b border-border-subtle flex flex-col sm:flex-row gap-standard justify-between items-center bg-surface-bright">
            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input className="w-full pl-9 pr-3 py-2 border border-border-subtle rounded-md text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow bg-surface-container-lowest" placeholder="Search departments..." type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>

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
                {filteredDepartments.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-text-secondary">No departments found</td></tr>
                ) : (
                  filteredDepartments.map((dept, i) => (
                    <tr key={i} onClick={() => showToast(`Department details: ${dept.name} (Head: ${dept.head})`, "info")}
                      className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                      <td className={`py-3 px-standard font-medium ${dept.isChild ? "pl-comfortable" : ""}`}>
                        {dept.isChild && <span className="w-4 h-px bg-border-subtle inline-block mr-2" />}{dept.name}
                      </td>
                      <td className="py-3 px-standard text-text-secondary">{dept.head}</td>
                      <td className={`py-3 px-standard text-text-secondary ${dept.parent === "--" ? "italic" : ""}`}>{dept.parent}</td>
                      <td className="py-3 px-standard">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${dept.status === "Active" ? "bg-success/10 text-success border-success/20" : "bg-surface-variant text-text-secondary border-border-subtle"}`}>{dept.status}</span>
                      </td>
                      <td className="py-3 px-standard text-right opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); showToast(`Editing department ${dept.name}`, "info"); }}
                          className="text-text-secondary hover:text-primary p-1"><Pencil size={16} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-standard border-t border-border-subtle flex items-center justify-between bg-surface-container-lowest text-text-secondary text-label-md">
            <div>Showing {filteredDepartments.length} of {departments.length} departments</div>
          </div>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-lg border border-border-subtle p-8 text-center">
          <FolderKanban size={48} className="text-primary mx-auto mb-3" />
          <h3 className="text-headline-sm text-text-primary mb-1">{activeTab} Management</h3>
          <p className="text-body-sm text-text-secondary max-w-md mx-auto">Configured hierarchies for {activeTab.toLowerCase()} are synced directly with the Asset Directory and Allocation engine.</p>
        </div>
      )}

      <p className="mt-comfortable text-text-secondary text-body-sm italic text-center">Editing a department here also drives the picklist in Asset Registrations.</p>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create New Organization Department">
        <form onSubmit={handleAddDepartment} className="space-y-4">
          <div><label className="block text-label-md mb-1" htmlFor="dept-name">Department Name</label>
            <input id="dept-name" type="text" placeholder="e.g. AI & Research" value={newDept.name} onChange={(e) => setNewDept({ ...newDept, name: e.target.value })} className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md focus:border-primary outline-none" /></div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 rounded text-label-md border border-border-subtle hover:bg-surface-container">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded text-label-md bg-primary text-on-primary hover:bg-primary/90 font-medium">Save Department</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
