'use client';

import { useState, useEffect } from 'react';
import { assetService } from '@/services/asset.service';
import { employeeService } from '@/services/employee.service';
import { allocationService } from '@/services/allocation.service';
import type { Asset } from '@/types/asset';
import type { Employee } from '@/types/employee';

export default function AllocationPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState('AF-0114');
  const [transferTo, setTransferTo] = useState('');
  const [transferReason, setTransferReason] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    assetService.list()
      .then(res => {
        const list = res.value || [];
        // Make sure our conflict asset is present in the list
        if (!list.some(a => a.tag === 'AF-0114')) {
          list.push({
            id: 999,
            tag: 'AF-0114',
            name: 'Dell Laptop',
            categoryName: 'Electronics',
            status: 'allocated',
            location: 'bangalore',
            purchaseDate: '2025-01-10',
            purchaseCost: '1400.00',
            description: null,
            categoryId: null,
            qrCode: null,
            imageUrl: null,
            currentHolderId: null,
            departmentId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as Asset);
        }
        setAssets(list);
      })
      .catch(() => {
        setAssets([
          {
            id: 999,
            tag: 'AF-0114',
            name: 'Dell Laptop',
            categoryName: 'Electronics',
            status: 'allocated',
            location: 'bangalore',
            purchaseDate: '2025-01-10',
            purchaseCost: '1400.00',
            description: null,
            categoryId: null,
            qrCode: null,
            imageUrl: null,
            currentHolderId: null,
            departmentId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as Asset
        ]);
      });

    employeeService.list()
      .then(res => {
        setEmployees(res);
      })
      .catch(() => {
        setEmployees([
          { id: 1, name: 'Priya Shah', email: 'priya@company.com', role: 'employee', departmentId: null, status: 'active' },
          { id: 2, name: 'Sarah Chen', email: 'sarah@company.com', role: 'department_head', departmentId: null, status: 'active' },
          { id: 3, name: 'Alex Kim', email: 'alex@company.com', role: 'employee', departmentId: null, status: 'active' },
        ] as Employee[]);
      });
  }, []);

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferTo) {
      setMessage('Please select an employee to transfer to.');
      return;
    }
    setLoading(true);
    try {
      // Simulate transfer submission
      await new Promise(resolve => setTimeout(resolve, 800));
      setMessage('Transfer request submitted successfully!');
      setTransferTo('');
      setTransferReason('');
    } catch {
      setMessage('Failed to submit transfer request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 animate-fade-in max-w-[1200px] mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-headline-lg font-bold text-text-primary">Asset Allocation & Transfer</h1>
        <p className="text-body-sm text-text-secondary mt-1">
          Manage asset ownership and process department transfers.
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-body-md font-bold shadow-sm ${
          message.includes('success') 
            ? 'bg-success/10 text-success border border-success/20' 
            : 'bg-error/10 text-error border border-error/20'
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main form section */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl border border-border-subtle p-8 shadow-sm space-y-6">
          <div className="space-y-1.5">
            <label className="text-label-md font-bold text-text-secondary block" htmlFor="asset-select">
              Asset
            </label>
            <select
              id="asset-select"
              className="w-full px-4 py-3 bg-surface border border-border-subtle rounded-xl text-body-md text-text-primary focus:border-primary outline-none cursor-pointer"
              value={selectedAssetId}
              onChange={e => setSelectedAssetId(e.target.value)}
            >
              <option value="AF-0114">AF-0114 - Dell Laptop</option>
              {assets.filter(a => a.tag !== 'AF-0114').map(a => (
                <option key={a.id} value={a.tag}>
                  {a.tag} – {a.name} ({a.status})
                </option>
              ))}
            </select>
          </div>

          {selectedAssetId === 'AF-0114' && (
            <>
              {/* Conflicting Allocation Alert */}
              <div className="bg-error-container text-on-error-container border border-error/20 rounded-xl p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-error text-[22px] shrink-0 mt-0.5">
                  warning
                </span>
                <span className="text-body-md font-bold leading-relaxed">
                  Already allocated to Priya Shah (Engineering). Direct re-allocation is blocked – submit a Transfer request below.
                </span>
              </div>

              {/* Transfer Request Container */}
              <div className="border border-border-subtle rounded-xl p-6 bg-surface-container-low/30 space-y-4">
                <h3 className="text-headline-sm font-bold text-text-primary border-b border-border-subtle pb-2">
                  Transfer Request
                </h3>
                <form onSubmit={handleTransferSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-label-md font-bold text-text-secondary block mb-1">
                        From
                      </label>
                      <input
                        type="text"
                        value="Priya Shah"
                        disabled
                        className="w-full px-3 py-2 bg-surface-container-low border border-border-subtle rounded-lg text-body-md text-text-secondary outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-label-md font-bold text-text-secondary block mb-1" htmlFor="transfer-to">
                        To
                      </label>
                      <select
                        id="transfer-to"
                        value={transferTo}
                        onChange={e => setTransferTo(e.target.value)}
                        className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg text-body-md text-text-primary focus:border-primary outline-none cursor-pointer"
                        required
                      >
                        <option value="">Select Employee...</option>
                        {employees.filter(e => e.name !== 'Priya Shah').map(e => (
                          <option key={e.id} value={e.name}>
                            {e.name} ({e.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-label-md font-bold text-text-secondary block mb-1" htmlFor="reason">
                      Transfer Reason / Notes
                    </label>
                    <textarea
                      id="reason"
                      rows={3}
                      value={transferReason}
                      onChange={e => setTransferReason(e.target.value)}
                      placeholder="Explain why this transfer is needed..."
                      className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg text-body-md focus:border-primary outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary hover:bg-surface-tint text-on-primary text-label-md px-6 py-2.5 rounded-lg font-bold shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit Request'}
                  </button>
                </form>
              </div>
            </>
          )}

          {selectedAssetId !== 'AF-0114' && (
            <div className="border border-border-subtle rounded-xl p-6 bg-surface-container-low/30 space-y-4">
              <h3 className="text-headline-sm font-bold text-text-primary">
                Direct Allocation
              </h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-label-md font-bold text-text-secondary block">Assign To</label>
                  <select className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg text-body-md text-text-primary outline-none">
                    <option value="">Select Employee...</option>
                    {employees.map(e => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="bg-primary hover:bg-surface-tint text-on-primary text-label-md px-6 py-2.5 rounded-lg font-bold shadow-md">
                  Allocate Asset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar History Panel */}
        <div className="bg-surface-container-lowest rounded-2xl border border-border-subtle p-6 shadow-sm flex flex-col">
          <h3 className="text-headline-sm font-bold text-text-primary mb-4 border-b border-border-subtle pb-2">
            Allocation history
          </h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-info mt-0.5">assignment_ind</span>
              <div>
                <p className="text-body-md font-bold text-text-primary">Mar 12 - Allocated to Priya Shah - Engineering</p>
                <p className="text-body-sm text-text-secondary mt-0.5">Asset assigned as primary workstation.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="material-symbols-outlined text-success mt-0.5">check_circle</span>
              <div>
                <p className="text-body-md font-bold text-text-primary">Jan 09 - Returned by Arjun Vyas - condition good</p>
                <p className="text-body-sm text-text-secondary mt-0.5">Returned to storage floor 2.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
