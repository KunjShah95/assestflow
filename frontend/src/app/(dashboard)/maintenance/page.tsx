'use client';

import { useState, useEffect } from 'react';
import { maintenanceService } from '@/services/maintenance.service';
import { assetService } from '@/services/asset.service';
import type { MaintenanceRequest } from '@/types/maintenance';
import type { Asset } from '@/types/asset';

interface Column { title: string; color: string; cards: { id: number; title: string; priority?: string; priorityColor?: string; sub?: string; faded?: boolean }[] }

const priorityColors: Record<string, string> = {
  critical: 'bg-danger/10 text-danger',
  high: 'bg-danger/10 text-danger',
  medium: 'bg-warning/10 text-warning',
  low: 'bg-surface-container-highest text-text-secondary',
};

export default function MaintenancePage() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [assetMap, setAssetMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      maintenanceService.list(),
      assetService.list(),
    ]).then(([reqRes, assetRes]) => {
      setRequests(reqRes.value || []);
      const map: Record<number, string> = {};
      (assetRes.value || []).forEach(a => { map[a.id] = a.name; });
      setAssetMap(map);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const columns: Column[] = [
    { title: 'Pending', color: 'bg-warning', cards: requests.filter(r => r.status === 'pending').map(r => ({ id: r.id, title: r.description, priority: r.priority, priorityColor: priorityColors[r.priority] || '', sub: `Asset #${r.assetId}` })) },
    { title: 'Approved', color: 'bg-info', cards: requests.filter(r => r.status === 'approved').map(r => ({ id: r.id, title: r.description, priority: r.priority, priorityColor: priorityColors[r.priority] || '', sub: `Asset #${r.assetId}` })) },
    { title: 'In Progress', color: 'bg-primary', cards: requests.filter(r => r.status === 'in_progress').map(r => ({ id: r.id, title: r.description, priority: r.priority, priorityColor: priorityColors[r.priority] || '', sub: `Asset #${r.assetId}` })) },
    { title: 'Resolved', color: 'bg-success', cards: requests.filter(r => r.status === 'resolved').map(r => ({ id: r.id, title: r.description, faded: true, sub: `Asset #${r.assetId}` })) },
  ];

  async function handleAction(id: number, action: 'approve' | 'reject' | 'resolve') {
    try {
      if (action === 'approve') await maintenanceService.approve(id);
      else if (action === 'reject') await maintenanceService.reject(id);
      else await maintenanceService.resolve(id);
      const res = await maintenanceService.list();
      setRequests(res.value || []);
    } catch { /* ignore */ }
  }

  if (loading) return <div className="flex-1 flex items-center justify-center"><div className="text-text-secondary animate-pulse">Loading...</div></div>;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-surface animate-fade-in">
      <div className="px-container py-comfortable border-b border-border-subtle bg-surface-container-lowest shrink-0 flex justify-between items-center">
        <div>
          <h1 className="text-headline-lg text-text-primary">Maintenance Board</h1>
          <p className="text-body-sm text-text-secondary mt-1">{requests.length} total requests</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-container">
        <div className="flex gap-container h-full min-w-max">
          {columns.map(col => (
            <div key={col.title} className={`w-80 flex flex-col bg-surface-container-low rounded-lg p-standard border border-border-subtle shrink-0`} style={{ minHeight: 'calc(100vh - 200px)' }}>
              <div className="flex justify-between items-center mb-standard">
                <h2 className="text-headline-sm text-text-primary flex items-center gap-2 uppercase tracking-wide">
                  <span className={`w-2 h-2 rounded-full ${col.color}`} />
                  {col.title}
                </h2>
                <span className="text-mono-data bg-surface-container-highest px-2 py-1 rounded text-text-secondary">{col.cards.length}</span>
              </div>

              <div className="flex flex-col gap-standard overflow-y-auto pr-1 pb-4">
                {col.cards.length === 0 ? (
                  <div className="text-body-sm text-text-secondary text-center py-8">No requests</div>
                ) : col.cards.map(card => (
                  <div key={card.id} className={`bg-surface-container-lowest border border-border-subtle rounded-lg p-standard cursor-pointer kanban-card transition-all flex flex-col gap-compact ${card.faded ? 'opacity-70' : ''}`}>
                    <div className="flex justify-between items-start">
                      <span className="text-mono-data font-bold text-text-primary">#{card.id}</span>
                      {card.priority && <span className={`${card.priorityColor} px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider`}>{card.priority}</span>}
                    </div>
                    <div className="text-label-md text-text-primary line-clamp-2">{card.title}</div>
                    {card.sub && <div className="text-body-sm text-text-secondary">{card.sub}</div>}
                    <div className="mt-2 pt-2 border-t border-border-subtle flex gap-2">
                      {col.title === 'Pending' && <>
                        <button onClick={() => handleAction(card.id, 'approve')} className="text-[11px] text-success hover:underline">Approve</button>
                        <button onClick={() => handleAction(card.id, 'reject')} className="text-[11px] text-danger hover:underline">Reject</button>
                      </>}
                      {col.title === 'Approved' && <button onClick={() => handleAction(card.id, 'resolve')} className="text-[11px] text-primary hover:underline">Mark Resolved</button>}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* New Request Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log New Maintenance Request"
      >
        <form onSubmit={handleCreateRequest} className="space-y-4">
          <div>
            <label className="block text-label-md mb-1" htmlFor="maint-asset">
              Asset Tag ID
            </label>
            <input
              id="maint-asset"
              type="text"
              value={form.assetId}
              onChange={(e) => setForm({ ...form, assetId: e.target.value })}
              className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md font-mono"
            />
          </div>
          <div>
            <label className="block text-label-md mb-1" htmlFor="maint-title">
              Issue Summary
            </label>
            <input
              id="maint-title"
              type="text"
              placeholder="e.g. Broken screen hinge / Fan overheating"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-label-md mb-1" htmlFor="maint-priority">
              Priority Severity
            </label>
            <select
              id="maint-priority"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md"
            >
              <option value="High">High (Immediate Action Required)</option>
              <option value="Med">Medium (Normal Servicing Queue)</option>
              <option value="Low">Low (Scheduled Inspection)</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded text-label-md border border-border-subtle hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded text-label-md bg-primary text-on-primary hover:bg-primary/90 font-medium"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
