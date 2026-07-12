'use client';

import { useState, useEffect } from 'react';
import { auditService } from '@/services/audit.service';
import { assetService } from '@/services/asset.service';

interface AuditItem {
  id: number;
  tag: string;
  name: string;
  reportedLocation: string;
  verification: 'Verified' | 'Missing' | 'Damaged';
}

export default function AuditPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [items, setItems] = useState<AuditItem[]>([
    {
      id: 1,
      tag: 'AF-0012',
      name: 'Dell laptop',
      reportedLocation: 'Desk 023',
      verification: 'Verified',
    },
    {
      id: 2,
      tag: 'AF-0321',
      name: 'Office chair',
      reportedLocation: 'Desk 016',
      verification: 'Missing',
    },
    {
      id: 3,
      tag: 'AF-0833',
      name: 'Monitor',
      reportedLocation: 'Desk 078',
      verification: 'Damaged',
    },
  ]);

  const handleVerificationChange = (id: number, status: AuditItem['verification']) => {
    setItems(prevItems =>
      prevItems.map(item => (item.id === id ? { ...item, verification: status } : item))
    );
  };

  const handleCloseCycle = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setMessage('Q2 Audit Cycle closed. Summary report sent to administrator.');
    } catch {
      setMessage('Failed to close audit cycle.');
    } finally {
      setLoading(false);
    }
  };

  // Count discrepancy items (Missing or Damaged)
  const discrepancyCount = items.filter(i => i.verification !== 'Verified').length;

  return (
    <div className="flex-1 overflow-y-auto p-8 animate-fade-in max-w-[1200px] mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-headline-lg font-bold text-text-primary">Asset Audit & Verification</h1>
        <p className="text-body-sm text-text-secondary mt-1">
          Perform scheduled site audits, verify equipment physical existence, and report discrepancies.
        </p>
      </div>

      {message && (
        <div className="mb-6 p-4 rounded-xl text-body-md font-bold shadow-sm bg-success/10 text-success border border-success/20">
          {message}
        </div>
      )}

      {/* Audit Cycle Overview Panel matching Screen 8 wireframe */}
      <div className="bg-[#fef3c7] border border-warning/30 rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs">
        <div>
          <h2 className="text-headline-sm font-black text-amber-900">
            Q2 Audit: Engineering dept – 148 items
          </h2>
          <p className="text-body-sm text-amber-800 font-bold mt-1">
            Auditors: A. Roy, S. Patel
          </p>
        </div>
        <span className="bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold uppercase">
          In Progress
        </span>
      </div>

      {/* Audit Items Table */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl overflow-hidden shadow-sm mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-container-low text-label-md text-text-secondary uppercase tracking-wider font-semibold">
                <th className="py-4 px-6">Asset</th>
                <th className="py-4 px-6">Reported Location</th>
                <th className="py-4 px-6 text-center">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-body-md text-text-primary bg-surface-container-lowest">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-mono text-text-secondary mr-2 font-bold">{item.tag}</span>
                    <span className="font-bold">{item.name}</span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-text-secondary">{item.reportedLocation}</td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleVerificationChange(item.id, 'Verified')}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-all cursor-pointer border ${
                          item.verification === 'Verified'
                            ? 'bg-success text-on-primary border-transparent'
                            : 'bg-surface-container-low text-text-secondary border-border-subtle hover:bg-surface-container-high'
                        }`}
                      >
                        Verified
                      </button>
                      <button
                        onClick={() => handleVerificationChange(item.id, 'Missing')}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-all cursor-pointer border ${
                          item.verification === 'Missing'
                            ? 'bg-danger text-on-primary border-transparent'
                            : 'bg-surface-container-low text-text-secondary border-border-subtle hover:bg-surface-container-high'
                        }`}
                      >
                        Missing
                      </button>
                      <button
                        onClick={() => handleVerificationChange(item.id, 'Damaged')}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-all cursor-pointer border ${
                          item.verification === 'Damaged'
                            ? 'bg-warning text-text-primary border-transparent'
                            : 'bg-surface-container-low text-text-secondary border-border-subtle hover:bg-surface-container-high'
                        }`}
                      >
                        Damaged
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Discrepancy warning box */}
      {discrepancyCount > 0 && (
        <div className="bg-[#fef2f2] text-danger border border-danger/20 rounded-xl p-4 flex items-center gap-3 mb-8 shadow-xs">
          <span className="material-symbols-outlined text-[22px]">warning</span>
          <span className="text-body-md font-bold">
            {discrepancyCount} assets flagged – discrepancy report generated automatically
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="pt-4">
        <button
          onClick={handleCloseCycle}
          disabled={loading}
          className="bg-primary hover:bg-surface-tint text-on-primary text-label-md px-6 py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-colors cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Closing cycle...' : 'Close audit cycle'}
        </button>
      </div>
    </div>
  );
}
