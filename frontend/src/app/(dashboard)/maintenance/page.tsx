'use client';

import { useState, useEffect } from 'react';
import { maintenanceService } from '@/services/maintenance.service';
import { assetService } from '@/services/asset.service';

interface KanbanCard {
  id: number;
  tag: string;
  title: string;
  status: 'pending' | 'approved' | 'technician_assigned' | 'in_progress' | 'resolved';
  category?: string;
  notes?: string;
}

export default function MaintenancePage() {
  const [cards, setCards] = useState<KanbanCard[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial wireframe cards mapping
  const wireframeCards: KanbanCard[] = [
    {
      id: 1,
      tag: 'AF-0012',
      title: 'Projector lamp not shining',
      status: 'pending',
      category: 'Electronics',
    },
    {
      id: 2,
      tag: 'AF-0002',
      title: 'AC unit noisy compressor',
      status: 'approved',
      category: 'Facilities',
    },
    {
      id: 3,
      tag: 'AF-0078',
      title: 'Printer jam hydr. & clean',
      status: 'technician_assigned',
      category: 'Office Equipment',
    },
    {
      id: 4,
      tag: 'AF-0112',
      title: 'Printer jam parts ordered',
      status: 'in_progress',
      category: 'Office Equipment',
    },
    {
      id: 5,
      tag: 'AF-0273',
      title: 'Chair repair leg glued & test',
      status: 'resolved',
      category: 'Furniture',
    },
  ];

  useEffect(() => {
    setLoading(true);
    maintenanceService.list()
      .then(res => {
        const fetched = res.value || [];
        const merged = [...wireframeCards];
        // Merge dynamic database tickets if they aren't already represented
        fetched.forEach(item => {
          if (!merged.some(c => c.tag === `AF-${String(item.assetId).padStart(4, '0')}`)) {
            merged.push({
              id: item.id,
              tag: `AF-${String(item.assetId).padStart(4, '0')}`,
              title: item.description,
              status: item.status === 'in_progress' ? 'in_progress' : item.status === 'approved' ? 'approved' : item.status === 'resolved' ? 'resolved' : 'pending',
              category: 'General'
            });
          }
        });
        setCards(merged);
      })
      .catch(() => {
        setCards(wireframeCards);
      })
      .finally(() => setLoading(false));
  }, []);

  const moveCard = (id: number, nextStatus: KanbanCard['status']) => {
    setCards(prevCards =>
      prevCards.map(c => (c.id === id ? { ...c, status: nextStatus } : c))
    );
  };

  const columns: { key: KanbanCard['status']; label: string; colorBg: string; borderCol: string }[] = [
    { key: 'pending', label: 'Pending', colorBg: 'bg-warning/10 text-warning', borderCol: 'border-warning/30' },
    { key: 'approved', label: 'Approved', colorBg: 'bg-info/10 text-info', borderCol: 'border-info/30' },
    { key: 'technician_assigned', label: 'Technician assigned', colorBg: 'bg-primary/10 text-primary', borderCol: 'border-primary/30' },
    { key: 'in_progress', label: 'In progress', colorBg: 'bg-indigo/10 text-indigo', borderCol: 'border-indigo/30' },
    { key: 'resolved', label: 'Resolved', colorBg: 'bg-success/10 text-success', borderCol: 'border-success/30' },
  ];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-text-secondary animate-pulse font-medium">Loading maintenance board...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden animate-fade-in max-w-[1400px] mx-auto p-8 pb-24">
      <header className="mb-6">
        <h1 className="text-headline-lg font-bold text-text-primary">Maintenance Management</h1>
        <p className="text-body-sm text-text-secondary mt-1">
          Approve maintenance work orders and track repair pipelines.
        </p>
      </header>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex gap-6 h-full min-w-[1200px] items-stretch">
          {columns.map(col => {
            const colCards = cards.filter(c => c.status === col.key);
            return (
              <div
                key={col.key}
                className="flex-1 bg-surface-container-low rounded-2xl p-4 border border-border-subtle flex flex-col min-w-[220px]"
              >
                {/* Column Header */}
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-border-subtle shrink-0">
                  <h3 className="text-body-md font-bold text-text-primary uppercase tracking-wide flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.key === 'pending' ? 'bg-warning' : col.key === 'approved' ? 'bg-info' : col.key === 'technician_assigned' ? 'bg-primary' : col.key === 'in_progress' ? 'bg-indigo' : 'bg-success'}`} />
                    {col.label}
                  </h3>
                  <span className="bg-surface-container-high px-2 py-0.5 rounded-lg text-mono-data text-xs text-text-secondary font-bold">
                    {colCards.length}
                  </span>
                </div>

                {/* Card stack */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-4">
                  {colCards.length === 0 ? (
                    <div className="text-body-sm text-text-muted text-center py-8">
                      No cards here
                    </div>
                  ) : (
                    colCards.map(card => (
                      <div
                        key={card.id}
                        className={`bg-surface-container-lowest border-2 rounded-xl p-4 shadow-xs transition-all hover:shadow-md hover:translate-y-[-1px] group relative ${col.key === 'resolved' ? 'opacity-80 border-success/20' : 'border-border-subtle'}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-mono-data font-black text-xs text-text-secondary">
                            {card.tag}
                          </span>
                          {card.category && (
                            <span className="bg-surface-container-low text-text-secondary px-2 py-0.5 rounded text-[10px] font-bold">
                              {card.category}
                            </span>
                          )}
                        </div>
                        <p className="text-body-sm font-bold text-text-primary leading-snug">
                          {card.title}
                        </p>

                        {/* Interactive flow actions */}
                        <div className="mt-4 pt-3 border-t border-border-subtle flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {card.status === 'pending' && (
                            <button
                              onClick={() => moveCard(card.id, 'approved')}
                              className="text-[11px] text-primary hover:underline font-bold"
                            >
                              Approve
                            </button>
                          )}
                          {card.status === 'approved' && (
                            <button
                              onClick={() => moveCard(card.id, 'technician_assigned')}
                              className="text-[11px] text-primary hover:underline font-bold"
                            >
                              Assign Tech
                            </button>
                          )}
                          {card.status === 'technician_assigned' && (
                            <button
                              onClick={() => moveCard(card.id, 'in_progress')}
                              className="text-[11px] text-primary hover:underline font-bold"
                            >
                              Start Repair
                            </button>
                          )}
                          {card.status === 'in_progress' && (
                            <button
                              onClick={() => moveCard(card.id, 'resolved')}
                              className="text-[11px] text-success hover:underline font-bold"
                            >
                              Mark Resolved
                            </button>
                          )}
                          {card.status !== 'pending' && (
                            <button
                              onClick={() => {
                                const statuses: KanbanCard['status'][] = ['pending', 'approved', 'technician_assigned', 'in_progress', 'resolved'];
                                const prevIndex = statuses.indexOf(card.status) - 1;
                                moveCard(card.id, statuses[prevIndex]);
                              }}
                              className="text-[11px] text-text-secondary hover:underline mr-auto"
                            >
                              Back
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanatory Caption at Bottom */}
      <footer className="mt-6 bg-surface-container-low border border-border-subtle rounded-xl px-6 py-4 text-body-sm text-text-secondary leading-relaxed font-medium">
        Approving a card moves the asset to under maintenance, resolving returns it to available.
      </footer>
    </div>
  );
}
