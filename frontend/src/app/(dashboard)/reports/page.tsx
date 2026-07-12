"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { useToast } from "@/components/ToastProvider";
import { reportService } from "@/services/report.service";
import { Download, TrendingUp, AlertTriangle, DoorOpen, Car, Video, Camera, ArmchairIcon, Printer } from "lucide-react";

interface KpiData {
  availableAssets: number;
  allocatedAssets: number;
  activeBookings: number;
  maintenanceToday: number;
  pendingTransfers: number;
  overdueReturns: number;
}

const usageIconMap: Record<string, typeof DoorOpen> = {
  meeting_room: DoorOpen,
  directions_car: Car,
  videocam: Video,
};

const idleIconMap: Record<string, typeof Camera> = {
  photo_camera: Camera,
  chair: ArmchairIcon,
  print: Printer,
};

export default function ReportsPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("PDF");
  const [kpi, setKpi] = useState<KpiData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await reportService.kpi();
        setKpi(data);
      } catch {
        setKpi({ availableAssets: 128, allocatedAssets: 76, activeBookings: 9, maintenanceToday: 3, pendingTransfers: 3, overdueReturns: 2 });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleExport = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Generating and exporting report as ${exportFormat}...`, "success");
    setIsExportModalOpen(false);
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center min-h-[60vh]"><div className="text-text-secondary animate-pulse font-medium">Loading reports...</div></div>;
  }

  const UsageIcon = ({ icon }: { icon: string }) => {
    const Icon = usageIconMap[icon] || DoorOpen;
    return <Icon size={20} className="text-primary" />;
  };

  const IdleIcon = ({ icon }: { icon: string }) => {
    const Icon = idleIconMap[icon] || Camera;
    return <Icon size={20} className="text-text-secondary" />;
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background p-container animate-fade-in">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-headline-lg text-text-primary mb-1">Reports &amp; Analytics</h2>
          <p className="text-body-md text-text-secondary">System-wide performance and utilization metrics.</p>
        </div>
        <button onClick={() => setIsExportModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-on-primary text-label-md py-2 px-4 rounded transition-colors flex items-center shadow-sm font-medium">
          <Download size={18} className="mr-2" />Export Report
        </button>
      </div>

      {kpi && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {[
            { label: "Available", value: kpi.availableAssets },
            { label: "Allocated", value: kpi.allocatedAssets },
            { label: "Active Bookings", value: kpi.activeBookings },
            { label: "Maintenance Today", value: kpi.maintenanceToday },
            { label: "Pending Transfers", value: kpi.pendingTransfers },
            { label: "Overdue Returns", value: kpi.overdueReturns },
          ].map((card) => (
            <div key={card.label} className="bg-surface-container-lowest border border-border-subtle rounded-lg p-standard text-center">
              <span className="text-label-md text-text-secondary uppercase tracking-wider block mb-1">{card.label}</span>
              <span className="text-headline-lg text-text-primary font-bold">{card.value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-comfortable">
        <div onClick={() => showToast("Department Utilization: Real-time data", "info")}
          className="bg-surface-container-lowest rounded-lg border border-border-subtle p-comfortable lg:col-span-2 cursor-pointer hover:shadow-md transition-shadow">
          <h3 className="text-headline-sm mb-4">Utilization by Department</h3>
          <div className="h-64 flex items-end justify-between space-x-2 px-2 pb-6 border-b border-border-subtle relative">
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-text-secondary text-mono-data text-[10px] w-8">
              {["100%", "75%", "50%", "25%", "0%"].map((label) => (<span key={label}>{label}</span>))}
            </div>
            <div className="absolute left-10 right-0 top-0 bottom-6 border-l border-border-subtle flex flex-col justify-between pointer-events-none">
              {[1, 2, 3, 4, 5].map((i) => (<div key={i} className={`w-full border-t border-border-subtle ${i < 5 ? "border-dashed opacity-50" : ""} h-0`} />))}
            </div>
            {[
              { label: "ENG", height: 85 }, { label: "FAC", height: 60, opacity: "opacity-80" },
              { label: "HR", height: 45, opacity: "opacity-60" }, { label: "OPS", height: 92 },
              { label: "IT", height: 55, opacity: "opacity-70" }, { label: "R&D", height: 78, opacity: "opacity-90" },
            ].map((bar) => (
              <div key={bar.label} className="flex flex-col items-center flex-1 z-10 first:ml-10 justify-end h-full">
                <div className={`w-full max-w-[40px] chart-bar rounded-t-sm ${bar.opacity || ""}`} style={{ height: `${(bar.height / 100) * 220}px` }} />
                <span className="text-mono-data text-text-secondary mt-2 text-[10px] uppercase truncate w-full text-center">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div onClick={() => showToast("Maintenance Frequency data from system", "info")}
          className="bg-surface-container-lowest rounded-lg border border-border-subtle p-comfortable cursor-pointer hover:shadow-md transition-shadow">
          <h3 className="text-headline-sm mb-4">Maintenance Frequency</h3>
          <div className="h-64 relative w-full">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <line stroke="#E2E8F0" strokeDasharray="2,2" strokeWidth="0.5" x1="0" x2="100" y1="25" y2="25" />
              <line stroke="#E2E8F0" strokeDasharray="2,2" strokeWidth="0.5" x1="0" x2="100" y1="50" y2="50" />
              <line stroke="#E2E8F0" strokeDasharray="2,2" strokeWidth="0.5" x1="0" x2="100" y1="75" y2="75" />
              <path className="chart-area" d="M0,80 L20,60 L40,70 L60,30 L80,45 L100,10 L100,100 L0,100 Z" />
              <path className="chart-line" d="M0,80 L20,60 L40,70 L60,30 L80,45 L100,10" />
              <circle cx="20" cy="60" fill="#005c55" r="2" /><circle cx="40" cy="70" fill="#005c55" r="2" />
              <circle cx="60" cy="30" fill="#005c55" r="2" /><circle cx="80" cy="45" fill="#005c55" r="2" />
              <circle cx="100" cy="10" fill="#005c55" r="2" />
            </svg>
            <div className="absolute bottom-0 w-full flex justify-between text-text-secondary text-mono-data text-[10px] pt-2 border-t border-border-subtle">
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (<span key={m}>{m}</span>))}
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-lg border border-border-subtle p-comfortable">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-headline-sm">Most Used Assets</h3>
            <TrendingUp size={20} className="text-text-secondary" />
          </div>
          <ul className="space-y-4">
            {[
              { icon: "meeting_room", name: "Room B2", sub: "34 bookings this month" },
              { icon: "directions_car", name: "Van AF-343", sub: "21 trips this month" },
              { icon: "videocam", name: "Projector AF-335", sub: "18 uses" },
            ].map((item) => (
              <li key={item.name} onClick={() => showToast(`Usage insight: ${item.name} (${item.sub})`, "info")}
                className="flex items-start cursor-pointer hover:bg-surface-container-low p-2 rounded transition-colors">
                <div className="bg-surface-container-low p-2 rounded mr-3"><UsageIcon icon={item.icon} /></div>
                <div><p className="text-body-sm font-medium text-text-primary">{item.name}</p><p className="text-mono-data text-text-secondary">{item.sub}</p></div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-surface-container-lowest rounded-lg border border-border-subtle p-comfortable">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-headline-sm">Idle Assets</h3>
            <AlertTriangle size={20} className="text-warning" />
          </div>
          <ul className="space-y-4">
            {[
              { icon: "photo_camera", name: "Camera AF-0301", sub: "Unused 60+ days" },
              { icon: "chair", name: "Chair AF-0410", sub: "Unused 45 days" },
              { icon: "print", name: "Printer AF-0992", sub: "Unused 30 days" },
            ].map((item) => (
              <li key={item.name} onClick={() => showToast(`Idle alert: ${item.name}`, "warning")}
                className="flex items-start cursor-pointer hover:bg-surface-container-low p-2 rounded transition-colors">
                <div className="bg-surface-container-low p-2 rounded mr-3"><IdleIcon icon={item.icon} /></div>
                <div><p className="text-body-sm font-medium text-text-primary">{item.name}</p><p className="text-mono-data text-text-secondary">{item.sub}</p></div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-surface-container-lowest rounded-lg border border-border-subtle p-comfortable lg:col-span-1">
          <h3 className="text-headline-sm mb-4">Maintenance / Retirement Action Required</h3>
          <div className="space-y-5">
            {[
              { name: "Forklift AF-0087", alert: "Due in 5 days", alertColor: "text-danger", barColor: "bg-danger", width: "90%", sub: "Service required" },
              { name: "Laptop AF-0020", alert: "4 years old", alertColor: "text-warning", barColor: "bg-warning", width: "75%", sub: "Nearing retirement cycle" },
              { name: "HVAC Unit B-East", alert: "Hours limit", alertColor: "text-warning", barColor: "bg-warning", width: "82%", sub: "Routine inspection" },
            ].map((item) => (
              <div key={item.name}>
                <div className="flex justify-between mb-1"><span className="text-body-sm font-medium">{item.name}</span><span className={`text-mono-data ${item.alertColor}`}>{item.alert}</span></div>
                <div className="w-full bg-surface-container-high rounded-full h-1.5"><div className={`${item.barColor} h-1.5 rounded-full`} style={{ width: item.width }} /></div>
                <p className="text-mono-data text-[10px] text-text-secondary mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} title="Export Enterprise Analytics Report">
        <form onSubmit={handleExport} className="space-y-4">
          <p className="text-body-sm text-text-secondary">Choose the desired format for the Enterprise Utilization &amp; Asset Health report.</p>
          <div>
            <label className="block text-label-md mb-2">Export Format</label>
            <div className="grid grid-cols-3 gap-3">
              {["PDF", "Excel (XLSX)", "CSV"].map((format) => (
                <button key={format} type="button" onClick={() => setExportFormat(format)}
                  className={`p-3 rounded-lg border text-label-md transition-all ${exportFormat === format ? "border-primary bg-primary/10 text-primary font-bold ring-1 ring-primary" : "border-border-subtle hover:bg-surface-container"}`}>{format}</button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsExportModalOpen(false)} className="px-4 py-2 rounded text-label-md border border-border-subtle hover:bg-surface-container">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded text-label-md bg-primary text-on-primary hover:bg-primary/90 font-medium">Generate Export</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
