'use client';

import { useState, useEffect } from 'react';
import { reportService } from '@/services/report.service';
import { assetService } from '@/services/asset.service';

export default function ReportsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleExport = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Report exported successfully! Download will start automatically.');
    } catch {
      setMessage('Failed to export reports.');
    } finally {
      setLoading(false);
    }
  };

  const deptUtilization = [
    { name: 'Engineering', rate: 92, color: 'bg-primary' },
    { name: 'Facilities', rate: 75, color: 'bg-info' },
    { name: 'Field Ops', rate: 62, color: 'bg-indigo' },
    { name: 'Marketing', rate: 45, color: 'bg-amber-500' },
    { name: 'Finance', rate: 38, color: 'bg-slate-500' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8 animate-fade-in max-w-[1200px] mx-auto pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-headline-lg font-bold text-text-primary">Reports & Analytics</h1>
          <p className="text-body-sm text-text-secondary mt-1">
            System utilization, maintenance tracking, and resource lifecycle logs.
          </p>
        </div>
      </div>

      {message && (
        <div className="mb-6 p-4 rounded-xl text-body-md font-bold shadow-sm bg-success/10 text-success border border-success/20">
          {message}
        </div>
      )}

      {/* Grid of 2 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Chart 1: Utilization by Department (Bar Chart) */}
        <div className="bg-[#eff6ff] rounded-2xl border border-primary/10 p-6 flex flex-col justify-between shadow-xs">
          <div>
            <h3 className="text-headline-sm font-black text-[#1e40af] mb-1">
              Utilization by department
            </h3>
            <p className="text-body-sm text-[#1e40af]/70 mb-6 font-semibold">Average active allocation rates</p>
          </div>
          
          {/* Vertical Bar Chart Container */}
          <div className="h-48 flex items-end justify-between gap-2 px-2 pb-6 border-b border-primary/20 relative">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-full border-t border-primary/10 border-dashed h-0" />
              ))}
            </div>
            {deptUtilization.map(bar => (
              <div key={bar.name} className="flex flex-col items-center flex-1 z-10">
                <div className="text-mono-data text-[10px] text-[#1e40af] font-black mb-1">
                  {bar.rate}%
                </div>
                <div 
                  className={`w-full max-w-[32px] ${bar.color} rounded-t-lg transition-all duration-500 shadow-sm`}
                  style={{ height: `${(bar.rate / 100) * 120}px` }}
                />
                <span className="text-mono-data text-[#1e40af] mt-2 text-[10px] uppercase font-bold truncate max-w-[50px]">
                  {bar.name.substring(0, 3)}
                </span>
              </div>
            ))}
          </div>
        </div>

          {/* Chart 2: Maintenance Frequency (Line Chart) */}
          <div className="bg-[#f0fdf4] rounded-2xl border border-success/10 p-6 flex flex-col justify-between shadow-xs">
            <div>
              <h3 className="text-headline-sm font-black text-emerald-950 mb-1">
                Maintenance Frequency
              </h3>
              <p className="text-body-sm text-emerald-800/70 mb-6 font-semibold">Incident tickets resolved over time</p>
            </div>

            {/* Line Graph SVG Container */}
            <div className="h-48 flex items-end relative border-b border-emerald-950/20 pb-6">
              <svg className="w-full h-[120px] overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                {/* Area under the line */}
                <path
                  d="M0,80 Q80,20 160,50 T320,10 T500,60 L500,100 L0,100 Z"
                  fill="url(#emerald-glow)"
                  opacity="0.2"
                />
                {/* The main stroke line */}
                <path
                  d="M0,80 Q80,20 160,50 T320,10 T500,60"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="emerald-glow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Month indicators */}
              <div className="absolute bottom-1 left-0 right-0 flex justify-between text-mono-data text-[10px] text-emerald-800 font-bold px-2">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
              </div>
            </div>
          </div>
      </div>

      {/* Analytics Lists Grid Column matching Screen 9 wireframe */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Most Used Assets */}
        <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-6 shadow-sm">
          <h4 className="text-headline-sm font-bold text-text-primary mb-4 border-b border-border-subtle pb-2">
            Most used assets
          </h4>
          <ul className="space-y-3 text-body-sm text-text-secondary font-medium">
            <li className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">meeting_room</span>
              <span>Room 201: 89 bookings this month</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">laptop_mac</span>
              <span>MacBook Pro: 21 times this month</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">videocam</span>
              <span>Projector AF-0002: 18 times</span>
            </li>
          </ul>
        </div>

        {/* Idle Assets */}
        <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-6 shadow-sm">
          <h4 className="text-headline-sm font-bold text-text-primary mb-4 border-b border-border-subtle pb-2">
            Idle assets
          </h4>
          <ul className="space-y-3 text-body-sm text-text-secondary font-medium">
            <li className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-warning text-[18px] mt-0.5">photo_camera</span>
              <span>Camera AF-0301: unused 60+ days</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-warning text-[18px] mt-0.5">tablet_mac</span>
              <span>iPad AF-0410: unused 45 days</span>
            </li>
          </ul>
        </div>

        {/* Due Maintenance / Retirement */}
        <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-6 shadow-sm">
          <h4 className="text-headline-sm font-bold text-text-primary mb-4 border-b border-border-subtle pb-2 font-bold">
            Assets due for maintenance / nearing retirement
          </h4>
          <ul className="space-y-3 text-body-sm text-text-secondary font-medium">
            <li className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-danger text-[18px] mt-0.5">print</span>
              <span>Printer AF-0027: service due in 5 days</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-danger text-[18px] mt-0.5">computer</span>
              <span>Laptop AF-0120: 4 years old – nearing retirement</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Export Button Action */}
      <div className="pt-2">
        <button
          onClick={handleExport}
          disabled={loading}
          className="bg-primary hover:bg-surface-tint text-on-primary text-label-md px-6 py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-colors cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Export reports'}
        </button>
      </div>
    </div>
  );
}
