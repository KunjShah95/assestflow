'use client';

import { useState, useEffect } from 'react';
import { reportService } from '@/services/report.service';
import { assetService } from '@/services/asset.service';
import type { Asset } from '@/types/asset';

export default function ReportsPage() {
  const [utilization, setUtilization] = useState<{ department: string; rate: number }[]>([]);
  const [idleAssets, setIdleAssets] = useState<{ name: string; tag: string; idleDays: number }[]>([]);
  const [assetCount, setAssetCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      reportService.utilization(),
      reportService.idleAssets(),
      assetService.list(),
    ]).then(([utilRes, idleRes, assetRes]) => {
      setUtilization((utilRes as unknown as { department: string; rate: number }[]) || []);
      setIdleAssets((idleRes?.value || []).slice(0, 3));
      setAssetCount(assetRes?.Count || 0);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const bars = utilization.length > 0 ? utilization : [
    { department: 'ENG', rate: 85 },
    { department: 'FAC', rate: 60 },
    { department: 'HR', rate: 45 },
    { department: 'OPS', rate: 92 },
    { department: 'IT', rate: 55 },
    { department: 'R&D', rate: 78 },
  ];

  if (loading) return <div className="flex-1 flex items-center justify-center"><div className="text-text-secondary animate-pulse">Loading...</div></div>;

  return (
    <div className="flex-1 overflow-y-auto bg-background p-container animate-fade-in">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-headline-lg text-text-primary mb-1">Reports & Analytics</h2>
          <p className="text-body-md text-text-secondary">System-wide performance and utilization metrics.</p>
        </div>
        <div className="text-body-sm text-text-secondary">{assetCount} total assets tracked</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-comfortable">
        <div className="bg-surface-container-lowest rounded-lg border border-border-subtle p-comfortable lg:col-span-2">
          <h3 className="text-headline-sm mb-4">Utilization by Department</h3>
          <div className="h-64 flex items-end justify-between space-x-2 px-2 pb-6 border-b border-border-subtle relative">
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-text-secondary text-mono-data text-[10px] w-8">
              {['100%', '75%', '50%', '25%', '0%'].map(l => <span key={l}>{l}</span>)}
            </div>
            <div className="absolute left-10 right-0 top-0 bottom-6 border-l border-border-subtle flex flex-col justify-between pointer-events-none">
              {[1,2,3,4,5].map(i => <div key={i} className={`w-full border-t border-border-subtle ${i < 5 ? 'border-dashed opacity-50' : ''} h-0`} />)}
            </div>
            {bars.map(bar => (
              <div key={bar.department} className="flex flex-col items-center flex-1 z-10 first:ml-10 justify-end h-full">
                <div className="w-full max-w-[40px] chart-bar rounded-t-sm opacity-80" style={{ height: `${(bar.rate / 100) * 220}px` }} />
                <span className="text-mono-data text-text-secondary mt-2 text-[10px] uppercase truncate w-full text-center">{bar.department}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-lg border border-border-subtle p-comfortable">
          <h3 className="text-headline-sm mb-4">Idle Assets</h3>
          {idleAssets.length === 0 ? (
            <p className="text-body-sm text-text-secondary">No idle assets.</p>
          ) : (
            <ul className="space-y-4">
              {idleAssets.map(item => (
                <li key={item.tag} className="flex items-start">
                  <div className="bg-surface-container-low p-2 rounded mr-3">
                    <span className="material-symbols-outlined text-text-secondary text-[20px]">inventory_2</span>
                  </div>
                  <div>
                    <p className="text-body-sm font-medium text-text-primary">{item.name}</p>
                    <p className="text-mono-data text-text-secondary">Unused {item.idleDays}+ days</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Export Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Enterprise Analytics Report"
      >
        <form onSubmit={handleExport} className="space-y-4">
          <p className="text-body-sm text-text-secondary">
            Choose the desired format for the Q3 Enterprise Utilization &amp; Asset
            Health report.
          </p>
          <div>
            <label className="block text-label-md mb-2">Export Format</label>
            <div className="grid grid-cols-3 gap-3">
              {["PDF", "Excel (XLSX)", "CSV"].map((format) => (
                <button
                  key={format}
                  type="button"
                  onClick={() => setExportFormat(format)}
                  className={`p-3 rounded-lg border text-label-md transition-all ${
                    exportFormat === format
                      ? "border-primary bg-primary/10 text-primary font-bold ring-1 ring-primary"
                      : "border-border-subtle hover:bg-surface-container"
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsExportModalOpen(false)}
              className="px-4 py-2 rounded text-label-md border border-border-subtle hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded text-label-md bg-primary text-on-primary hover:bg-primary/90 font-medium"
            >
              Generate Export
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
