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
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [toEmployeeId, setToEmployeeId] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    assetService.list({ status: 'available' }).then(r => setAssets(r.value || [])).catch(() => {});
    employeeService.list().then(setEmployees).catch(() => {});
  }, []);

  const selectedAsset = assets.find(a => a.id === parseInt(selectedAssetId));

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAssetId || !toEmployeeId) { setMessage('Select asset and employee'); return; }
    setLoading(true);
    try {
      await allocationService.assign({ assetId: parseInt(selectedAssetId), toEmployeeId: parseInt(toEmployeeId), notes: reason || undefined });
      setMessage('Asset allocated successfully!');
      setSelectedAssetId(''); setToEmployeeId(''); setReason('');
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Allocation failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="flex-1 overflow-y-auto bg-surface animate-fade-in">
      <div className="max-w-6xl mx-auto p-container md:p-8 space-y-comfortable">
        <div className="flex justify-between items-end pb-4 border-b border-border-subtle">
          <div>
            <h1 className="text-headline-lg text-text-primary">Allocation & Transfer</h1>
            <p className="text-body-sm text-text-secondary mt-1">Assign assets to employees and track ownership.</p>
          </div>
        </div>

        {message && (
          <div className={`p-3 rounded text-body-sm ${message.includes('success') ? 'bg-success/10 text-success border border-success/20' : 'bg-error/10 text-error border border-error/20'}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-container">
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-lg border border-border-subtle p-6 shadow-sm">
            <h2 className="text-headline-md text-text-primary mb-6">New Allocation</h2>
            <form className="space-y-5" onSubmit={handleAssign}>
              <div className="space-y-1.5">
                <label className="text-label-md text-text-primary block" htmlFor="asset-select">Asset</label>
                <select id="asset-select" className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded text-body-md text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none" value={selectedAssetId} onChange={e => setSelectedAssetId(e.target.value)}>
                  <option value="">Select available asset...</option>
                  {assets.map(a => <option key={a.id} value={a.id}>{a.tag} – {a.name}</option>)}
                </select>
              </div>

              {selectedAsset && (
                <div className="bg-surface-container-low p-3 rounded flex items-center gap-3">
                  <span className="material-symbols-outlined text-text-secondary">check_circle</span>
                  <span className="text-body-sm"><strong>{selectedAsset.tag}</strong> – {selectedAsset.name} ({selectedAsset.categoryName || 'N/A'})</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-label-md text-text-primary block" htmlFor="emp-select">Assign To</label>
                <select id="emp-select" className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded text-body-md text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none" value={toEmployeeId} onChange={e => setToEmployeeId(e.target.value)}>
                  <option value="">Select employee...</option>
                  {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name} ({emp.email})</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-label-md text-text-primary block" htmlFor="notes">Notes</label>
                <textarea id="notes" className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded text-body-md text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none" rows={3} value={reason} onChange={e => setReason(e.target.value)} placeholder="Optional notes..." />
              </div>

              <button type="submit" disabled={loading} className="bg-primary hover:bg-primary-container text-on-primary text-label-md py-2 px-6 rounded transition-colors shadow-sm disabled:opacity-50">
                {loading ? 'Allocating...' : 'Allocate Asset'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1 bg-surface-container-lowest rounded-lg border border-border-subtle p-5 shadow-sm">
            <h3 className="text-label-md uppercase tracking-wider text-text-secondary mb-4 border-b border-border-subtle pb-2">Quick Info</h3>
            <div className="space-y-3 text-body-sm">
              <p><span className="text-text-secondary">Available Assets:</span> <span className="font-medium text-text-primary">{assets.length}</span></p>
              <p><span className="text-text-secondary">Employees:</span> <span className="font-medium text-text-primary">{employees.length}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
