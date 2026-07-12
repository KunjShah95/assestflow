"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { useApiError } from "@/hooks/useApiError";
import { departmentService } from "@/services/department.service";
import type { Department } from "@/types/department";
import { assetService } from "@/services/asset.service";
import { employeeService } from "@/services/employee.service";
import { policyService } from "@/services/policy.service";
import type { AssetCategory } from "@/types/asset";
import type { Employee } from "@/types/employee";
import type { Policy } from "@/services/policy.service";
import { Search, Download, Plus, FolderTree, Shield, MapPin, Users, Settings } from "lucide-react";

interface DeptRow {
  id: number;
  name: string;
  head: string;
  parent: string;
  status: string;
  isChild: boolean;
}

export default function OrganizationSetupPage() {
  const { showToast, handleError } = useApiError();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Departments");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newDept, setNewDept] = useState({ name: "", head: "", parent: "--", status: "Active" });
  const [departments, setDepartments] = useState<DeptRow[]>([]);
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const depts = await departmentService.list();
        const mapped: DeptRow[] = (depts || []).map((d: Department, index: number) => ({
          id: d.id || index,
          name: d.name || "",
          head: d.headEmployeeId ? `Emp #${d.headEmployeeId}` : "TBD",
          parent: d.parentDepartmentId ? `Dept #${d.parentDepartmentId}` : "--",
          status: d.status === "active" ? "Active" : "Inactive",
          isChild: !!d.parentDepartmentId,
        }));
        setDepartments(mapped);
      } catch (err) {
        handleError(err, "Could not load departments");
      } finally {
        setLoading(false);
      }
    }
    fetchDepartments();
  }, [handleError]);

  useEffect(() => {
    async function fetchTabData() {
      try {
        if (activeTab === "Categories") {
          const cats = await assetService.categories();
          setCategories(cats || []);
        } else if (activeTab === "Employees") {
          const emps = await employeeService.list();
          setEmployees(emps || []);
        } else if (activeTab === "Locations") {
          const assets = await assetService.list();
          const locs = Array.from(
            new Set((assets || []).map((a) => a.location).filter(Boolean) as string[])
          ).sort();
          setLocations(locs);
        } else if (activeTab === "Policies") {
          const pols = await policyService.list();
          setPolicies(pols || []);
        }
      } catch (err) {
        handleError(err, `Could not load ${activeTab.toLowerCase()}`);
      }
    }
    if (activeTab !== "Departments") {
      fetchTabData();
    }
  }, [activeTab, handleError]);

  const filteredDepartments = React.useMemo(() => {
    const q = searchQuery.toLowerCase();
    return q
      ? departments.filter((d) => d.name.toLowerCase().includes(q) || d.head.toLowerCase().includes(q))
      : departments;
  }, [departments, searchQuery]);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEmployees = employees.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLocations = locations.filter((l) =>
    l.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPolicies = policies.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description || "").toLowerCase().includes(searchQuery.toLowerCase())
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
      const mapped: DeptRow[] = (depts || []).map((d: Department, index: number) => ({
        id: d.id || index,
        name: d.name || "",
        head: d.headEmployeeId ? `Emp #${d.headEmployeeId}` : "TBD",
        parent: d.parentDepartmentId ? `Dept #${d.parentDepartmentId}` : "--",
        status: d.status === "active" ? "Active" : "Inactive",
        isChild: !!d.parentDepartmentId,
      }));
      setDepartments(mapped);
    } catch (err) {
      handleError(err, "Failed to add department");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-[#475569] animate-pulse font-medium text-[14px]">Loading organization data...</div>
      </div>
    );
  }

  const tabs = [
    { name: "Departments", icon: FolderTree },
    { name: "Categories", icon: Settings },
    { name: "Employees", icon: Users },
    { name: "Locations", icon: MapPin },
    { name: "Policies", icon: Shield },
  ];

  const searchPlaceholder =
    activeTab === "Departments" ? "Search departments..." :
    activeTab === "Categories" ? "Search categories..." :
    activeTab === "Employees" ? "Search employees..." :
    activeTab === "Locations" ? "Search locations..." :
    "Search policies...";

  return (
    <div className="flex-1 overflow-y-auto p-8 animate-fade-in max-w-[1320px] mx-auto pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-[28px] font-bold text-[#0F172A]">Organization Setup</h2>
          <p className="text-[14px] text-[#475569] mt-1">
            Manage structural hierarchies, asset categories, and foundational enterprise data.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              try {
                const header = "Department,Head,Parent,Status";
                const rows = departments.map((d) =>
                  [d.name, d.head, d.parent, d.status]
                    .map((v) => `"${v.replace(/"/g, '""')}"`)
                    .join(",")
                );
                const csv = "\uFEFF" + [header, ...rows].join("\r\n");
                const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                const el = document.createElement("a");
                el.href = URL.createObjectURL(blob);
                el.download = `organization-hierarchy-${new Date().toISOString().slice(0, 10)}.csv`;
                document.body.appendChild(el);
                el.click();
                document.body.removeChild(el);
                showToast(`Exported ${departments.length} departments`, "success");
              } catch {
                showToast("Export failed", "error");
              }
            }}
            className="bg-white border border-[#E2E8F0] text-[#0F172A] px-4 py-2.5 rounded-[8px] text-[13px] font-bold hover:bg-[#F8FAFC] transition-colors flex items-center gap-2 shadow-sm"
          >
            <Download size={16} /> Export
          </button>
          {activeTab === "Departments" && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#0052CC] text-white px-5 py-2.5 rounded-[8px] text-[13px] hover:bg-[#0047B3] transition-colors flex items-center gap-2 shadow-sm font-bold"
            >
              <Plus size={16} /> Add Department
            </button>
          )}
        </div>
      </div>

      <div className="border-b border-[#E2E8F0] flex gap-2 overflow-x-auto mb-8">
        {tabs.map((tab) => {
          const IconComp = tab.icon;
          return (
            <button
              key={tab.name}
              onClick={() => { setActiveTab(tab.name); setSearchQuery(""); }}
              className={`pb-3 px-4 flex items-center gap-2 whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab.name
                  ? "border-[#0052CC] text-[#0052CC] font-bold"
                  : "border-transparent text-[#64748B] font-semibold hover:text-[#0F172A] hover:border-[#CBD5E1]"
              }`}
            >
              <IconComp size={16} />
              <span className="text-[13px] uppercase tracking-wide">{tab.name}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-[12px] border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#F8FAFC]">
          <div className="relative w-full sm:w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
            <input
              className="w-full pl-9 pr-3 py-2 border border-[#E2E8F0] rounded-[6px] text-[13px] text-[#0F172A] focus:outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] transition-shadow bg-white shadow-xs"
              placeholder={searchPlaceholder}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === "Departments" && (
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F1F5F9]">
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Department</th>
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Head of Dept</th>
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Parent Dept</th>
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] bg-white">
                {filteredDepartments.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-[#64748B] text-[14px]">No departments match your search.</td></tr>
                ) : (
                  filteredDepartments.map((dept) => (
                    <tr key={dept.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className={`py-4 px-6 text-[14px] font-bold text-[#0F172A] ${dept.isChild ? "pl-12" : ""}`}>{dept.name}</td>
                      <td className="py-4 px-6 text-[14px] text-[#475569]">{dept.head}</td>
                      <td className={`py-4 px-6 text-[14px] text-[#475569] ${dept.parent === "--" ? "italic opacity-60" : ""}`}>{dept.parent}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${dept.status === "Active" ? "bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]" : "bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]"}`}>{dept.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === "Categories" && (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F1F5F9]">
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Category</th>
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Description</th>
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] bg-white">
                {filteredCategories.length === 0 ? (
                  <tr><td colSpan={3} className="p-8 text-center text-[#64748B] text-[14px]">No categories found.</td></tr>
                ) : (
                  filteredCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-4 px-6 text-[14px] font-bold text-[#0F172A]">{cat.name}</td>
                      <td className="py-4 px-6 text-[14px] text-[#475569]">{cat.description || "—"}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]">{cat.status || "active"}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === "Employees" && (
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F1F5F9]">
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Name</th>
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Email</th>
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Role</th>
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] bg-white">
                {filteredEmployees.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-[#64748B] text-[14px]">No employees found.</td></tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-4 px-6 text-[14px] font-bold text-[#0F172A]">{emp.name}</td>
                      <td className="py-4 px-6 text-[14px] text-[#475569]">{emp.email}</td>
                      <td className="py-4 px-6 text-[14px] text-[#475569] capitalize">{emp.role.replace(/_/g, " ")}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${emp.status === "active" ? "bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]" : "bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]"}`}>{emp.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === "Locations" && (
            <table className="w-full text-left border-collapse min-w-[400px]">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F1F5F9]">
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] bg-white">
                {filteredLocations.length === 0 ? (
                  <tr><td className="p-8 text-center text-[#64748B] text-[14px]">No locations found.</td></tr>
                ) : (
                  filteredLocations.map((loc) => (
                    <tr key={loc} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-4 px-6 text-[14px] font-medium text-[#0F172A]">{loc}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === "Policies" && (
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F1F5F9]">
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Policy</th>
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Rule Type</th>
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Action</th>
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] bg-white">
                {filteredPolicies.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-[#64748B] text-[14px]">No policies found.</td></tr>
                ) : (
                  filteredPolicies.map((pol) => (
                    <tr key={pol.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-4 px-6">
                        <p className="text-[14px] font-bold text-[#0F172A]">{pol.name}</p>
                        {pol.description && <p className="text-[12px] text-[#64748B] mt-0.5">{pol.description}</p>}
                      </td>
                      <td className="py-4 px-6 text-[14px] text-[#475569] capitalize">{pol.ruleType}</td>
                      <td className="py-4 px-6 text-[14px] text-[#475569] capitalize">{pol.action.replace(/_/g, " ")}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${pol.isActive ? "bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]" : "bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]"}`}>
                          {pol.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 border-t border-[#E2E8F0] flex items-center justify-between bg-white text-[#64748B] text-[12px] font-semibold">
          <div>
            {activeTab === "Departments" && `Showing ${filteredDepartments.length} of ${departments.length} departments`}
            {activeTab === "Categories" && `Showing ${filteredCategories.length} of ${categories.length} categories`}
            {activeTab === "Employees" && `Showing ${filteredEmployees.length} of ${employees.length} employees`}
            {activeTab === "Locations" && `Showing ${filteredLocations.length} of ${locations.length} locations`}
            {activeTab === "Policies" && `Showing ${filteredPolicies.length} of ${policies.length} policies`}
          </div>
        </div>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create New Department">
        <form onSubmit={handleAddDepartment} className="space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-[#475569] mb-1" htmlFor="dept-name">Department Name</label>
            <input
              id="dept-name"
              type="text"
              placeholder="e.g. AI & Research"
              value={newDept.name}
              onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
              className="w-full bg-white border border-[#CBD5E1] rounded-[6px] px-3 py-2 text-[14px] text-[#0F172A] focus:border-[#0052CC] outline-none transition-colors"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0] mt-6">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2.5 rounded-[6px] text-[13px] font-bold border border-[#CBD5E1] text-[#475569] hover:bg-[#F1F5F9] transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 rounded-[6px] text-[13px] bg-[#0052CC] text-white hover:bg-[#0047B3] font-bold shadow-sm transition-colors">Save Department</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
