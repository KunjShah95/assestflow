"use client";

import React, { useState } from "react";
import { useToast } from "@/components/ToastProvider";

interface LogEntry {
  id: string;
  category: "Security" | "System" | "Maintenance" | "Allocation";
  icon: string;
  iconColor: string;
  title: string;
  desc: string;
  time: string;
  user: string;
}

export default function ActivityPage() {
  const { showToast } = useToast();

  const [activeFilter, setActiveFilter] = useState<string>("All Logs");
  const [searchQuery, setSearchQuery] = useState("");

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "log-1",
      category: "Allocation",
      icon: "laptop_mac",
      iconColor: "bg-primary/10 text-primary",
      title: "Asset AF-0114 Allocated",
      desc: "Assigned to Priya Shah (Engineering Department)",
      time: "10:42 AM",
      user: "Admin: R. Nair",
    },
    {
      id: "log-2",
      category: "Maintenance",
      icon: "build",
      iconColor: "bg-warning/10 text-warning",
      title: "Maintenance Ticket AF-0062 Flagged",
      desc: "Projector 4K bulb issue reported in HQ Floor 2",
      time: "09:15 AM",
      user: "System Automations",
    },
    {
      id: "log-3",
      category: "Security",
      icon: "shield_person",
      iconColor: "bg-danger/10 text-danger",
      title: "Audit Discrepancy Recorded",
      desc: "Office Chair AF-9921 flagged as missing during Q3 Audit",
      time: "Yesterday, 4:30 PM",
      user: "Auditor: A. Rao",
    },
    {
      id: "log-4",
      category: "System",
      icon: "settings",
      iconColor: "bg-info/10 text-info",
      title: "Organization Hierarchy Updated",
      desc: "Added Field Ops (West) sub-department",
      time: "Yesterday, 1:15 PM",
      user: "Admin: R. Nair",
    },
    {
      id: "log-5",
      category: "Allocation",
      icon: "swap_horiz",
      iconColor: "bg-primary/10 text-primary",
      title: "Transfer Completed",
      desc: "Cisco Router X1 transferred to Mumbai Server Room 1",
      time: "6 Jul, 2026",
      user: "Logistics Team",
    },
  ]);

  const filteredLogs = logs.filter((log) => {
    const matchesFilter =
      activeFilter === "All Logs" || log.category === activeFilter;
    const matchesSearch =
      log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleLoadMore = () => {
    const moreLogs: LogEntry[] = [
      {
        id: `log-${Date.now()}-1`,
        category: "System",
        icon: "cloud_sync",
        iconColor: "bg-info/10 text-info",
        title: "Automated Backup Completed",
        desc: "Snapshot #4492 saved to secure enterprise vault",
        time: "5 Jul, 2026",
        user: "System Automations",
      },
      {
        id: `log-${Date.now()}-2`,
        category: "Security",
        icon: "verified_user",
        iconColor: "bg-success/10 text-success",
        title: "Security Token Rotated",
        desc: "API gateway authentication certificate renewed successfully",
        time: "3 Jul, 2026",
        user: "Security Ops",
      },
    ];
    setLogs([...logs, ...moreLogs]);
    showToast("Loaded historical activity logs", "info");
  };

  return (
    <div className="flex-1 overflow-y-auto bg-surface p-container animate-fade-in">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-headline-lg text-text-primary">
            Activity &amp; Audit Trail
          </h1>
          <p className="text-body-sm text-text-secondary mt-1">
            Real-time chronological log of system actions, allocations, and alerts.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[20px]">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-border-subtle rounded text-body-sm text-text-primary focus:border-primary outline-none"
            placeholder="Search activity trail..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-border-subtle">
        {["All Logs", "Allocation", "Maintenance", "Security", "System"].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveFilter(cat);
                showToast(`Filtered by: ${cat}`, "info");
              }}
              className={`px-4 py-1.5 rounded-full text-label-md transition-all ${
                activeFilter === cat
                  ? "bg-primary text-on-primary font-bold shadow-sm"
                  : "bg-surface-container-lowest border border-border-subtle text-text-primary hover:bg-surface-container"
              }`}
            >
              {cat}
            </button>
          )
        )}
      </div>

      {/* Activity List */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden shadow-sm">
        <div className="divide-y divide-border-subtle">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-text-secondary">
              No activity records match the selected filter or query.
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

        {/* Load More Footer */}
        <div className="p-4 bg-surface-container-low border-t border-border-subtle text-center">
          <button
            onClick={handleLoadMore}
            className="text-label-md text-primary hover:underline font-semibold flex items-center justify-center gap-1 mx-auto"
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
            Load Historical Activity
          </button>
        </div>
      </div>
    </div>
  );
}
