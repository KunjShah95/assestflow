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

  const cards = [
    { label: 'Total Assets', value: kpi?.totalAssets ?? 0 },
    { label: 'Allocated', value: kpi?.allocated ?? 0 },
    { label: 'Active Bookings', value: kpi?.activeBookings ?? 0 },
    { label: 'Departments', value: deptCount },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-container pb-24 animate-fade-in">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-headline-lg text-text-primary">Welcome, {user?.name}</h1>
          <p className="text-body-sm text-text-secondary mt-1">Real-time status of your enterprise assets.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {cards.map(card => (
          <div key={card.label} className="bg-surface-container-lowest border border-border-subtle rounded-lg p-standard flex flex-col hover:shadow-sm transition-shadow">
            <span className="text-label-md text-text-secondary uppercase tracking-wider mb-2">{card.label}</span>
            <span className="text-headline-lg text-text-primary font-bold">{card.value}</span>
          </div>
        ))}
      </div>

      {(kpi?.overdueReturns ?? 0) > 0 && (
        <div className="bg-error-container text-on-error-container border border-error/20 rounded-lg p-standard flex items-center gap-3 mb-8">
          <span className="material-symbols-outlined">warning</span>
          <span className="text-body-md font-medium">{kpi?.overdueReturns} assets overdue for return – flagged for follow-up</span>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-8">
        <Link href="/assets" className="bg-primary text-on-primary text-label-md px-6 py-2.5 rounded-md flex items-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
          Register Asset
        </Link>
        <Link href="/booking" className="border border-border-subtle bg-surface-container-lowest text-text-primary text-label-md px-6 py-2.5 rounded-md flex items-center gap-2 hover:bg-surface-container-low transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>event</span>
          Book Resource
        </Link>
        <Link href="/maintenance" className="border border-border-subtle bg-surface-container-lowest text-text-primary text-label-md px-6 py-2.5 rounded-md flex items-center gap-2 hover:bg-surface-container-low transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>support_agent</span>
          Raise Requests
        </Link>
      </div>

      <div className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden">
        <div className="px-comfortable py-standard border-b border-border-subtle bg-surface-bright">
          <h2 className="text-headline-sm text-text-primary">Recent Activity</h2>
        </div>
        <div className="divide-y divide-border-subtle">
          {recentActivity.length === 0 ? (
            <div className="px-comfortable py-standard text-body-sm text-text-secondary">No recent activity.</div>
          ) : recentActivity.map((item, i) => (
            <div key={i} className="px-comfortable py-standard flex items-start gap-4 hover:bg-surface-container transition-colors group">
              <div className={`w-8 h-8 rounded-full ${item.iconBg} flex items-center justify-center shrink-0 mt-1`}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{item.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-label-md text-text-primary font-bold">{item.title}</span>
                  <span className="text-mono-data text-text-secondary">{item.time}</span>
                </div>
                <p className="text-body-sm text-text-secondary">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
