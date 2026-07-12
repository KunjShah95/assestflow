'use client';

import { useState, useEffect } from 'react';
import { activityService } from '@/services/activity.service';
import type { ActivityLog } from '@/types/activity';

export default function ActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    activityService.logs().then(res => {
      setLogs(res.value || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex-1 flex items-center justify-center"><div className="text-text-secondary animate-pulse">Loading...</div></div>;

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in">
      <header className="bg-surface-container-lowest border-b border-border-subtle px-container py-standard sticky top-0 z-30 hidden md:flex justify-between items-center">
        <div>
          <h1 className="text-headline-lg text-text-primary">Activity Logs & Notifications</h1>
          <p className="text-body-sm text-text-secondary mt-1">Chronological audit trail of system events.</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-container max-w-5xl mx-auto w-full">
        <div className="bg-surface-container-lowest border border-border-subtle rounded-lg shadow-sm">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-text-secondary">No activity logs yet.</div>
          ) : logs.map((log, i) => (
            <div key={log.id || i} className="flex gap-4 p-4 border-b border-border-subtle last:border-b-0 hover:bg-surface-container-low transition-colors group">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary">info</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body-md text-text-primary font-medium">{log.action}</p>
                <p className="text-body-sm mt-0.5 text-text-secondary">{log.details || `${log.entityType} #${log.entityId}`}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-mono-data text-text-secondary">{new Date(log.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ) : (
            filteredLogs.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  showToast(`Log detail: ${item.title} (${item.user})`, "info")
                }
                className="p-comfortable flex items-start gap-4 hover:bg-surface-container-low transition-colors cursor-pointer group"
              >
                <div
                  className={`w-10 h-10 rounded-full ${item.iconColor} flex items-center justify-center shrink-0 mt-0.5`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {item.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                    <span className="text-label-md font-bold text-text-primary group-hover:text-primary transition-colors">
                      {item.title}
                    </span>
                    <span className="text-mono-data text-text-secondary text-xs">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-body-sm text-text-secondary mb-1">
                    {item.desc}
                  </p>
                  <span className="inline-block text-[11px] font-semibold text-text-secondary/80 bg-surface-container px-2 py-0.5 rounded">
                    {item.user}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
