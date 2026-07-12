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

  if (loading) return <div className="flex-1 flex items-center justify-center"><div className="text-text-secondary animate-pulse">Loading...</div></div>;

  return (
    <div className="flex-1 overflow-y-auto p-container animate-fade-in">
      <div className="mb-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-comfortable mb-standard">
          <div>
            <h2 className="text-headline-lg text-text-primary">Organization Setup</h2>
            <p className="text-body-md text-text-secondary mt-1">Manage structural hierarchies and foundational data.</p>
          </div>
        </div>

        <div className="border-b border-border-subtle flex gap-comfortable overflow-x-auto">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`pb-2 border-b-2 text-label-md px-2 whitespace-nowrap transition-colors ${
                tab === t.key ? 'border-primary text-primary font-bold' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-subtle'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

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
    </div>
  );
}
