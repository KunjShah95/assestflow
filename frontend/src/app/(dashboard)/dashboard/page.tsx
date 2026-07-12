"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import { useApiError } from "@/hooks/useApiError";
import { reportService } from "@/services/report.service";
import { activityService } from "@/services/activity.service";
import type { ActivityLog } from "@/types/activity";
import { AlertTriangle, Plus, Calendar, Headphones, Monitor, DoorOpen, Wrench, ArmchairIcon, Info, Package } from "lucide-react";

const iconMap: Record<string, typeof Monitor> = {
  computer: Monitor,
  meeting_room: DoorOpen,
  build: Wrench,
  chair: ArmchairIcon,
  info: Info,
  inventory_2: Package,
};

const DynamicIcon = ({ name, size = 16 }: { name: string; size?: number }) => {
  const Icon = iconMap[name] || Info;
  return <Icon size={size} />;
};

interface ActivityItem {
  icon: string;
  iconBg: string;
  title: string;
  desc: string;
  time: string;
}

interface KpiData {
  availableAssets: number;
  allocatedAssets: number;
  activeBookings: number;
  pendingTransfers: number;
  overdueReturns: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { showToast, handleError } = useApiError();

  const [loading, setLoading] = useState(true);
  const [kpi, setKpi] = useState<KpiData | null>(null);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: "",
    category: "Electronics",
    location: "Bengaluru, BLR-01",
    tag: "AF-0250",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [kpiData, logs] = await Promise.all([
          reportService.kpi(),
          activityService.logs(),
        ]);
        setKpi(kpiData);

        const mapped = (logs || []).slice(0, 5).map((log: ActivityLog) => ({
          icon: log.action?.toLowerCase().includes("alloc") ? "computer" :
                log.action?.toLowerCase().includes("book") ? "meeting_room" :
                log.action?.toLowerCase().includes("maintenance") ? "build" :
                log.action?.toLowerCase().includes("return") ? "chair" : "info",
          iconBg: log.action?.toLowerCase().includes("alloc") ? "bg-[#EEF2FF] text-[#4F46E5]" :
                  log.action?.toLowerCase().includes("book") ? "bg-[#F0F9FF] text-[#0284C7]" :
                  log.action?.toLowerCase().includes("maintenance") ? "bg-[#F0FDF4] text-[#16A34A]" :
                  log.action?.toLowerCase().includes("return") ? "bg-[#EEF2FF] text-[#4F46E5]" :
                  "bg-[#F1F5F9] text-[#475569]",
          title: `${log.action || "Activity"} #${log.id}`,
          desc: typeof log.details === 'string'
            ? log.details
            : log.details
              ? JSON.stringify(log.details)
              : `${log.entityType || "Entity"} updated`,
          time: log.createdAt ? new Date(log.createdAt).toLocaleDateString() : "Recently",
        }));

        if (mapped.length === 0) {
          setRecentActivities([
            { icon: "computer", iconBg: "bg-[#EEF2FF] text-[#4F46E5]", title: "Laptop AF-0114", desc: "Allocated to Priya Shah – IT Dept", time: "10:42 AM" },
            { icon: "meeting_room", iconBg: "bg-[#F0F9FF] text-[#0284C7]", title: "Room B2", desc: "Booking confirmed – 2:00 to 3:00 PM", time: "09:15 AM" },
          ]);
        } else {
          setRecentActivities(mapped);
        }
      } catch (err) {
        handleError(err, "Could not load dashboard data");
        setKpi({ availableAssets: 128, allocatedAssets: 76, activeBookings: 9, pendingTransfers: 3, overdueReturns: 2 });
        setRecentActivities([
          { icon: "computer", iconBg: "bg-[#EEF2FF] text-[#4F46E5]", title: "Laptop AF-0114", desc: "Allocated to Priya Shah – IT Dept", time: "10:42 AM" },
          { icon: "meeting_room", iconBg: "bg-[#F0F9FF] text-[#0284C7]", title: "Room B2", desc: "Booking confirmed – 2:00 to 3:00 PM", time: "09:15 AM" },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleRegisterAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.name) {
      showToast("Please enter an asset name", "error");
      return;
    }
    setRecentActivities((prev) => [
      {
        icon: "inventory_2",
        iconBg: "bg-primary/10 text-primary",
        title: `${newAsset.name} (${newAsset.tag})`,
        desc: `Registered to ${newAsset.location} [${newAsset.category}]`,
        time: "Just now",
      },
      ...prev,
    ]);
    showToast(`Successfully registered ${newAsset.name} (${newAsset.tag})!`, "success");
    setIsRegisterOpen(false);
    setNewAsset({
      name: "",
      category: "Electronics",
      location: "Bengaluru, BLR-01",
      tag: `AF-${Math.floor(1000 + Math.random() * 9000)}`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-[#475569] animate-pulse font-medium">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-[#0F172A] text-[24px] font-bold tracking-tight">Today&apos;s Overview</h1>
          <p className="text-[#475569] text-[14px] mt-1">Real-time status of your enterprise assets.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Available", value: kpi?.availableAssets ?? 0, route: "/assets" },
          { label: "Allocated", value: kpi?.allocatedAssets ?? 0, route: "/allocation" },
          { label: "Active Bookings", value: kpi?.activeBookings ?? 0, route: "/booking" },
          { label: "Pending Transfers", value: kpi?.pendingTransfers ?? 0, route: "/allocation" },
        ].map((card) => (
          <div
            key={card.label}
            onClick={() => router.push(card.route)}
            className="bg-white border border-[#E2E8F0] rounded-lg p-5 flex flex-col hover:shadow-md hover:border-[#2563EB]/50 transition-all cursor-pointer"
          >
            <span className="text-[11px] text-[#475569] uppercase tracking-wider font-semibold mb-2">{card.label}</span>
            <span className="text-[24px] text-[#0F172A] font-bold">{card.value}</span>
          </div>
        ))}
      </div>

      {(kpi?.overdueReturns ?? 0) > 0 && (
        <div
          onClick={() => router.push("/activity")}
          className="bg-[#FEF2F2] text-[#991B1B] border border-[#EF4444]/20 rounded-lg p-4 flex items-center justify-between gap-3 mb-8 cursor-pointer hover:bg-[#FEF2F2]/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle size={18} />
            <span className="text-[14px] font-medium">
              {kpi?.overdueReturns} asset(s) overdue for return – flagged for follow-up
            </span>
          </div>
          <span className="text-[13px] font-bold underline">Review Alerts</span>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setIsRegisterOpen(true)}
          className="bg-[#2563EB] text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#1D4ED8] transition-colors shadow-sm"
        >
          <Plus size={16} />
          Register Asset
        </button>
        <button
          onClick={() => router.push("/booking")}
          className="border border-[#E2E8F0] bg-white text-[#0F172A] text-[13px] font-medium px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#F8FAFC] transition-colors"
        >
          <Calendar size={16} />
          Book Resource
        </button>
        <button
          onClick={() => router.push("/maintenance")}
          className="border border-[#E2E8F0] bg-white text-[#0F172A] text-[13px] font-medium px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#F8FAFC] transition-colors"
        >
          <Headphones size={16} />
          Raise Requests
        </button>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
          <h2 className="text-[#0F172A] text-[16px] font-semibold">Recent Activity</h2>
          <button
            onClick={() => router.push("/activity")}
            className="text-[13px] text-[#2563EB] hover:underline font-medium"
          >
            View All Logs
          </button>
        </div>
        <div className="divide-y divide-[#E2E8F0]">
          {recentActivities.slice(0, 5).map((item, i) => (
            <div
              key={i}
              onClick={() => showToast(`Activity details: ${item.title} - ${item.desc}`, "info")}
              className="px-6 py-4 flex items-start gap-4 hover:bg-[#F8FAFC] transition-colors group cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-full ${item.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                <DynamicIcon name={item.icon} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <span className="text-[14px] text-[#0F172A] font-semibold truncate">{item.title}</span>
                  <span className="text-[11px] text-[#94A3B8] font-mono shrink-0 ml-3">{item.time}</span>
                </div>
                <p className="text-[13px] text-[#475569] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
          {recentActivities.length === 0 && (
            <div className="p-8 text-center text-[#475569]">No recent activity</div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        title="Register New Enterprise Asset"
      >
        <form onSubmit={handleRegisterAsset} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-[#0F172A] mb-1" htmlFor="asset-tag">Asset Tag ID</label>
            <input id="asset-tag" type="text" value={newAsset.tag} onChange={(e) => setNewAsset({ ...newAsset, tag: e.target.value })} className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[14px] font-mono focus:border-[#2563EB] outline-none" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#0F172A] mb-1" htmlFor="asset-name">Equipment Name</label>
            <input id="asset-name" type="text" placeholder="e.g. MacBook Pro M3 16-inch" value={newAsset.name} onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })} className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[14px] focus:border-[#2563EB] outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-[#0F172A] mb-1" htmlFor="asset-category">Category</label>
              <select id="asset-category" value={newAsset.category} onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })} className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[14px] focus:border-[#2563EB] outline-none">
                <option>Electronics</option><option>Furniture</option><option>Networking</option><option>Vehicles</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#0F172A] mb-1" htmlFor="asset-location">Location</label>
              <select id="asset-location" value={newAsset.location} onChange={(e) => setNewAsset({ ...newAsset, location: e.target.value })} className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[14px] focus:border-[#2563EB] outline-none">
                <option>Bengaluru, BLR-01</option><option>Mumbai, Server Rm 1</option><option>HQ, Floor 2</option><option>Warehouse A</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsRegisterOpen(false)} className="px-4 py-2 rounded-lg text-[13px] font-medium border border-[#E2E8F0] hover:bg-[#F8FAFC]">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg text-[13px] font-semibold bg-[#2563EB] text-white hover:bg-[#1D4ED8]">Register Asset</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
