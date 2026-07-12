<<<<<<< HEAD
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import { useToast } from "@/components/ToastProvider";

export default function DashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: "",
    category: "Electronics",
    location: "Bengaluru, BLR-01",
    tag: "AF-0250",
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      icon: "computer",
      iconBg: "bg-secondary-container text-primary",
      title: "Laptop AF-0114",
      desc: "Allocated to Priya Shah – IT Dept",
      time: "10:42 AM",
    },
    {
      icon: "meeting_room",
      iconBg: "bg-tertiary-container/20 text-tertiary",
      title: "Room B2",
      desc: "Booking confirmed – 2:00 to 3:00 PM",
      time: "09:15 AM",
    },
    {
      icon: "check_circle",
      iconBg: "bg-success/10 text-success",
      title: "Projector AF-0062",
      desc: "Maintenance resolved – ready for allocation",
      time: "Yesterday",
    },
    {
      icon: "chair",
      iconBg: "bg-secondary-container text-primary",
      title: "Office Chair AF-0201",
      desc: "Returned by Field Ops (East)",
      time: "Yesterday",
    },
  ]);

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
=======
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
>>>>>>> 0c3e4cf95e6e6e4335d56146084439ad368addef

  return (
    <div className="flex-1 overflow-y-auto p-container pb-24 animate-fade-in">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-headline-lg text-text-primary">Welcome, {user?.name}</h1>
          <p className="text-body-sm text-text-secondary mt-1">Real-time status of your enterprise assets.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
<<<<<<< HEAD
        {[
          { label: "Available", value: "128", route: "/assets" },
          { label: "Allocated", value: "76", route: "/allocation" },
          { label: "Active Bookings", value: "9", route: "/booking" },
          { label: "Pending Transfers", value: "3", route: "/allocation" },
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
=======
        {cards.map(card => (
          <div key={card.label} className="bg-surface-container-lowest border border-border-subtle rounded-lg p-standard flex flex-col hover:shadow-sm transition-shadow">
            <span className="text-label-md text-text-secondary uppercase tracking-wider mb-2">{card.label}</span>
            <span className="text-headline-lg text-text-primary font-bold">{card.value}</span>
>>>>>>> 0c3e4cf95e6e6e4335d56146084439ad368addef
          </div>
        ))}
      </div>

<<<<<<< HEAD
      {/* Alert Banner */}
      <div
        onClick={() => router.push("/activity")}
        className="bg-error-container text-on-error-container border border-error/20 rounded-lg p-standard flex items-center justify-between gap-3 mb-8 cursor-pointer hover:bg-error-container/80 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined">warning</span>
          <span className="text-body-md font-medium">
            3 assets overdue for return – flagged for follow-up
          </span>
        </div>
        <span className="text-label-md font-bold underline">Review Alerts</span>
      </div>
=======
      {(kpi?.overdueReturns ?? 0) > 0 && (
        <div className="bg-error-container text-on-error-container border border-error/20 rounded-lg p-standard flex items-center gap-3 mb-8">
          <span className="material-symbols-outlined">warning</span>
          <span className="text-body-md font-medium">{kpi?.overdueReturns} assets overdue for return – flagged for follow-up</span>
        </div>
      )}
>>>>>>> 0c3e4cf95e6e6e4335d56146084439ad368addef

      <div className="flex flex-wrap gap-4 mb-8">
<<<<<<< HEAD
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
=======
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
>>>>>>> 0c3e4cf95e6e6e4335d56146084439ad368addef
          Raise Requests
        </Link>
      </div>

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
<<<<<<< HEAD
          {recentActivities.map((item, i) => (
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
=======
          {recentActivity.length === 0 ? (
            <div className="px-comfortable py-standard text-body-sm text-text-secondary">No recent activity.</div>
          ) : recentActivity.map((item, i) => (
            <div key={i} className="px-comfortable py-standard flex items-start gap-4 hover:bg-surface-container transition-colors group">
              <div className={`w-8 h-8 rounded-full ${item.iconBg} flex items-center justify-center shrink-0 mt-1`}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{item.icon}</span>
>>>>>>> 0c3e4cf95e6e6e4335d56146084439ad368addef
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
