"use client";

import React, { useState, useEffect, useMemo } from "react";
import Modal from "@/components/Modal";
import { useApiError } from "@/hooks/useApiError";
import { departmentService } from "@/services/department.service";
import type { Department } from "@/types/department";
import { assetService } from "@/services/asset.service";
import { employeeService } from "@/services/employee.service";
import { policyService } from "@/services/policy.service";
import type { Asset } from "@/types/asset";
import type { AssetCategory } from "@/types/asset";
import type { Employee } from "@/types/employee";
import type { Policy } from "@/services/policy.service";
import { Search, Download, Plus, FolderTree, Edit2, Shield, MapPin, Users, Settings } from "lucide-react";

const TABS = [
  { name: "Departments", icon: FolderTree },
  { name: "Categories", icon: Settings },
  { name: "Employees", icon: Users },
  { name: "Locations", icon: MapPin },
  { name: "Policies", icon: Shield },
];

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
  const [refreshKey, setRefreshKey] = useState(0);

  // Lists state
  const [departments, setDepartments] = useState<DeptRow[]>([]);
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [locations, setLocations] = useState<{ name: string; assetCount: number }[]>([]);

  // Add modals visibility
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [isAddPolicyOpen, setIsAddPolicyOpen] = useState(false);
  const [isAddLocOpen, setIsAddLocOpen] = useState(false);

  // Edit modals visibility
  const [editingDept, setEditingDept] = useState<DeptRow | null>(null);
  const [editingCategory, setEditingCategory] = useState<AssetCategory | null>(null);

  // Form states
  const [newDept, setNewDept] = useState({ name: "", head: "", parent: "--", status: "Active" });
  const [newCategory, setNewCategory] = useState({ name: "", description: "", warrantyPeriodDays: "" });
  const [newLocation, setNewLocation] = useState({ name: "" });
  const [newPolicy, setNewPolicy] = useState({
    name: "",
    description: "",
    ruleType: "allocate",
    action: "allow",
    priority: "0",
    employeeRole: "",
    categoryId: "",
    maxCost: ""
  });

  const fetchData = React.useCallback(async () => {
    try {
      const [depts, cats, emps, rules, assets] = await Promise.all([
        departmentService.list(),
        assetService.categories(),
        employeeService.list(),
        policyService.list(),
        assetService.list()
      ]);

      const employeeNameById = new Map((emps || []).map((e: Employee) => [e.id, e.name]));

      const mappedDepts: DeptRow[] = (depts || []).map((d: Department, index: number) => ({
        id: d.id || index,
        name: d.name || "",
        head: d.headEmployeeId
          ? employeeNameById.get(d.headEmployeeId) ?? "Unknown"
          : "TBD",
        parent: d.parentDepartmentId ? `Dept #${d.parentDepartmentId}` : "--",
        status: d.status === "active" ? "Active" : "Inactive",
        isChild: !!d.parentDepartmentId,
      }));
      setDepartments(mappedDepts);
      setCategories(cats || []);
      setEmployees(emps || []);
      setPolicies(rules || []);

      const locMap: Record<string, number> = {};
      assets.forEach((a: Asset) => {
        const loc = a.location || "Unassigned";
        locMap[loc] = (locMap[loc] || 0) + 1;
      });
      const locList = Object.entries(locMap).map(([name, assetCount]) => ({ name, assetCount }));
      setLocations(locList);

    } catch (err) {
      handleError(err, "Could not load organization setup data");
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(t);
  }, [refreshKey, fetchData]);

  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) {
      return { departments, categories, employees, policies, locations };
    }
    return {
      departments: departments.filter(d => d.name.toLowerCase().includes(q) || d.head.toLowerCase().includes(q)),
      categories: categories.filter(c => c.name.toLowerCase().includes(q) || (c.description || "").toLowerCase().includes(q)),
      employees: employees.filter(e => e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.role.toLowerCase().includes(q)),
      policies: policies.filter(p => p.name.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q) || p.ruleType.toLowerCase().includes(q)),
      locations: locations.filter(l => l.name.toLowerCase().includes(q))
    };
  }, [searchQuery, departments, categories, employees, policies, locations]);

  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.name.trim()) {
      showToast("Please enter a department name", "error");
      return;
    }
    try {
      await departmentService.create({ name: newDept.name });
      showToast(`Added department: ${newDept.name}`, "success");
      setIsAddDeptOpen(false);
      setNewDept({ name: "", head: "", parent: "--", status: "Active" });
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      handleError(err, "Failed to add department");
    }
  };

  const handleUpdateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;
    try {
      await departmentService.update(editingDept.id, {
        name: editingDept.name,
        status: editingDept.status === "Active" ? "active" : "inactive"
      });
      showToast(`Updated department: ${editingDept.name}`, "success");
      setEditingDept(null);
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      handleError(err, "Failed to update department");
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      showToast("Please enter a category name", "error");
      return;
    }
    try {
      await assetService.createCategory({
        name: newCategory.name,
        description: newCategory.description || undefined,
        warrantyPeriodDays: newCategory.warrantyPeriodDays ? parseInt(newCategory.warrantyPeriodDays) : undefined
      });
      showToast(`Added category: ${newCategory.name}`, "success");
      setIsAddCatOpen(false);
      setNewCategory({ name: "", description: "", warrantyPeriodDays: "" });
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      handleError(err, "Failed to add category");
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      await assetService.updateCategory(editingCategory.id, {
        name: editingCategory.name,
        description: editingCategory.description || undefined,
        warrantyPeriodDays: editingCategory.warrantyPeriodDays ? parseInt(editingCategory.warrantyPeriodDays.toString()) : undefined
      });
      showToast(`Updated category: ${editingCategory.name}`, "success");
      setEditingCategory(null);
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      handleError(err, "Failed to update category");
    }
  };

  const handlePromoteEmployee = async (id: number, role: string) => {
    try {
      await employeeService.promote(id, role);
      showToast(`Employee role updated to ${role.replace("_", " ")}`, "success");
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      handleError(err, "Failed to update employee role");
    }
  };

  const handleDeactivateEmployee = async (id: number) => {
    try {
      await employeeService.deactivate(id);
      showToast(`Employee account deactivated`, "success");
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      handleError(err, "Failed to deactivate employee");
    }
  };

  interface PolicyConditions {
    employeeRole?: string;
    categoryId?: number;
    maxCost?: number;
  }

  const handleAddPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPolicy.name.trim()) {
      showToast("Please enter a policy name", "error");
      return;
    }

    const conditions: PolicyConditions = {};
    if (newPolicy.employeeRole) conditions.employeeRole = newPolicy.employeeRole;
    if (newPolicy.categoryId) conditions.categoryId = parseInt(newPolicy.categoryId);
    if (newPolicy.maxCost) conditions.maxCost = parseFloat(newPolicy.maxCost);

    try {
      await policyService.create({
        name: newPolicy.name,
        description: newPolicy.description || undefined,
        ruleType: newPolicy.ruleType,
        action: newPolicy.action as "allow" | "deny" | "require_approval",
        priority: newPolicy.priority ? parseInt(newPolicy.priority) : 0,
        conditions: conditions as Record<string, unknown>
      });
      showToast(`Added policy: ${newPolicy.name}`, "success");
      setIsAddPolicyOpen(false);
      setNewPolicy({
        name: "",
        description: "",
        ruleType: "allocate",
        action: "allow",
        priority: "0",
        employeeRole: "",
        categoryId: "",
        maxCost: ""
      });
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      handleError(err, "Failed to add policy");
    }
  };

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocation.name.trim()) {
      showToast("Please enter a location name", "error");
      return;
    }
    setLocations(prev => [...prev, { name: newLocation.name, assetCount: 0 }]);
    showToast(`Added location option: ${newLocation.name}`, "success");
    setIsAddLocOpen(false);
    setNewLocation({ name: "" });
  };

  const formatConditions = (conditions: Record<string, unknown> | null | undefined) => {
    if (!conditions || Object.keys(conditions).length === 0) return "No restrictions";
    const parts: string[] = [];
    if (conditions.employeeRole) {
      parts.push(`Role: ${(conditions.employeeRole as string).replace("_", " ")}`);
    }
    if (conditions.categoryId) {
      const cat = categories.find(c => c.id === (conditions.categoryId as number));
      parts.push(`Category: ${cat ? cat.name : `ID ${conditions.categoryId}`}`);
    }
    if (conditions.maxCost) {
      parts.push(`Max Cost: $${conditions.maxCost}`);
    }
    return parts.join(" | ");
  };

  const renderHeaderActions = () => {
    switch (activeTab) {
      case "Departments":
        return (
          <button
            onClick={() => setIsAddDeptOpen(true)}
            className="bg-[#0052CC] text-white px-5 py-2.5 rounded-[8px] text-[13px] hover:bg-[#0047B3] transition-colors flex items-center gap-2 shadow-sm font-bold cursor-pointer animate-fade-in"
          >
            <Plus size={16} /> Add Department
          </button>
        );
      case "Categories":
        return (
          <button
            onClick={() => setIsAddCatOpen(true)}
            className="bg-[#0052CC] text-white px-5 py-2.5 rounded-[8px] text-[13px] hover:bg-[#0047B3] transition-colors flex items-center gap-2 shadow-sm font-bold cursor-pointer animate-fade-in"
          >
            <Plus size={16} /> Add Category
          </button>
        );
      case "Policies":
        return (
          <button
            onClick={() => setIsAddPolicyOpen(true)}
            className="bg-[#0052CC] text-white px-5 py-2.5 rounded-[8px] text-[13px] hover:bg-[#0047B3] transition-colors flex items-center gap-2 shadow-sm font-bold cursor-pointer animate-fade-in"
          >
            <Plus size={16} /> Add Policy
          </button>
        );
      case "Locations":
        return (
          <button
            onClick={() => setIsAddLocOpen(true)}
            className="bg-[#0052CC] text-white px-5 py-2.5 rounded-[8px] text-[13px] hover:bg-[#0047B3] transition-colors flex items-center gap-2 shadow-sm font-bold cursor-pointer animate-fade-in"
          >
            <Plus size={16} /> Add Location
          </button>
        );
      default:
        return null;
    }
  };

  const searchPlaceholder =
    activeTab === "Departments" ? "Search departments..." :
    activeTab === "Categories" ? "Search categories..." :
    activeTab === "Employees" ? "Search employees..." :
    activeTab === "Locations" ? "Search locations..." :
    "Search policies...";

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-[#475569] animate-pulse font-medium text-[14px]">Loading organization data...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 animate-fade-in max-w-[1320px] mx-auto pb-24">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-[28px] font-bold text-[#0F172A]">Organization Setup</h2>
          <p className="text-[14px] text-[#475569] mt-1">
            Manage structural hierarchies, asset categories, user directory, and resource policies.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              try {
                let csv = "";
                let filename = "export.csv";
                if (activeTab === "Departments") {
                  const header = "Department,Head,Parent,Status";
                  const rows = departments.map((d) => [d.name, d.head, d.parent, d.status].map((v) => `"${v.replace(/"/g, '""')}"`).join(","));
                  csv = "\uFEFF" + [header, ...rows].join("\r\n");
                  filename = `departments-${new Date().toISOString().slice(0, 10)}.csv`;
                } else if (activeTab === "Categories") {
                  const header = "Category ID,Name,Description,Warranty Days";
                  const rows = categories.map((c) => [c.id, c.name, c.description || "", c.warrantyPeriodDays || "N/A"].map((v) => `"${v.toString().replace(/"/g, '""')}"`).join(","));
                  csv = "\uFEFF" + [header, ...rows].join("\r\n");
                  filename = `categories-${new Date().toISOString().slice(0, 10)}.csv`;
                } else if (activeTab === "Employees") {
                  const header = "Employee ID,Name,Email,Role,Status";
                  const rows = employees.map((e) => [e.id, e.name, e.email, e.role, e.status].map((v) => `"${v.toString().replace(/"/g, '""')}"`).join(","));
                  csv = "\uFEFF" + [header, ...rows].join("\r\n");
                  filename = `employees-${new Date().toISOString().slice(0, 10)}.csv`;
                } else if (activeTab === "Policies") {
                  const header = "Rule Name,Description,Type,Action,Priority,Status";
                  const rows = policies.map((p) => [p.name, p.description || "", p.ruleType, p.action, p.priority, p.isActive ? "Active" : "Inactive"].map((v) => `"${v.toString().replace(/"/g, '""')}"`).join(","));
                  csv = "\uFEFF" + [header, ...rows].join("\r\n");
                  filename = `policies-${new Date().toISOString().slice(0, 10)}.csv`;
                } else {
                  const header = "Location,Asset Count";
                  const rows = locations.map((l) => [l.name, l.assetCount].map((v) => `"${v.toString().replace(/"/g, '""')}"`).join(","));
                  csv = "\uFEFF" + [header, ...rows].join("\r\n");
                  filename = `locations-${new Date().toISOString().slice(0, 10)}.csv`;
                }

                const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                const el = document.createElement("a");
                el.href = URL.createObjectURL(blob);
                el.download = filename;
                document.body.appendChild(el);
                el.click();
                document.body.removeChild(el);
                showToast(`Exported ${activeTab} data`, "success");
              } catch {
                showToast("Export failed", "error");
              }
            }}
            className="bg-white border border-[#E2E8F0] text-[#0F172A] px-4 py-2.5 rounded-[8px] text-[13px] font-bold hover:bg-[#F8FAFC] transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Download size={16} /> Export
          </button>
          {renderHeaderActions()}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E2E8F0] flex gap-2 overflow-x-auto mb-8">
        {TABS.map((tab) => {
          const IconComp = tab.icon;
          return (
            <button
              key={tab.name}
              onClick={() => {
                setActiveTab(tab.name);
                setSearchQuery("");
                showToast(`Switched view to ${tab.name}`, "info");
              }}
              className={`pb-3 px-4 flex items-center gap-2 whitespace-nowrap transition-all border-b-2 cursor-pointer ${
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

      {/* SEARCH AND TABLE BAR */}
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
          {/* DEPARTMENTS TAB */}
          {activeTab === "Departments" && (
            <table className="w-full text-left border-collapse min-w-[700px] animate-fade-in">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F1F5F9]">
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Department</th>
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Head of Dept</th>
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Parent Dept</th>
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Status</th>
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] bg-white">
                {filteredData.departments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-[#64748B] text-[14px]">No departments found.</td>
                  </tr>
                ) : (
                  filteredData.departments.map((dept) => (
                    <tr key={dept.id} className="hover:bg-[#F8FAFC] transition-colors group">
                      <td className={`py-4 px-6 text-[14px] font-bold text-[#0F172A] flex items-center ${dept.isChild ? "pl-12" : ""}`}>
                        {dept.isChild && <div className="w-4 h-px bg-[#CBD5E1] mr-3 inline-block" />}
                        {dept.name}
                      </td>
                      <td className="py-4 px-6 text-[14px] text-[#475569] font-medium">{dept.head}</td>
                      <td className={`py-4 px-6 text-[14px] text-[#475569] ${dept.parent === "--" ? "italic opacity-60" : ""}`}>{dept.parent}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide border ${
                          dept.status === "Active" ? "bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]" : "bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]"
                        }`}>{dept.status}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setEditingDept(dept)}
                          className="text-[#64748B] hover:text-[#0052CC] p-1.5 rounded bg-white border border-transparent hover:border-[#E2E8F0] shadow-sm transition-all cursor-pointer"
                        >
                          <Edit2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* CATEGORIES TAB */}
          {activeTab === "Categories" && (
            <table className="w-full text-left border-collapse min-w-[700px] animate-fade-in">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F1F5F9]">
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Category Name</th>
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Description</th>
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Warranty Period (Days)</th>
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] bg-white">
                {filteredData.categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-[#64748B] text-[14px]">No categories found.</td>
                  </tr>
                ) : (
                  filteredData.categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-4 px-6 text-[14px] font-bold text-[#0F172A]">{cat.name}</td>
                      <td className="py-4 px-6 text-[14px] text-[#475569]">{cat.description || <span className="italic text-[#94A3B8]">No description</span>}</td>
                      <td className="py-4 px-6 text-[14px] text-[#475569] font-mono">{cat.warrantyPeriodDays ? `${cat.warrantyPeriodDays} Days` : "N/A"}</td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setEditingCategory(cat)}
                          className="text-[#64748B] hover:text-[#0052CC] p-1.5 rounded bg-white border border-transparent hover:border-[#E2E8F0] shadow-sm transition-all cursor-pointer"
                        >
                          <Edit2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* EMPLOYEES TAB */}
          {activeTab === "Employees" && (
            <table className="w-full text-left border-collapse min-w-[800px] animate-fade-in">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F1F5F9]">
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Name</th>
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Email</th>
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Role</th>
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Status</th>
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] bg-white">
                {filteredData.employees.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-[#64748B] text-[14px]">No employees found.</td>
                  </tr>
                ) : (
                  filteredData.employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-4 px-6 text-[14px] font-bold text-[#0F172A]">{emp.name}</td>
                      <td className="py-4 px-6 text-[14px] text-[#475569] font-mono">{emp.email}</td>
                      <td className="py-4 px-6 text-[14px]">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                          emp.role === "admin" ? "bg-red-100 text-red-800" :
                          emp.role === "asset_manager" ? "bg-blue-100 text-blue-800" :
                          emp.role === "department_head" ? "bg-purple-100 text-purple-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>{emp.role.replace("_", " ")}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide border ${
                          emp.status === "active" ? "bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]" : "bg-red-50 text-red-700 border-red-200"
                        }`}>{emp.status === "active" ? "Active" : "Inactive"}</span>
                      </td>
                      <td className="py-4 px-6 text-right flex items-center justify-end gap-2 h-14">
                        <select
                          value={emp.role}
                          onChange={(e) => handlePromoteEmployee(emp.id, e.target.value)}
                          className="bg-white border border-[#CBD5E1] rounded px-2.5 py-1.5 text-[12px] text-[#0F172A] focus:outline-none focus:border-[#0052CC] cursor-pointer"
                        >
                          <option value="employee">Employee</option>
                          <option value="department_head">Dept Head</option>
                          <option value="asset_manager">Asset Manager</option>
                        </select>
                        {emp.status === "active" && (
                          <button
                            onClick={() => handleDeactivateEmployee(emp.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded px-2.5 py-1.5 text-[12px] font-bold cursor-pointer transition-colors"
                          >
                            Deactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* LOCATIONS TAB */}
          {activeTab === "Locations" && (
            <table className="w-full text-left border-collapse min-w-[500px] animate-fade-in">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F1F5F9]">
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Location Name</th>
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Active Assets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] bg-white">
                {filteredData.locations.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="p-8 text-center text-[#64748B] text-[14px]">No locations found.</td>
                  </tr>
                ) : (
                  filteredData.locations.map((loc, i) => (
                    <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-4 px-6 text-[14px] font-bold text-[#0F172A] flex items-center gap-2">
                        <MapPin size={16} className="text-[#0052CC]" />
                        {loc.name}
                      </td>
                      <td className="py-4 px-6 text-[14px] text-[#475569] font-mono">{loc.assetCount} Asset(s)</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* POLICIES TAB */}
          {activeTab === "Policies" && (
            <table className="w-full text-left border-collapse min-w-[800px] animate-fade-in">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F1F5F9]">
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Policy Name</th>
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Rule Type</th>
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Conditions</th>
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Action</th>
                  <th className="py-3 px-6 text-[12px] text-[#475569] uppercase tracking-wider font-bold">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] bg-white">
                {filteredData.policies.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-[#64748B] text-[14px]">No policies defined.</td>
                  </tr>
                ) : (
                  filteredData.policies.map((p) => (
                    <tr key={p.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-4 px-6">
                        <div className="text-[14px] font-bold text-[#0F172A]">{p.name}</div>
                        <div className="text-[12px] text-[#64748B] mt-0.5">{p.description}</div>
                      </td>
                      <td className="py-4 px-6 text-[14px] text-[#475569] font-mono uppercase text-[12px]">{p.ruleType}</td>
                      <td className="py-4 px-6 text-[13px] text-[#475569] font-medium">{formatConditions(p.conditions)}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                          p.action === "allow" ? "bg-green-100 text-green-800" :
                          p.action === "deny" ? "bg-red-100 text-red-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>{p.action.replace("_", " ")}</span>
                      </td>
                      <td className="py-4 px-6 text-[14px] text-[#475569] font-mono">{p.priority}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 border-t border-[#E2E8F0] flex items-center justify-between bg-white text-[#64748B] text-[12px] font-semibold">
          <div>
            Showing {
              activeTab === "Departments" ? filteredData.departments.length :
              activeTab === "Categories" ? filteredData.categories.length :
              activeTab === "Employees" ? filteredData.employees.length :
              activeTab === "Policies" ? filteredData.policies.length :
              filteredData.locations.length
            } item(s)
          </div>
        </div>
      </div>

      {/* ADD DEPARTMENT MODAL */}
      <Modal isOpen={isAddDeptOpen} onClose={() => setIsAddDeptOpen(false)} title="Create New Department">
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
            <button
              type="button"
              onClick={() => setIsAddDeptOpen(false)}
              className="px-4 py-2.5 rounded-[6px] text-[13px] font-bold border border-[#CBD5E1] text-[#475569] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-[6px] text-[13px] bg-[#0052CC] text-white hover:bg-[#0047B3] font-bold shadow-sm transition-colors cursor-pointer"
            >
              Save Department
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT DEPARTMENT MODAL */}
      <Modal isOpen={editingDept !== null} onClose={() => setEditingDept(null)} title="Edit Department">
        {editingDept && (
          <form onSubmit={handleUpdateDepartment} className="space-y-4">
            <div>
              <label className="block text-[13px] font-bold text-[#475569] mb-1" htmlFor="edit-dept-name">Department Name</label>
              <input
                id="edit-dept-name"
                type="text"
                value={editingDept.name}
                onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
                className="w-full bg-white border border-[#CBD5E1] rounded-[6px] px-3 py-2 text-[14px] text-[#0F172A] focus:border-[#0052CC] outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#475569] mb-1" htmlFor="edit-dept-status">Status</label>
              <select
                id="edit-dept-status"
                value={editingDept.status}
                onChange={(e) => setEditingDept({ ...editingDept, status: e.target.value })}
                className="w-full bg-white border border-[#CBD5E1] rounded-[6px] px-3 py-2 text-[14px] text-[#0F172A] focus:border-[#0052CC] outline-none transition-colors cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0] mt-6">
              <button
                type="button"
                onClick={() => setEditingDept(null)}
                className="px-4 py-2.5 rounded-[6px] text-[13px] font-bold border border-[#CBD5E1] text-[#475569] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-[6px] text-[13px] bg-[#0052CC] text-white hover:bg-[#0047B3] font-bold shadow-sm transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ADD CATEGORY MODAL */}
      <Modal isOpen={isAddCatOpen} onClose={() => setIsAddCatOpen(false)} title="Create New Category">
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-[#475569] mb-1" htmlFor="cat-name">Category Name</label>
            <input
              id="cat-name"
              type="text"
              placeholder="e.g. Network Terminals"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="w-full bg-white border border-[#CBD5E1] rounded-[6px] px-3 py-2 text-[14px] text-[#0F172A] focus:border-[#0052CC] outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#475569] mb-1" htmlFor="cat-desc">Description</label>
            <textarea
              id="cat-desc"
              placeholder="Brief description of category items"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              className="w-full bg-white border border-[#CBD5E1] rounded-[6px] px-3 py-2 text-[14px] text-[#0F172A] focus:border-[#0052CC] outline-none transition-colors h-20"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#475569] mb-1" htmlFor="cat-warranty">Warranty Period (Days)</label>
            <input
              id="cat-warranty"
              type="number"
              placeholder="e.g. 730"
              value={newCategory.warrantyPeriodDays}
              onChange={(e) => setNewCategory({ ...newCategory, warrantyPeriodDays: e.target.value })}
              className="w-full bg-white border border-[#CBD5E1] rounded-[6px] px-3 py-2 text-[14px] text-[#0F172A] focus:border-[#0052CC] outline-none transition-colors"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0] mt-6">
            <button
              type="button"
              onClick={() => setIsAddCatOpen(false)}
              className="px-4 py-2.5 rounded-[6px] text-[13px] font-bold border border-[#CBD5E1] text-[#475569] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-[6px] text-[13px] bg-[#0052CC] text-white hover:bg-[#0047B3] font-bold shadow-sm transition-colors cursor-pointer"
            >
              Save Category
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT CATEGORY MODAL */}
      <Modal isOpen={editingCategory !== null} onClose={() => setEditingCategory(null)} title="Edit Category">
        {editingCategory && (
          <form onSubmit={handleUpdateCategory} className="space-y-4">
            <div>
              <label className="block text-[13px] font-bold text-[#475569] mb-1" htmlFor="edit-cat-name">Category Name</label>
              <input
                id="edit-cat-name"
                type="text"
                value={editingCategory.name}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                className="w-full bg-white border border-[#CBD5E1] rounded-[6px] px-3 py-2 text-[14px] text-[#0F172A] focus:border-[#0052CC] outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#475569] mb-1" htmlFor="edit-cat-desc">Description</label>
              <textarea
                id="edit-cat-desc"
                value={editingCategory.description || ""}
                onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                className="w-full bg-white border border-[#CBD5E1] rounded-[6px] px-3 py-2 text-[14px] text-[#0F172A] focus:border-[#0052CC] outline-none transition-colors h-20"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#475569] mb-1" htmlFor="edit-cat-warranty">Warranty Period (Days)</label>
              <input
                id="edit-cat-warranty"
                type="number"
                value={editingCategory.warrantyPeriodDays || ""}
                onChange={(e) => setEditingCategory({ ...editingCategory, warrantyPeriodDays: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full bg-white border border-[#CBD5E1] rounded-[6px] px-3 py-2 text-[14px] text-[#0F172A] focus:border-[#0052CC] outline-none transition-colors"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0] mt-6">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="px-4 py-2.5 rounded-[6px] text-[13px] font-bold border border-[#CBD5E1] text-[#475569] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-[6px] text-[13px] bg-[#0052CC] text-white hover:bg-[#0047B3] font-bold shadow-sm transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ADD LOCATION MODAL */}
      <Modal isOpen={isAddLocOpen} onClose={() => setIsAddLocOpen(false)} title="Register New Location Option">
        <form onSubmit={handleAddLocation} className="space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-[#475569] mb-1" htmlFor="loc-name">Location Name</label>
            <input
              id="loc-name"
              type="text"
              placeholder="e.g. Pune, DC-03"
              value={newLocation.name}
              onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
              className="w-full bg-white border border-[#CBD5E1] rounded-[6px] px-3 py-2 text-[14px] text-[#0F172A] focus:border-[#0052CC] outline-none transition-colors"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0] mt-6">
            <button
              type="button"
              onClick={() => setIsAddLocOpen(false)}
              className="px-4 py-2.5 rounded-[6px] text-[13px] font-bold border border-[#CBD5E1] text-[#475569] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-[6px] text-[13px] bg-[#0052CC] text-white hover:bg-[#0047B3] font-bold shadow-sm transition-colors cursor-pointer"
            >
              Register Location
            </button>
          </div>
        </form>
      </Modal>

      {/* ADD POLICY MODAL */}
      <Modal isOpen={isAddPolicyOpen} onClose={() => setIsAddPolicyOpen(false)} title="Create New Allocation Policy">
        <form onSubmit={handleAddPolicy} className="space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-[#475569] mb-1" htmlFor="policy-name">Policy Name</label>
            <input
              id="policy-name"
              type="text"
              placeholder="e.g. High Value Electronics Restriction"
              value={newPolicy.name}
              onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
              className="w-full bg-white border border-[#CBD5E1] rounded-[6px] px-3 py-2 text-[14px] text-[#0F172A] focus:border-[#0052CC] outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#475569] mb-1" htmlFor="policy-desc">Description</label>
            <textarea
              id="policy-desc"
              placeholder="Describe the rule scope and action"
              value={newPolicy.description}
              onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
              className="w-full bg-white border border-[#CBD5E1] rounded-[6px] px-3 py-2 text-[14px] text-[#0F172A] focus:border-[#0052CC] outline-none transition-colors h-16"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-[#475569] mb-1" htmlFor="policy-type">Rule Type</label>
              <select
                id="policy-type"
                value={newPolicy.ruleType}
                onChange={(e) => setNewPolicy({ ...newPolicy, ruleType: e.target.value })}
                className="w-full bg-white border border-[#CBD5E1] rounded-[6px] px-3 py-2 text-[14px] text-[#0F172A] focus:border-[#0052CC] outline-none transition-colors cursor-pointer"
              >
                <option value="allocate">allocate</option>
                <option value="booking">booking</option>
                <option value="maintenance">maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#475569] mb-1" htmlFor="policy-action">Action</label>
              <select
                id="policy-action"
                value={newPolicy.action}
                onChange={(e) => setNewPolicy({ ...newPolicy, action: e.target.value })}
                className="w-full bg-white border border-[#CBD5E1] rounded-[6px] px-3 py-2 text-[14px] text-[#0F172A] focus:border-[#0052CC] outline-none transition-colors cursor-pointer"
              >
                <option value="allow">allow</option>
                <option value="deny">deny</option>
                <option value="require_approval">require_approval</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-[#475569] mb-1" htmlFor="policy-priority">Priority</label>
              <input
                id="policy-priority"
                type="number"
                placeholder="0"
                value={newPolicy.priority}
                onChange={(e) => setNewPolicy({ ...newPolicy, priority: e.target.value })}
                className="w-full bg-white border border-[#CBD5E1] rounded-[6px] px-3 py-2 text-[14px] text-[#0F172A] focus:border-[#0052CC] outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#475569] mb-1" htmlFor="policy-role">Target Role</label>
              <select
                id="policy-role"
                value={newPolicy.employeeRole}
                onChange={(e) => setNewPolicy({ ...newPolicy, employeeRole: e.target.value })}
                className="w-full bg-white border border-[#CBD5E1] rounded-[6px] px-3 py-2 text-[14px] text-[#0F172A] focus:border-[#0052CC] outline-none transition-colors cursor-pointer"
              >
                <option value="">All Roles</option>
                <option value="employee">Employee</option>
                <option value="department_head">Dept Head</option>
                <option value="asset_manager">Asset Manager</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-[#475569] mb-1" htmlFor="policy-cat">Target Category</label>
              <select
                id="policy-cat"
                value={newPolicy.categoryId}
                onChange={(e) => setNewPolicy({ ...newPolicy, categoryId: e.target.value })}
                className="w-full bg-white border border-[#CBD5E1] rounded-[6px] px-3 py-2 text-[14px] text-[#0F172A] focus:border-[#0052CC] outline-none transition-colors cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#475569] mb-1" htmlFor="policy-cost">Max Acquisition Cost ($)</label>
              <input
                id="policy-cost"
                type="number"
                placeholder="e.g. 2000"
                value={newPolicy.maxCost}
                onChange={(e) => setNewPolicy({ ...newPolicy, maxCost: e.target.value })}
                className="w-full bg-white border border-[#CBD5E1] rounded-[6px] px-3 py-2 text-[14px] text-[#0F172A] focus:border-[#0052CC] outline-none transition-colors"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0] mt-6">
            <button
              type="button"
              onClick={() => setIsAddPolicyOpen(false)}
              className="px-4 py-2.5 rounded-[6px] text-[13px] font-bold border border-[#CBD5E1] text-[#475569] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-[6px] text-[13px] bg-[#0052CC] text-white hover:bg-[#0047B3] font-bold shadow-sm transition-colors cursor-pointer"
            >
              Save Policy
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
