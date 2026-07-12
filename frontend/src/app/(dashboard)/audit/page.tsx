'use client';

import { useState, useEffect } from 'react';
import { auditService } from '@/services/audit.service';
import { assetService } from '@/services/asset.service';
import type { AuditCycle, AuditResult } from '@/types/audit';
import type { Asset } from '@/types/asset';

export default function AuditPage() {
  const [cycles, setCycles] = useState<AuditCycle[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<number | null>(null);
  const [results, setResults] = useState<AuditResult[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      auditService.listCycles(),
      assetService.list(),
    ]).then(([cycleRes, assetRes]) => {
      setCycles(cycleRes.value || []);
      setAssets(assetRes.value || []);
      if ((cycleRes.value || []).length > 0) {
        setSelectedCycle(cycleRes.value[0].id);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedCycle) {
      auditService.getResults(selectedCycle).then(setResults).catch(() => {});
    }
  }, [selectedCycle]);

  const assetNameMap: Record<number, string> = {};
  assets.forEach(a => { assetNameMap[a.id] = `${a.tag} – ${a.name}`; });

  const statusStyles: Record<string, string> = {
    verified: 'text-success bg-success/10',
    discrepancy: 'text-warning bg-warning/10',
    missing: 'text-danger bg-danger/10',
  };
  const statusIcons: Record<string, string> = {
    verified: 'check_circle',
    discrepancy: 'warning',
    missing: 'error',
  };

  if (loading) return <div className="flex-1 flex items-center justify-center"><div className="text-text-secondary animate-pulse">Loading...</div></div>;

  const currentCycle = cycles.find(c => c.id === selectedCycle);

  return (
    <div className="flex-1 overflow-y-auto bg-background p-container animate-fade-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-headline-lg text-text-primary">Audit & Verification</h1>
          <p className="text-body-md text-text-secondary mt-1">Track audit cycles and asset verification status.</p>
        </div>
        <div className="flex gap-3">
          <select className="px-4 py-2 border border-border-subtle rounded bg-surface-container-lowest text-body-sm focus:border-primary outline-none" value={selectedCycle ?? ''} onChange={e => setSelectedCycle(parseInt(e.target.value) || null)}>
            <option value="">Select cycle...</option>
            {cycles.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
      </div>

      {currentCycle && (
        <div className="mb-4 p-3 bg-surface-container-low rounded-lg flex gap-4 text-body-sm">
          <span><strong>Status:</strong> {currentCycle.status}</span>
          <span><strong>Start:</strong> {new Date(currentCycle.startDate).toLocaleDateString()}</span>
          <span><strong>End:</strong> {new Date(currentCycle.endDate).toLocaleDateString()}</span>
        </div>
      )}

      <div className="bg-surface-container-lowest border border-border-subtle rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low text-label-md text-text-secondary uppercase tracking-wider border-b border-border-subtle">
              <tr>
                <th className="px-6 py-4 font-medium">Asset</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="text-body-md divide-y divide-border-subtle">
              {results.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-text-secondary">No audit results for this cycle.</td></tr>
              ) : results.map(r => (
                <tr key={r.id} className="hover:bg-surface-container transition-colors">
                  <td className="px-6 py-3 text-mono-data text-text-primary">
                    <div className="font-medium">{assetNameMap[r.assetId] || `Asset #${r.assetId}`}</div>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-md ${statusStyles[r.status] || ''}`}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{statusIcons[r.status] || 'help'}</span>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-body-sm text-text-secondary">{r.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
