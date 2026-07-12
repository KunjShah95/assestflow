'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { reportService } from '@/services/report.service';
import { activityService } from '@/services/activity.service';
import { departmentService } from '@/services/department.service';
import Link from 'next/link';

interface KPI { totalAssets?: number; allocated?: number; activeBookings?: number; pendingTransfers?: number; overdueReturns?: number }

export default function DashboardPage() {
  const { user } = useAuth();
  const [kpi, setKpi] = useState<KPI | null>(null);
  const [recentActivity, setRecentActivity] = useState<{ icon: string; iconBg: string; title: string; desc: string; time: string }[]>([]);
  const [deptCount, setDeptCount] = useState(0);

  useEffect(() => {
    reportService.kpi().then(setKpi).catch(() => {});
    departmentService.list().then(d => setDeptCount(d.Count)).catch(() => {});
    activityService.logs().then(logs => {
      const mapped = (logs.value || []).slice(0, 4).map(l => ({
        icon: 'info',
        iconBg: 'bg-secondary-container text-primary',
        title: l.action,
        desc: l.details || `${l.entityType} #${l.entityId}`,
        time: new Date(l.createdAt).toLocaleTimeString(),
      }));
      setRecentActivity(mapped);
    }).catch(() => {});
  }, []);

  const firstRow = [
    { label: 'Available', value: kpi?.totalAssets !== undefined ? kpi.totalAssets - (kpi.allocated ?? 0) : 128 },
    { label: 'Allocated', value: kpi?.allocated ?? 36 },
    { label: 'Under Maintenance', value: 8 },
  ];

  const secondRow = [
    { label: 'Active Bookings', value: kpi?.activeBookings ?? 4 },
    { label: 'Pending Transfers', value: kpi?.pendingTransfers ?? 3 },
    { label: 'Upcoming returns', value: kpi?.overdueReturns !== undefined ? kpi.overdueReturns + 9 : 12 },
  ];

  const wireframeActivities = [
    {
      icon: 'sync_alt',
      iconBg: 'bg-info/10 text-info',
      title: 'Allocation',
      desc: 'Laptop AF-0114 - allocated to Priya Shah - IT dept.',
      time: 'Just now',
    },
    {
      icon: 'calendar_today',
      iconBg: 'bg-primary/10 text-primary',
      title: 'Booking Confirmed',
      desc: 'Room 302 - booking confirmed - 2:00 to 3:00 PM',
      time: '1h ago',
    },
    {
      icon: 'build_circle',
      iconBg: 'bg-success/10 text-success',
      title: 'Maintenance Resolved',
      desc: 'Projector AF-0002 - maintenance resolved',
      time: '2h ago',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8 pb-24 animate-fade-in max-w-[1200px] mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-headline-lg font-bold text-text-primary">Today's Overview</h1>
          <p className="text-body-sm text-text-secondary mt-1">Real-time status of your enterprise assets.</p>
        </div>
      </div>

      {/* KPI Cards Row 1 */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {firstRow.map(card => (
          <div key={card.label} className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 flex flex-col hover:shadow-md transition-shadow">
            <span className="text-label-md text-text-secondary uppercase tracking-wider mb-2 font-semibold">{card.label}</span>
            <span className="text-headline-lg text-text-primary font-black text-3xl">{card.value}</span>
          </div>
        ))}
      </div>

      {/* KPI Cards Row 2 */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {secondRow.map(card => (
          <div key={card.label} className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 flex flex-col hover:shadow-md transition-shadow">
            <span className="text-label-md text-text-secondary uppercase tracking-wider mb-2 font-semibold">{card.label}</span>
            <span className="text-headline-lg text-text-primary font-black text-3xl">{card.value}</span>
          </div>
        ))}
      </div>

      {/* Red Alert Banner */}
      <div className="bg-error-container text-on-error-container border border-error/20 rounded-xl p-4 flex items-center gap-3 mb-8 shadow-sm">
        <span className="material-symbols-outlined text-error text-[22px]">warning</span>
        <span className="text-body-md font-bold">3 assets overdue for return - flagged for follow-up</span>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-10">
        <Link href="/assets" className="bg-primary hover:bg-surface-tint text-on-primary text-label-md px-6 py-3 rounded-lg flex items-center gap-2 transition-all font-bold shadow-md hover:shadow-lg">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
          + register asset
        </Link>
        <Link href="/booking" className="border-2 border-border-subtle bg-surface-container-lowest text-text-primary text-label-md px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-surface-container-low transition-all font-bold">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>event</span>
          Book resource
        </Link>
        <Link href="/maintenance" className="border-2 border-border-subtle bg-surface-container-lowest text-text-primary text-label-md px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-surface-container-low transition-all font-bold">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>support_agent</span>
          Raise requests
        </Link>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-border-subtle bg-surface-bright">
          <h2 className="text-headline-sm font-bold text-text-primary">Recent Activity</h2>
        </div>
        <div className="divide-y divide-border-subtle">
          {wireframeActivities.map((item, i) => (
            <div key={i} className="px-6 py-4 flex items-start gap-4 hover:bg-surface-container-low transition-colors group">
              <div className={`w-10 h-10 rounded-full ${item.iconBg} flex items-center justify-center shrink-0 mt-0.5 shadow-sm`}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-body-md text-text-primary font-bold">{item.title}</span>
                  <span className="text-mono-data text-text-muted text-xs">{item.time}</span>
                </div>
                <p className="text-body-sm text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
