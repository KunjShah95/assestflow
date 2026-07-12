"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { useApiError } from "@/hooks/useApiError";
import { departmentService } from "@/services/department.service";
import { Search, Download, Plus, FolderTree, Edit2, Shield, MapPin, Users, Settings } from "lucide-react";

interface Department {
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
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const depts = await departmentService.list();
        const mapped: Department[] = (depts || []).map((d, index) => ({
          id: d.id || index,
          name: d.name || "",
          head: d.headEmployeeId ? `Emp #${d.headEmployeeId}` : "TBD",
          parent: d.parentDepartmentId ? `Dept #${d.parentDepartmentId}` : "--",
          status: d.status === "active" ? "Active" : "Inactive",
          isChild: !!d.parentDepartmentId,
        }));
        setDepartments(mapped.length > 0 ? mapped : [
          { id: 1, name: "Engineering", head: "Aditi Rao", parent: "--", status: "Active", isChild: false },
          { id: 2, name: "Facilities", head: "Rohan Mehta", parent: "--", status: "Active", isChild: false },
        ]);
      } catch (err) {
        handleError(err, "Could not load departments");
        setDepartments([
          { id: 1, name: "Engineering", head: "Aditi Rao", parent: "--", status: "Active", isChild: false },
          { id: 2, name: "Facilities", head: "Rohan Mehta", parent: "--", status: "Active", isChild: false },
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
      const mapped: Department[] = (depts || []).map((d, index) => ({
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

  return (
    <div className="flex-1 overflow-y-auto p-8 animate-fade-in max-w-[1320px] mx-auto pb-24">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-[28px] font-bold text-[#0F172A]">Organization Setup</h2>
          <p className="text-[14px] text-[#475569] mt-1">
            Manage structural hierarchies, asset categories, and foundational enterprise data.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => showToast("Exporting Organization Hierarchy data...", "info")}
            className="bg-white border border-[#E2E8F0] text-[#0F172A] px-4 py-2.5 rounded-[8px] text-[13px] font-bold hover:bg-[#F8FAFC] transition-colors flex items-center gap-2 shadow-sm"
          >
            <Download size={16} /> Export
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#0052CC] text-white px-5 py-2.5 rounded-[8px] text-[13px] hover:bg-[#0047B3] transition-colors flex items-center gap-2 shadow-sm font-bold"
          >
            <Plus size={16} /> Add Department
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E2E8F0] flex gap-2 overflow-x-auto mb-8">
        {tabs.map((tab) => {
          const IconComp = tab.icon;
          return (
            <button 
              key={tab.name} 
              onClick={() => { setActiveTab(tab.name); showToast(`Switched view to ${tab.name}`, "info"); }}
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

      {/* Tab Content */}
      {activeTab === "Departments" ? (
        <div className="bg-white rounded-[12px] border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col">
          
          {/* Search Bar */}
          <div className="p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#F8FAFC]">
            <div className="relative w-full sm:w-[320px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
              <input 
                className="w-full pl-9 pr-3 py-2 border border-[#E2E8F0] rounded-[6px] text-[13px] text-[#0F172A] focus:outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] transition-shadow bg-white shadow-xs" 
                placeholder="Search departments..." 
                type="text" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
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
                {filteredDepartments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-[#64748B] text-[14px]">
                      No departments match your search.
                    </td>
                  </tr>
                ) : (
                  filteredDepartments.map((dept) => (
                    <tr 
                      key={dept.id} 
                      onClick={() => showToast(`Department details: ${dept.name} (Head: ${dept.head})`, "info")}
                      className="hover:bg-[#F8FAFC] transition-colors group cursor-pointer"
                    >
                      <td className={`py-4 px-6 text-[14px] font-bold text-[#0F172A] flex items-center ${dept.isChild ? "pl-12" : ""}`}>
                        {dept.isChild && <div className="w-4 h-px bg-[#CBD5E1] mr-3 inline-block" />}
                        {dept.name}
                      </td>
                      <td className="py-4 px-6 text-[14px] text-[#475569] font-medium">{dept.head}</td>
                      <td className={`py-4 px-6 text-[14px] text-[#475569] ${dept.parent === "--" ? "italic opacity-60" : ""}`}>
                        {dept.parent}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide border ${
                          dept.status === "Active" 
                            ? "bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]" 
                            : "bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]"
                        }`}>
                          {dept.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); showToast(`Editing department ${dept.name}`, "info"); }}
                          className="text-[#64748B] hover:text-[#0052CC] p-1.5 rounded bg-white border border-transparent hover:border-[#E2E8F0] shadow-sm transition-all"
                        >
                          <Edit2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-[#E2E8F0] flex items-center justify-between bg-white text-[#64748B] text-[12px] font-semibold">
            <div>Showing {filteredDepartments.length} of {departments.length} departments</div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-12 text-center shadow-sm max-w-2xl mx-auto mt-8">
          <div className="w-20 h-20 bg-[#F1F5F9] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E2E8F0]">
            <FolderTree size={32} className="text-[#0052CC]" />
          </div>
          <h3 className="text-[20px] font-bold text-[#0F172A] mb-2">{activeTab} Management</h3>
          <p className="text-[14px] text-[#475569] leading-relaxed">
            Configured hierarchies for {activeTab.toLowerCase()} are synced directly with the Asset Directory and Allocation engine.
          </p>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create New Department">
        <form onSubmit={handleAddDepartment} className="space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-[#475569] mb-1" htmlFor="dept-name">
              Department Name
            </label>
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
              onClick={() => setIsAddModalOpen(false)} 
              className="px-4 py-2.5 rounded-[6px] text-[13px] font-bold border border-[#CBD5E1] text-[#475569] hover:bg-[#F1F5F9] transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 rounded-[6px] text-[13px] bg-[#0052CC] text-white hover:bg-[#0047B3] font-bold shadow-sm transition-colors"
            >
              Save Department
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
