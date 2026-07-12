'use client';

import { useState, useEffect } from 'react';
import { activityService } from '@/services/activity.service';

interface ActivityItem {
  id: number;
  message: string;
  category: 'alerts' | 'approvals' | 'bookings';
  timeLabel: string;
  icon: string;
  iconBg: string;
}

export default function ActivityPage() {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'alerts' | 'approvals' | 'bookings'>('all');
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: 1,
      message: 'Laptop AF-0544 assigned to Priya Shah',
      category: 'bookings',
      timeLabel: '2m ago',
      icon: 'assignment_ind',
      iconBg: 'bg-info/10 text-info',
    },
    {
      id: 2,
      message: 'Maintenance request AF-0080 approved',
      category: 'approvals',
      timeLabel: '15m ago',
      icon: 'check_circle',
      iconBg: 'bg-success/10 text-success',
    },
    {
      id: 3,
      message: 'Booking confirmed: Room 101 – 2:00 to 3:00 PM',
      category: 'bookings',
      timeLabel: '1h ago',
      icon: 'calendar_today',
      iconBg: 'bg-primary/10 text-primary',
    },
    {
      id: 4,
      message: 'Transfer approved: AF-0899 to facilities dept',
      category: 'approvals',
      timeLabel: '3h ago',
      icon: 'swap_horiz',
      iconBg: 'bg-indigo/10 text-indigo',
    },
    {
      id: 5,
      message: 'Overdue return: AF-0001 was due 3 days ago',
      category: 'alerts',
      timeLabel: '1d ago',
      icon: 'warning',
      iconBg: 'bg-error-container text-on-error-container',
    },
    {
      id: 6,
      message: 'Audit Discrepancy Flagged: AF-0062 damaged',
      category: 'alerts',
      timeLabel: '2d ago',
      icon: 'error',
      iconBg: 'bg-error/10 text-error',
    },
  ]);

  useEffect(() => {
    setLoading(true);
    activityService.logs()
      .then(res => {
        const fetched = res.value || [];
        // Map database log entries if any are present and append them to mockup logs
        const mapped: ActivityItem[] = fetched.slice(0, 10).map((l: any, index: number) => {
          let category: ActivityItem['category'] = 'bookings';
          let icon = 'info';
          let iconBg = 'bg-slate-100 text-slate-700';

          if (l.action.toLowerCase().includes('maintenance') || l.action.toLowerCase().includes('defect')) {
            category = 'alerts';
            icon = 'build';
            iconBg = 'bg-warning/10 text-warning';
          } else if (l.action.toLowerCase().includes('approve') || l.action.toLowerCase().includes('transfer')) {
            category = 'approvals';
            icon = 'check_circle';
            iconBg = 'bg-success/10 text-success';
          }

          return {
            id: index + 100,
            message: `${l.action}: ${l.details || `${l.entityType} #${l.entityId}`}`,
            category,
            timeLabel: 'Recently',
            icon,
            iconBg
          };
        });

        // Filter out duplicates and merge
        const existing = [...activities];
        mapped.forEach(m => {
          if (!existing.some(e => e.message === m.message)) {
            existing.push(m);
          }
        });
        setActivities(existing);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredActivities = activities.filter(act => {
    if (filter === 'all') return true;
    return act.category === filter;
  });

  const filterTabs = [
    { key: 'all' as const, label: 'All' },
    { key: 'alerts' as const, label: 'Alerts' },
    { key: 'approvals' as const, label: 'Approvals' },
    { key: 'bookings' as const, label: 'Bookings' },
  ];

  if (loading && activities.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-text-secondary animate-pulse font-medium">Loading notifications feed...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 animate-fade-in max-w-[1000px] mx-auto pb-24">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-headline-lg font-bold text-text-primary">Activity logs & Notifications</h1>
          <p className="text-body-sm text-text-secondary mt-1">
            Chronological log of asset operations, compliance audits, and booking schedules.
          </p>
        </div>
      </header>

      {/* Filter pills matching Screen 10 wireframe */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-1">
        {filterTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-5 py-2 border rounded-full text-label-md font-bold transition-all cursor-pointer ${
              filter === tab.key
                ? 'bg-primary border-transparent text-on-primary shadow-sm scale-102'
                : 'bg-surface-container-lowest border-border-subtle text-text-primary hover:bg-surface-container-low'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications list feed */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl overflow-hidden shadow-sm">
        {filteredActivities.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">
            No activities recorded in this category.
          </div>
        ) : (
          <div className="divide-y divide-border-subtle">
            {filteredActivities.map(act => (
              <div
                key={act.id}
                className="flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors group"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Status Indicator Icon */}
                  <div className={`w-10 h-10 rounded-full ${act.iconBg} flex items-center justify-center shrink-0 shadow-xs`}>
                    <span className="material-symbols-outlined text-[20px]">{act.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body-md font-bold text-text-primary group-hover:text-primary transition-colors leading-relaxed">
                      {act.message}
                    </p>
                  </div>
                </div>
                
                {/* Timestamp */}
                <span className="text-mono-data text-text-muted text-xs font-semibold shrink-0 ml-4">
                  {act.timeLabel}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
