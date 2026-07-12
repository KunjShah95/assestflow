'use client';

import { useState, useEffect } from 'react';
import { departmentService } from '@/services/department.service';
import { employeeService } from '@/services/employee.service';
import { assetService } from '@/services/asset.service';
import type { Department } from '@/types/department';
import type { Employee } from '@/types/employee';
import type { AssetCategory } from '@/types/asset';

type Tab = 'departments' | 'categories' | 'employees' | 'add';

export default function OrganizationSetupPage() {
  const [tab, setTab] = useState<Tab>('departments');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states for "+ Add"
  const [addType, setAddType] = useState<'department' | 'category' | 'employee'>('department');
  const [newName, setNewName] = useState('');
  const [newHead, setNewHead] = useState('');
  const [newParent, setNewParent] = useState('');
  const [newStatus, setNewStatus] = useState('active');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('employee');

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
    { key: 'add', label: '+ Add' },
  ];

  // Specific wireframe departments data
  const wireframeDepartments = [
    { name: 'Engineering', head: 'aditi sen', parent: '–', status: 'active' },
    { name: 'Facilities', head: 'rohan mehta', parent: '–', status: 'active' },
    { name: 'Field Ops (temp)', head: 'sunil paul', parent: 'Field Ops', status: 'inactive' },
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    if (addType === 'department') {
      const newDept: Department = {
        id: Date.now(),
        name: newName,
        status: newStatus as 'active' | 'inactive',
        description: null,
        parentDepartmentId: null,
        headEmployeeId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDepartments([...departments, newDept]);
    } else if (addType === 'category') {
      const newCat: AssetCategory = {
        id: Date.now(),
        name: newName,
        status: 'active',
        description: null,
      };
      setCategories([...categories, newCat]);
    } else if (addType === 'employee') {
      const newEmp: Employee = {
        id: Date.now(),
        name: newName,
        email: newEmail,
        role: newRole,
        departmentId: null,
        status: 'active',
      };
      setEmployees([...employees, newEmp]);
    }

    // Reset fields and toggle tab
    setNewName('');
    setNewHead('');
    setNewParent('');
    setNewEmail('');
    setTab('departments');
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-text-secondary animate-pulse font-medium">Loading organization metadata...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 animate-fade-in max-w-[1200px] mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-headline-lg font-bold text-text-primary">AssetFlow</h1>
        <p className="text-body-sm text-text-secondary mt-1">Organization setup (Admin only)</p>

        {/* Tab buttons */}
        <div className="border-b-2 border-border flex gap-6 overflow-x-auto mt-6">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`pb-3 border-b-3 text-label-md px-2 font-bold whitespace-nowrap transition-colors cursor-pointer ${
                tab === t.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab !== 'add' ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-border-subtle shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-subtle bg-surface-container-low text-label-md text-text-secondary uppercase tracking-wider font-semibold">
                  {tab === 'departments' && (
                    <>
                      <th className="py-4 px-6">Department</th>
                      <th className="py-4 px-6">Head</th>
                      <th className="py-4 px-6">Parent Dept.</th>
                      <th className="py-4 px-6">Status</th>
                    </>
                  )}
                  {tab === 'categories' && (
                    <>
                      <th className="py-4 px-6">Category Name</th>
                      <th className="py-4 px-6">Status</th>
                    </>
                  )}
                  {tab === 'employees' && (
                    <>
                      <th className="py-4 px-6">Name</th>
                      <th className="py-4 px-6">Email</th>
                      <th className="py-4 px-6">Role</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-body-md text-text-primary bg-surface-container-lowest">
                {tab === 'departments' && (
                  <>
                    {/* Wireframe-specific departments */}
                    {wireframeDepartments.map((d, i) => (
                      <tr key={`wf-dept-${i}`} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-4 px-6 font-bold">{d.name}</td>
                        <td className="py-4 px-6 text-text-secondary">{d.head}</td>
                        <td className="py-4 px-6 text-text-secondary font-mono">{d.parent}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                              d.status === 'active'
                                ? 'bg-success/10 text-success border-success/20'
                                : 'bg-surface-variant text-text-secondary border-border-subtle'
                            }`}
                          >
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {/* Dynamically created departments */}
                    {departments
                      .filter(d => !wireframeDepartments.some(wd => wd.name === d.name))
                      .map(d => (
                        <tr key={d.id} className="hover:bg-surface-container-low transition-colors">
                          <td className="py-4 px-6 font-bold">{d.name}</td>
                          <td className="py-4 px-6 text-text-secondary">aditi sen</td>
                          <td className="py-4 px-6 text-text-secondary font-mono">–</td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                                d.status === 'active'
                                  ? 'bg-success/10 text-success border-success/20'
                                  : 'bg-surface-variant text-text-secondary border-border-subtle'
                              }`}
                            >
                              {d.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </>
                )}

                {tab === 'categories' &&
                  categories.map(c => (
                    <tr key={c.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-4 px-6 font-bold">{c.name}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase border bg-success/10 text-success border-success/20">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}

                {tab === 'employees' &&
                  employees.map(e => (
                    <tr key={e.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-4 px-6 font-bold">{e.name}</td>
                      <td className="py-4 px-6 text-text-secondary">{e.email}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase border bg-info/10 text-info border-info/20">
                          {e.role}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Bottom notice for Screen 3 */}
          {tab === 'departments' && (
            <div className="bg-surface-container-low px-6 py-4 border-t border-border-subtle text-body-sm text-text-secondary italic">
              Deleting a department here also clears its parent in Screen 5 & 6
            </div>
          )}
        </div>
      ) : (
        /* "+ Add" Form Panel */
        <div className="bg-surface-container-lowest rounded-2xl border border-border-subtle p-8 shadow-sm">
          <h2 className="text-headline-md font-bold text-text-primary mb-6">Add New Organization Node</h2>
          <form onSubmit={handleAddSubmit} className="space-y-6 max-w-lg">
            <div className="space-y-2">
              <label className="text-label-md font-bold text-text-secondary block">Type</label>
              <div className="flex gap-4">
                {(['department', 'category', 'employee'] as const).map(type => (
                  <label key={type} className="flex items-center gap-2 text-body-md text-text-primary cursor-pointer">
                    <input
                      type="radio"
                      name="addType"
                      checked={addType === type}
                      onChange={() => setAddType(type)}
                      className="accent-primary"
                    />
                    <span className="capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-label-md font-bold text-text-secondary block" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder={`Name of the ${addType}`}
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                required
              />
            </div>

            {addType === 'department' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-label-md font-bold text-text-secondary block" htmlFor="head">
                    Department Head
                  </label>
                  <input
                    id="head"
                    type="text"
                    placeholder="e.g. John Doe"
                    value={newHead}
                    onChange={e => setNewHead(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-label-md font-bold text-text-secondary block" htmlFor="parent">
                    Parent Department
                  </label>
                  <input
                    id="parent"
                    type="text"
                    placeholder="Leave empty if none"
                    value={newParent}
                    onChange={e => setNewParent(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-label-md font-bold text-text-secondary block" htmlFor="status">
                    Status
                  </label>
                  <select
                    id="status"
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </>
            )}

            {addType === 'employee' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-label-md font-bold text-text-secondary block" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="employee@company.com"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-label-md font-bold text-text-secondary block" htmlFor="role">
                    Role
                  </label>
                  <select
                    id="role"
                    value={newRole}
                    onChange={e => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="employee">Employee</option>
                    <option value="department_head">Department Head</option>
                    <option value="asset_manager">Asset Manager</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              className="bg-primary hover:bg-surface-tint text-on-primary text-label-md px-6 py-2.5 rounded-lg font-bold shadow-md transition-colors"
            >
              Add Node
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
