"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import { useApiError } from "@/hooks/useApiError";
import { reportService } from "@/services/report.service";
import { activityService } from "@/services/activity.service";
import { assetService } from "@/services/asset.service";
import type { ActivityLog } from "@/types/activity";
import type { Asset, AssetCategory } from "@/types/asset";
import { formatActivitySubtitle, formatActivityTitle } from "@/lib/activity";
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

function mapActivityLog(log: ActivityLog): ActivityItem {
  const action = log.action?.toLowerCase() || "";
  return {
    icon: action.includes("alloc") ? "computer"
      : action.includes("book") ? "meeting_room"
      : action.includes("maintenance") ? "build"
      : action.includes("return") ? "chair" : "info",
    iconBg: action.includes("alloc") ? "bg-[#EEF2FF] text-[#4F46E5]"
      : action.includes("book") ? "bg-[#F0F9FF] text-[#0284C7]"
      : action.includes("maintenance") ? "bg-[#F0FDF4] text-[#16A34A]"
      : action.includes("return") ? "bg-[#EEF2FF] text-[#4F46E5]"
      : "bg-[#F1F5F9] text-[#475569]",
    title: formatActivityTitle(log),
    desc: log.displayText || formatActivitySubtitle(log) || "System activity recorded",
    time: log.createdAt
      ? new Date(log.createdAt).toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, month: "short", day: "numeric" })
      : "Recently",
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const { showToast, handleError } = useApiError();

  const [loading, setLoading] = useState(true);
  const [kpi, setKpi] = useState<KpiData | null>(null);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: "",
    categoryId: 1,
    location: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [kpiData, logs, cats, assets] = await Promise.all([
          reportService.kpi(),
          activityService.logs(),
          assetService.categories(),
          assetService.list(),
        ]);
        setKpi(kpiData);
        setCategories(cats || []);
        const locs = Array.from(new Set((assets || []).map((a: Asset) => a.location).filter(Boolean) as string[]));
        setLocations(locs);
        if (cats?.length) {
          setNewAsset((prev) => ({ ...prev, categoryId: cats[0].id, location: locs[0] || "" }));
        }

        setRecentActivities((logs || []).slice(0, 5).map(mapActivityLog));
      } catch (err) {
        handleError(err, "Could not load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [handleError]);

  const handleRegisterAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.name.trim()) {
      showToast("Please enter an asset name", "error");
      return;
    }
<<<<<<< HEAD
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
=======
    setRegistering(true);
    try {
      const created = await assetService.create({
        name: newAsset.name.trim(),
        categoryId: newAsset.categoryId,
        location: newAsset.location || undefined,
      });
      const [logs, kpiData] = await Promise.all([
        activityService.logs(),
        reportService.kpi(),
      ]);
      setKpi(kpiData);
      setRecentActivities((logs || []).slice(0, 5).map(mapActivityLog));
      showToast(`Successfully registered ${created.name} (${created.assetTag})!`, "success");
      setIsRegisterOpen(false);
      setNewAsset({
        name: "",
        categoryId: categories[0]?.id ?? 1,
        location: locations[0] || "",
      });
    } catch (err) {
      handleError(err, "Failed to register asset");
    } finally {
      setRegistering(false);
    }
>>>>>>> f32fdd2 (feat: enhance notification and activity logging with detailed asset and employee information)
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
              onClick={() => showToast(item.desc, "info")}
              className="px-6 py-4 flex items-start gap-4 hover:bg-[#F8FAFC] transition-colors group cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-full ${item.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                <DynamicIcon name={item.icon} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5 gap-3">
                  <p className="text-[14px] text-[#0F172A] leading-relaxed">
                    {item.desc}
                  </p>
                  <span className="text-[11px] text-[#94A3B8] font-mono shrink-0">{item.time}</span>
                </div>
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
            <label className="block text-[13px] font-medium text-[#0F172A] mb-1" htmlFor="asset-name">Equipment Name</label>
            <input id="asset-name" type="text" placeholder="e.g. MacBook Pro M3 16-inch" value={newAsset.name} onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })} className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[14px] focus:border-[#2563EB] outline-none" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-[#0F172A] mb-1" htmlFor="asset-category">Category</label>
              <select id="asset-category" value={newAsset.categoryId} onChange={(e) => setNewAsset({ ...newAsset, categoryId: parseInt(e.target.value) })} className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[14px] focus:border-[#2563EB] outline-none">
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#0F172A] mb-1" htmlFor="asset-location">Location</label>
              <select id="asset-location" value={newAsset.location} onChange={(e) => setNewAsset({ ...newAsset, location: e.target.value })} className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[14px] focus:border-[#2563EB] outline-none">
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsRegisterOpen(false)} className="px-4 py-2 rounded-lg text-[13px] font-medium border border-[#E2E8F0] hover:bg-[#F8FAFC]">Cancel</button>
            <button type="submit" disabled={registering} className="px-4 py-2 rounded-lg text-[13px] font-semibold bg-[#2563EB] text-white hover:bg-[#1D4ED8] disabled:opacity-50">
              {registering ? "Registering..." : "Register Asset"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
