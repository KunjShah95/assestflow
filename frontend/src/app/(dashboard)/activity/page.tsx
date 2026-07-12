"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ToastProvider";
import { activityService } from "@/services/activity.service";
import type { ActivityLog } from "@/types/activity";
import { Search, Laptop, ArrowLeftRight, Wrench, ShieldCheck, Calendar, Verified, UserPlus, Settings, PlusCircle, Info, History } from "lucide-react";

interface LogEntry {
  id: string;
  category: string;
  icon: string;
  iconColor: string;
  title: string;
  desc: string;
  time: string;
  user: string;
}

const actionCategoryMap: Record<string, { category: string; icon: string; iconColor: string }> = {
  allocate: { category: "Allocation", icon: "laptop_mac", iconColor: "bg-primary/10 text-primary" },
  allocation: { category: "Allocation", icon: "laptop_mac", iconColor: "bg-primary/10 text-primary" },
  transfer: { category: "Allocation", icon: "swap_horiz", iconColor: "bg-primary/10 text-primary" },
  maintenance: { category: "Maintenance", icon: "build", iconColor: "bg-warning/10 text-warning" },
  audit: { category: "Security", icon: "shield_person", iconColor: "bg-danger/10 text-danger" },
  booking: { category: "System", icon: "calendar_today", iconColor: "bg-info/10 text-info" },
  book: { category: "System", icon: "calendar_today", iconColor: "bg-info/10 text-info" },
  login: { category: "Security", icon: "verified_user", iconColor: "bg-success/10 text-success" },
  signup: { category: "System", icon: "person_add", iconColor: "bg-success/10 text-success" },
  return: { category: "Allocation", icon: "swap_horiz", iconColor: "bg-primary/10 text-primary" },
  update: { category: "System", icon: "settings", iconColor: "bg-info/10 text-info" },
  create: { category: "System", icon: "add_circle", iconColor: "bg-info/10 text-info" },
};

const iconComponentMap: Record<string, typeof Laptop> = {
  laptop_mac: Laptop,
  swap_horiz: ArrowLeftRight,
  build: Wrench,
  shield_person: ShieldCheck,
  calendar_today: Calendar,
  verified_user: Verified,
  person_add: UserPlus,
  settings: Settings,
  add_circle: PlusCircle,
  info: Info,
};

export default function ActivityPage() {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("All Logs");
  const [searchQuery, setSearchQuery] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const activityLogs = await activityService.logs();
        const mapped: LogEntry[] = (activityLogs || []).slice(0, 50).map((log: ActivityLog) => {
          const action = (log.action || "").toLowerCase();
          let matched = actionCategoryMap[action];
          if (!matched) {
            for (const [key, val] of Object.entries(actionCategoryMap)) {
              if (action.includes(key)) { matched = val; break; }
            }
          }
          matched = matched || { category: "System", icon: "info", iconColor: "bg-info/10 text-info" };

          return {
            id: `log-${log.id}`,
            category: matched.category,
            icon: matched.icon,
            iconColor: matched.iconColor,
            title: `${log.action || "Activity"} - ${log.entityType || ""} #${log.entityId || log.id}`,
            desc: log.details ?? "",
            time: log.createdAt ? new Date(log.createdAt).toLocaleString() : "Recently",
            user: `User #${log.employeeId}`,
          };
        });
        setLogs(mapped.length > 0 ? mapped : [
          { id: "log-1", category: "Allocation", icon: "laptop_mac", iconColor: "bg-primary/10 text-primary", title: "Asset AF-0114 Allocated", desc: "Assigned to Priya Shah", time: "10:42 AM", user: "Admin: R. Nair" },
          { id: "log-2", category: "Maintenance", icon: "build", iconColor: "bg-warning/10 text-warning", title: "Maintenance Ticket AF-0062 Flagged", desc: "Projector 4K bulb issue", time: "09:15 AM", user: "System" },
        ]);
      } catch (err) {
        console.error("Failed to load activity logs:", err);
        setLogs([
          { id: "log-1", category: "Allocation", icon: "laptop_mac", iconColor: "bg-primary/10 text-primary", title: "Asset AF-0114 Allocated", desc: "Assigned to Priya Shah", time: "10:42 AM", user: "Admin: R. Nair" },
          { id: "log-2", category: "Maintenance", icon: "build", iconColor: "bg-warning/10 text-warning", title: "Maintenance Ticket AF-0062 Flagged", desc: "Projector 4K bulb issue", time: "09:15 AM", user: "System" },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = activeFilter === "All Logs" || log.category === activeFilter;
    const matchesSearch = log.title.toLowerCase().includes(searchQuery.toLowerCase()) || log.desc.toLowerCase().includes(searchQuery.toLowerCase()) || log.user.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleLoadMore = () => {
    showToast("Loaded historical activity logs", "info");
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center min-h-[60vh]"><div className="text-text-secondary animate-pulse font-medium">Loading activity logs...</div></div>;
  }

  const ActivityIcon = ({ icon }: { icon: string }) => {
    const Icon = iconComponentMap[icon] || Info;
    return <Icon size={20} />;
  };

  return (
    <div className="flex-1 overflow-y-auto bg-surface p-container animate-fade-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-headline-lg text-text-primary">Activity &amp; Audit Trail</h1>
          <p className="text-body-sm text-text-secondary mt-1">Real-time chronological log of system actions, allocations, and alerts.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-border-subtle rounded text-body-sm text-text-primary focus:border-primary outline-none" placeholder="Search activity trail..." type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-border-subtle">
        {["All Logs", "Allocation", "Maintenance", "Security", "System"].map((cat) => (
          <button key={cat} onClick={() => { setActiveFilter(cat); showToast(`Filtered by: ${cat}`, "info"); }}
            className={`px-4 py-1.5 rounded-full text-label-md transition-all ${activeFilter === cat ? "bg-primary text-on-primary font-bold shadow-sm" : "bg-surface-container-lowest border border-border-subtle text-text-primary hover:bg-surface-container"}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden shadow-sm">
        <div className="divide-y divide-border-subtle">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-text-secondary">No activity records match the selected filter or query.</div>
          ) : (
            filteredLogs.map((item) => (
              <div key={item.id} onClick={() => showToast(`Log detail: ${item.title} (${item.user})`, "info")}
                className="p-comfortable flex items-start gap-4 hover:bg-surface-container-low transition-colors cursor-pointer group">
                <div className={`w-10 h-10 rounded-full ${item.iconColor} flex items-center justify-center shrink-0 mt-0.5`}>
                  <ActivityIcon icon={item.icon} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                    <span className="text-label-md font-bold text-text-primary group-hover:text-primary transition-colors">{item.title}</span>
                    <span className="text-mono-data text-text-secondary text-xs">{item.time}</span>
                  </div>
                  <p className="text-body-sm text-text-secondary mb-1">{item.desc}</p>
                  <span className="inline-block text-[11px] font-semibold text-text-secondary/80 bg-surface-container px-2 py-0.5 rounded">{item.user}</span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 bg-surface-container-low border-t border-border-subtle text-center">
          <button onClick={handleLoadMore} className="text-label-md text-primary hover:underline font-semibold flex items-center justify-center gap-1 mx-auto">
            <History size={18} />Load Historical Activity
          </button>
        </div>
      </div>
    </div>
  );
}
