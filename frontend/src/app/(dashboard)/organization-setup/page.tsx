<<<<<<< HEAD
"use client";

import React, { useState } from "react";
import Modal from "@/components/Modal";
import { useToast } from "@/components/ToastProvider";

interface Department {
  name: string;
  head: string;
  parent: string;
  status: string;
  isChild: boolean;
}

export default function OrganizationSetupPage() {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("Departments");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newDept, setNewDept] = useState({
    name: "",
    head: "",
    parent: "--",
    status: "Active",
  });

  const [departments, setDepartments] = useState<Department[]>([
    { name: "Engineering", head: "Aditi Rao", parent: "--", status: "Active", isChild: false },
    { name: "Facilities", head: "Rohan Mehta", parent: "--", status: "Active", isChild: false },
    { name: "Field Ops (East)", head: "Sana Iqbal", parent: "Field Ops", status: "Inactive", isChild: true },
    { name: "Field Ops (West)", head: "Marcus Johnson", parent: "Field Ops", status: "Active", isChild: true },
    { name: "Human Resources", head: "Elena Rodriguez", parent: "--", status: "Active", isChild: false },
  ]);

  const filteredDepartments = departments.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.head.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.name.trim()) {
      showToast("Please enter a department name", "error");
      return;
    }

    const created: Department = {
      name: newDept.name,
      head: newDept.head || "TBD",
      parent: newDept.parent,
      status: newDept.status,
      isChild: newDept.parent !== "--",
    };

    setDepartments([...departments, created]);
    showToast(`Added department: ${created.name}`, "success");
    setIsAddModalOpen(false);
    setNewDept({ name: "", head: "", parent: "--", status: "Active" });
  };
=======
'use client';

import { useState, useEffect } from 'react';
import { departmentService } from '@/services/department.service';
import { employeeService } from '@/services/employee.service';
import { assetService } from '@/services/asset.service';
import type { Department } from '@/types/department';
import type { Employee } from '@/types/employee';
import type { AssetCategory } from '@/types/asset';

type Tab = 'departments' | 'categories' | 'employees';

export default function OrganizationSetupPage() {
  const [tab, setTab] = useState<Tab>('departments');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      departmentService.list(),
      employeeService.list(),
      assetService.categories(),
    ]).then(([deptRes, empRes, catRes]) => {
      setDepartments(deptRes.value || []);
      setEmployees(empRes);
      setCategories(catRes.value || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'departments', label: 'Departments' },
    { key: 'categories', label: 'Categories' },
    { key: 'employees', label: 'Employees' },
  ];
>>>>>>> 0c3e4cf95e6e6e4335d56146084439ad368addef

  if (loading) return <div className="flex-1 flex items-center justify-center"><div className="text-text-secondary animate-pulse">Loading...</div></div>;

  return (
    <div className="flex-1 overflow-y-auto p-container animate-fade-in">
      <div className="mb-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-comfortable mb-standard">
          <div>
            <h2 className="text-headline-lg text-text-primary">Organization Setup</h2>
<<<<<<< HEAD
            <p className="text-body-md text-text-secondary mt-1">
              Manage structural hierarchies and foundational data.
            </p>
          </div>
          <div className="flex items-center gap-standard">
            <button
              onClick={() => showToast("Exporting Organization Hierarchy data...", "info")}
              className="bg-surface-container-lowest border border-border-subtle text-text-primary px-4 py-2 rounded-md text-label-md hover:bg-surface-container-low transition-colors flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                download
              </span>
              Export
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary text-on-primary px-4 py-2 rounded-md text-label-md hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm font-medium"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                add
              </span>
              Add Department
            </button>
=======
            <p className="text-body-md text-text-secondary mt-1">Manage structural hierarchies and foundational data.</p>
>>>>>>> 0c3e4cf95e6e6e4335d56146084439ad368addef
          </div>
        </div>

        <div className="border-b border-border-subtle flex gap-comfortable overflow-x-auto">
<<<<<<< HEAD
          {["Departments", "Categories", "Employees", "Locations"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                showToast(`Switched view to ${tab}`, "info");
              }}
              className={`pb-2 border-b-2 text-label-md px-2 whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-text-secondary hover:text-text-primary hover:border-border-subtle"
=======
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`pb-2 border-b-2 text-label-md px-2 whitespace-nowrap transition-colors ${
                tab === t.key ? 'border-primary text-primary font-bold' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-subtle'
>>>>>>> 0c3e4cf95e6e6e4335d56146084439ad368addef
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

<<<<<<< HEAD
      {/* Dynamic Tab Content */}
      {activeTab === "Departments" ? (
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-compact w-full sm:w-auto">
              <button
                onClick={() => showToast("Filtering hierarchy list", "info")}
                className="p-2 border border-border-subtle rounded-md text-text-secondary hover:bg-surface-container-low transition-colors bg-surface-container-lowest"
              >
                <span className="material-symbols-outlined text-sm block">filter_list</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-subtle bg-surface-container-low">
                  <th className="py-3 px-standard text-label-md text-text-secondary uppercase tracking-wider font-semibold">
                    Department
                  </th>
                  <th className="py-3 px-standard text-label-md text-text-secondary uppercase tracking-wider font-semibold">
                    Head
                  </th>
                  <th className="py-3 px-standard text-label-md text-text-secondary uppercase tracking-wider font-semibold">
                    Parent Dept
                  </th>
                  <th className="py-3 px-standard text-label-md text-text-secondary uppercase tracking-wider font-semibold">
                    Status
                  </th>
                  <th className="py-3 px-standard text-label-md text-text-secondary uppercase tracking-wider font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-body-sm text-text-primary bg-surface-container-lowest">
                {filteredDepartments.map((dept, i) => (
                  <tr
                    key={i}
                    onClick={() =>
                      showToast(`Department details: ${dept.name} (Head: ${dept.head})`, "info")
                    }
                    className="hover:bg-surface-container-low transition-colors group cursor-pointer"
                  >
                    <td
                      className={`py-3 px-standard font-medium ${
                        dept.isChild ? "pl-comfortable flex items-center gap-2" : ""
                      }`}
                    >
                      {dept.isChild && (
                        <span className="w-4 h-px bg-border-subtle inline-block" />
                      )}
                      {dept.name}
                    </td>
                    <td className="py-3 px-standard text-text-secondary">{dept.head}</td>
                    <td
                      className={`py-3 px-standard text-text-secondary ${
                        dept.parent === "--" ? "italic" : ""
                      }`}
                    >
                      {dept.parent}
                    </td>
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          showToast(`Editing department ${dept.name}`, "info");
                        }}
                        className="text-text-secondary hover:text-primary p-1"
                      >
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
            <div>
              Showing {filteredDepartments.length} of {departments.length} departments
            </div>
            <div className="flex items-center gap-compact">
              <button
                className="p-1 rounded hover:bg-surface-container-low disabled:opacity-50"
                disabled
              >
                <span className="material-symbols-outlined text-sm block">chevron_left</span>
              </button>
              <span className="px-2">Page 1 of 1</span>
              <button
                className="p-1 rounded hover:bg-surface-container-low disabled:opacity-50"
                disabled
              >
                <span className="material-symbols-outlined text-sm block">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-lg border border-border-subtle p-8 text-center">
          <span className="material-symbols-outlined text-[48px] text-primary mb-3">
            folder_managed
          </span>
          <h3 className="text-headline-sm text-text-primary mb-1">
            {activeTab} Management
          </h3>
          <p className="text-body-sm text-text-secondary max-w-md mx-auto">
            Configured hierarchies for {activeTab.toLowerCase()} are synced directly with the Asset
            Directory and Allocation engine.
          </p>
        </div>
      )}

      <p className="mt-comfortable text-text-secondary text-body-sm italic text-center">
        Editing a department here also drives the picklist in Asset Registrations.
      </p>

      {/* Add Department Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Organization Department"
      >
        <form onSubmit={handleAddDepartment} className="space-y-4">
          <div>
            <label className="block text-label-md mb-1" htmlFor="dept-name">
              Department Name
            </label>
            <input
              id="dept-name"
              type="text"
              placeholder="e.g. AI &amp; Research"
              value={newDept.name}
              onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
              className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-label-md mb-1" htmlFor="dept-head">
              Department Head (Lead)
            </label>
            <input
              id="dept-head"
              type="text"
              placeholder="e.g. Dr. Kavita Sharma"
              value={newDept.head}
              onChange={(e) => setNewDept({ ...newDept, head: e.target.value })}
              className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md focus:border-primary outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-label-md mb-1" htmlFor="dept-parent">
                Parent Department
              </label>
              <select
                id="dept-parent"
                value={newDept.parent}
                onChange={(e) => setNewDept({ ...newDept, parent: e.target.value })}
                className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md"
              >
                <option value="--">None (Top Level)</option>
                <option value="Engineering">Engineering</option>
                <option value="Field Ops">Field Ops</option>
                <option value="Facilities">Facilities</option>
              </select>
            </div>
            <div>
              <label className="block text-label-md mb-1" htmlFor="dept-status">
                Status
              </label>
              <select
                id="dept-status"
                value={newDept.status}
                onChange={(e) => setNewDept({ ...newDept, status: e.target.value })}
                className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded text-label-md border border-border-subtle hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded text-label-md bg-primary text-on-primary hover:bg-primary/90 font-medium"
            >
              Save Department
            </button>
          </div>
        </form>
      </Modal>
=======
      <div className="bg-surface-container-lowest rounded-lg border border-border-subtle shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-container-low">
                {tab === 'departments' && <>
                  <th className="py-3 px-standard text-label-md text-text-secondary uppercase tracking-wider font-semibold">Name</th>
                  <th className="py-3 px-standard text-label-md text-text-secondary uppercase tracking-wider font-semibold">Status</th>
                </>}
                {tab === 'categories' && <>
                  <th className="py-3 px-standard text-label-md text-text-secondary uppercase tracking-wider font-semibold">Name</th>
                  <th className="py-3 px-standard text-label-md text-text-secondary uppercase tracking-wider font-semibold">Status</th>
                </>}
                {tab === 'employees' && <>
                  <th className="py-3 px-standard text-label-md text-text-secondary uppercase tracking-wider font-semibold">Name</th>
                  <th className="py-3 px-standard text-label-md text-text-secondary uppercase tracking-wider font-semibold">Email</th>
                  <th className="py-3 px-standard text-label-md text-text-secondary uppercase tracking-wider font-semibold">Role</th>
                </>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-body-sm text-text-primary bg-surface-container-lowest">
              {tab === 'departments' && departments.map(d => (
                <tr key={d.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3 px-standard font-medium">{d.name}</td>
                  <td className="py-3 px-standard">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${
                      d.status === 'active' ? 'bg-success/10 text-success border-success/20' : 'bg-surface-variant text-text-secondary border-border-subtle'
                    }`}>{d.status}</span>
                  </td>
                </tr>
              ))}

              {tab === 'categories' && categories.map(c => (
                <tr key={c.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3 px-standard font-medium">{c.name}</td>
                  <td className="py-3 px-standard">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border bg-success/10 text-success border-success/20">{c.status}</span>
                  </td>
                </tr>
              ))}

              {tab === 'employees' && employees.map(e => (
                <tr key={e.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3 px-standard font-medium">{e.name}</td>
                  <td className="py-3 px-standard text-text-secondary">{e.email}</td>
                  <td className="py-3 px-standard">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border bg-info/10 text-info border-info/20">{e.role}</span>
                  </td>
                </tr>
              ))}

              {tab === 'departments' && departments.length === 0 && <tr><td colSpan={2} className="p-4 text-center text-text-secondary">No departments</td></tr>}
              {tab === 'categories' && categories.length === 0 && <tr><td colSpan={2} className="p-4 text-center text-text-secondary">No categories</td></tr>}
              {tab === 'employees' && employees.length === 0 && <tr><td colSpan={3} className="p-4 text-center text-text-secondary">No employees</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
>>>>>>> 0c3e4cf95e6e6e4335d56146084439ad368addef
    </div>
  );
}
