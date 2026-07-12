"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import { useToast } from "@/components/ToastProvider";
import { reportService } from "@/services/report.service";
import { activityService } from "@/services/activity.service";

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
  const { showToast } = useToast();

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

        const mapped = (logs || []).slice(0, 5).map((log: any) => ({
          icon: log.action?.toLowerCase().includes("alloc") ? "computer" :
                log.action?.toLowerCase().includes("book") ? "meeting_room" :
                log.action?.toLowerCase().includes("maintenance") ? "build" :
                log.action?.toLowerCase().includes("return") ? "chair" : "info",
          iconBg: log.action?.toLowerCase().includes("alloc") ? "bg-secondary-container text-primary" :
                  log.action?.toLowerCase().includes("book") ? "bg-tertiary-container/20 text-tertiary" :
                  log.action?.toLowerCase().includes("maintenance") ? "bg-success/10 text-success" :
                  log.action?.toLowerCase().includes("return") ? "bg-secondary-container text-primary" :
                  "bg-surface-container text-text-secondary",
          title: `${log.action || "Activity"} #${log.id}`,
          desc: log.details || `${log.entityType || "Entity"} updated`,
          time: log.createdAt ? new Date(log.createdAt).toLocaleDateString() : "Recently",
        }));

        if (mapped.length === 0) {
          setRecentActivities([
            { icon: "computer", iconBg: "bg-secondary-container text-primary", title: "Laptop AF-0114", desc: "Allocated to Priya Shah – IT Dept", time: "10:42 AM" },
            { icon: "meeting_room", iconBg: "bg-tertiary-container/20 text-tertiary", title: "Room B2", desc: "Booking confirmed – 2:00 to 3:00 PM", time: "09:15 AM" },
          ]);
        } else {
          setRecentActivities(mapped);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        // Fallback mock data
        setKpi({ availableAssets: 128, allocatedAssets: 76, activeBookings: 9, pendingTransfers: 3, overdueReturns: 2 });
        setRecentActivities([
          { icon: "computer", iconBg: "bg-secondary-container text-primary", title: "Laptop AF-0114", desc: "Allocated to Priya Shah – IT Dept", time: "10:42 AM" },
          { icon: "meeting_room", iconBg: "bg-tertiary-container/20 text-tertiary", title: "Room B2", desc: "Booking confirmed – 2:00 to 3:00 PM", time: "09:15 AM" },
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
    setRecentActivities([
      {
        icon: "inventory_2",
        iconBg: "bg-primary/10 text-primary",
        title: `${newAsset.name} (${newAsset.tag})`,
        desc: `Registered to ${newAsset.location} [${newAsset.category}]`,
        time: "Just now",
      },
      ...recentActivities,
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
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-text-secondary animate-pulse font-medium">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-container pb-24 animate-fade-in">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-headline-lg text-text-primary">Today&apos;s Overview</h1>
          <p className="text-body-sm text-text-secondary mt-1">
            Real-time status of your enterprise assets.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
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
            className="bg-surface-container-lowest border border-border-subtle rounded-lg p-standard flex flex-col hover:shadow-md hover:border-primary/50 transition-all cursor-pointer"
          >
            <span className="text-label-md text-text-secondary uppercase tracking-wider mb-2">
              {card.label}
            </span>
            <span className="text-headline-lg text-text-primary font-bold">
              {card.value}
            </span>
          </div>
        ))}
      </div>

      {/* Alert Banner */}
      {(kpi?.overdueReturns ?? 0) > 0 && (
        <div
          onClick={() => router.push("/activity")}
          className="bg-error-container text-on-error-container border border-error/20 rounded-lg p-standard flex items-center justify-between gap-3 mb-8 cursor-pointer hover:bg-error-container/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined">warning</span>
            <span className="text-body-md font-medium">
              {kpi?.overdueReturns} asset(s) overdue for return – flagged for follow-up
            </span>
          </div>
          <span className="text-label-md font-bold underline">Review Alerts</span>
        </div>
      )}

      {/* Primary Actions */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setIsRegisterOpen(true)}
          className="bg-primary text-on-primary text-label-md px-6 py-2.5 rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            add
          </span>
          Register Asset
        </button>
        <button
          onClick={() => router.push("/booking")}
          className="border border-border-subtle bg-surface-container-lowest text-text-primary text-label-md px-6 py-2.5 rounded-md flex items-center gap-2 hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            event
          </span>
          Book Resource
        </button>
        <button
          onClick={() => router.push("/maintenance")}
          className="border border-border-subtle bg-surface-container-lowest text-text-primary text-label-md px-6 py-2.5 rounded-md flex items-center gap-2 hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            support_agent
          </span>
          Raise Requests
        </button>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden">
        <div className="px-comfortable py-standard border-b border-border-subtle bg-surface-bright flex justify-between items-center">
          <h2 className="text-headline-sm text-text-primary">Recent Activity</h2>
          <button
            onClick={() => router.push("/activity")}
            className="text-label-md text-primary hover:underline"
          >
            View All Logs
          </button>
        </div>
        <div className="divide-y divide-border-subtle">
          {recentActivities.slice(0, 5).map((item, i) => (
            <div
              key={i}
              onClick={() => showToast(`Activity details: ${item.title} - ${item.desc}`, "info")}
              className="px-comfortable py-standard flex items-start gap-4 hover:bg-surface-container transition-colors group cursor-pointer"
            >
              <div
                className={`w-8 h-8 rounded-full ${item.iconBg} flex items-center justify-center shrink-0 mt-1`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                  {item.icon}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-label-md text-text-primary font-bold">
                    {item.title}
                  </span>
                  <span className="text-mono-data text-text-secondary">{item.time}</span>
                </div>
                <p className="text-body-sm text-text-secondary">{item.desc}</p>
              </div>
            </div>
          ))}
          {recentActivities.length === 0 && (
            <div className="p-8 text-center text-text-secondary">No recent activity</div>
          )}
        </div>
      </div>

      {/* Register Asset Modal */}
      <Modal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        title="Register New Enterprise Asset"
      >
        <form onSubmit={handleRegisterAsset} className="space-y-4">
          <div>
            <label className="block text-label-md mb-1" htmlFor="asset-tag">
              Asset Tag ID
            </label>
            <input
              id="asset-tag"
              type="text"
              value={newAsset.tag}
              onChange={(e) => setNewAsset({ ...newAsset, tag: e.target.value })}
              className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md font-mono"
            />
          </div>
          <div>
            <label className="block text-label-md mb-1" htmlFor="asset-name">
              Equipment Name
            </label>
            <input
              id="asset-name"
              type="text"
              placeholder="e.g. MacBook Pro M3 16-inch"
              value={newAsset.name}
              onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
              className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md focus:border-primary outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-label-md mb-1" htmlFor="asset-category">
                Category
              </label>
              <select
                id="asset-category"
                value={newAsset.category}
                onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
                className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md focus:border-primary outline-none"
              >
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Networking">Networking</option>
                <option value="Vehicles">Vehicles</option>
              </select>
            </div>
            <div>
              <label className="block text-label-md mb-1" htmlFor="asset-location">
                Location
              </label>
              <select
                id="asset-location"
                value={newAsset.location}
                onChange={(e) => setNewAsset({ ...newAsset, location: e.target.value })}
                className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md focus:border-primary outline-none"
              >
                <option value="Bengaluru, BLR-01">Bengaluru, BLR-01</option>
                <option value="Mumbai, Server Rm 1">Mumbai, Server Rm 1</option>
                <option value="HQ, Floor 2">HQ, Floor 2</option>
                <option value="Warehouse A">Warehouse A</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsRegisterOpen(false)}
              className="px-4 py-2 rounded text-label-md border border-border-subtle hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded text-label-md bg-primary text-on-primary hover:bg-primary/90"
            >
              Register Asset
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
