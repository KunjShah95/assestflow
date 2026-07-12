<<<<<<< HEAD
"use client";

import React, { useState } from "react";
import { useToast } from "@/components/ToastProvider";

export default function AllocationPage() {
  const { showToast } = useToast();

  const [toEmployee, setToEmployee] = useState("");
  const [reason, setReason] = useState("");
  const [history, setHistory] = useState([
    { date: "Mar 12, 2023", desc: "Allocated to Priya Shah", sub: "Dept: Engineering", active: true },
    { date: "Jan 04, 2023", desc: "Returned by Arjun Nair", sub: "Condition reported: Good", active: false },
    { date: "Nov 15, 2022", desc: "Asset Registered", sub: "Procurement Batch #8892", active: false },
  ]);

  const handleSubmitTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toEmployee) {
      showToast("Please select a destination employee", "error");
      return;
    }
    if (!reason.trim()) {
      showToast("Please provide a transfer reason/justification", "error");
      return;
    }

    const newEntry = {
      date: "Just now",
      desc: `Transfer Requested to ${toEmployee}`,
      sub: `Reason: ${reason}`,
      active: true,
    };

    setHistory([newEntry, ...history.map((h) => ({ ...h, active: false }))]);
    showToast(`Transfer request submitted for AF-0114 to ${toEmployee}!`, "success");
    setToEmployee("");
    setReason("");
  };
=======
'use client';

import { useState, useEffect } from 'react';
import { assetService } from '@/services/asset.service';
import { employeeService } from '@/services/employee.service';
import { allocationService } from '@/services/allocation.service';
import type { Asset } from '@/types/asset';
import type { Employee } from '@/types/employee';

export default function AllocationPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [toEmployeeId, setToEmployeeId] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    assetService.list({ status: 'available' }).then(r => setAssets(r.value || [])).catch(() => {});
    employeeService.list().then(setEmployees).catch(() => {});
  }, []);

  const selectedAsset = assets.find(a => a.id === parseInt(selectedAssetId));

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAssetId || !toEmployeeId) { setMessage('Select asset and employee'); return; }
    setLoading(true);
    try {
      await allocationService.assign({ assetId: parseInt(selectedAssetId), toEmployeeId: parseInt(toEmployeeId), notes: reason || undefined });
      setMessage('Asset allocated successfully!');
      setSelectedAssetId(''); setToEmployeeId(''); setReason('');
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Allocation failed');
    } finally { setLoading(false); }
  }
>>>>>>> 0c3e4cf95e6e6e4335d56146084439ad368addef

  return (
    <div className="flex-1 overflow-y-auto bg-surface animate-fade-in">
      <div className="max-w-6xl mx-auto p-container md:p-8 space-y-comfortable">
        <div className="flex justify-between items-end pb-4 border-b border-border-subtle">
          <div>
<<<<<<< HEAD
            <h1 className="text-headline-lg text-text-primary">Allocation &amp; Transfer</h1>
            <p className="text-body-sm text-text-secondary mt-1">
              Manage asset assignments and process transfer requests.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => showToast("Search active asset allocations", "info")}
              className="text-text-secondary hover:text-primary transition-colors p-1"
            >
              <span className="material-symbols-outlined">search</span>
            </button>
            <button
              onClick={() => showToast("No new allocation alerts", "info")}
              className="text-text-secondary hover:text-primary transition-colors p-1"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button
              onClick={() => showToast("Logged in as Priya Shah (Engineering)", "info")}
              className="text-text-secondary hover:text-primary transition-colors p-1"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </button>
=======
            <h1 className="text-headline-lg text-text-primary">Allocation & Transfer</h1>
            <p className="text-body-sm text-text-secondary mt-1">Assign assets to employees and track ownership.</p>
>>>>>>> 0c3e4cf95e6e6e4335d56146084439ad368addef
          </div>
        </div>

        {message && (
          <div className={`p-3 rounded text-body-sm ${message.includes('success') ? 'bg-success/10 text-success border border-success/20' : 'bg-error/10 text-error border border-error/20'}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-container">
<<<<<<< HEAD
          {/* Transfer Request Form */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-lg border border-border-subtle p-6 shadow-sm flex flex-col gap-6">
            <h2 className="text-headline-md text-text-primary">Transfer Request</h2>
            <form onSubmit={handleSubmitTransfer} className="space-y-5">
              {/* Asset Input */}
              <div className="space-y-1.5">
                <label className="text-label-md text-text-primary block" htmlFor="asset-input">
                  Asset
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">
                    laptop_mac
                  </span>
                  <input
                    className="w-full pl-10 pr-3 py-2 bg-surface border border-border-subtle rounded text-body-md text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    id="asset-input"
                    readOnly
                    type="text"
                    defaultValue="AF-0114 - Dell Laptop"
                  />
                </div>
              </div>

              {/* Error Banner */}
              <div className="bg-error-container/30 border border-error/50 rounded p-3 flex gap-3 items-start">
                <span className="material-symbols-outlined text-error mt-0.5">error</span>
                <div>
                  <p className="text-label-md text-error font-semibold">
                    Already Allocated to Priya Shah (Engineering)
                  </p>
                  <p className="text-body-sm text-error mt-0.5">
                    Direct re-allocation is blocked – submit a transfer request below.
                  </p>
=======
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-lg border border-border-subtle p-6 shadow-sm">
            <h2 className="text-headline-md text-text-primary mb-6">New Allocation</h2>
            <form className="space-y-5" onSubmit={handleAssign}>
              <div className="space-y-1.5">
                <label className="text-label-md text-text-primary block" htmlFor="asset-select">Asset</label>
                <select id="asset-select" className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded text-body-md text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none" value={selectedAssetId} onChange={e => setSelectedAssetId(e.target.value)}>
                  <option value="">Select available asset...</option>
                  {assets.map(a => <option key={a.id} value={a.id}>{a.tag} – {a.name}</option>)}
                </select>
              </div>

              {selectedAsset && (
                <div className="bg-surface-container-low p-3 rounded flex items-center gap-3">
                  <span className="material-symbols-outlined text-text-secondary">check_circle</span>
                  <span className="text-body-sm"><strong>{selectedAsset.tag}</strong> – {selectedAsset.name} ({selectedAsset.categoryName || 'N/A'})</span>
>>>>>>> 0c3e4cf95e6e6e4335d56146084439ad368addef
                </div>
              )}

<<<<<<< HEAD
              {/* From / To Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-label-md text-text-primary block" htmlFor="from-user">
                    From
                  </label>
                  <input
                    className="w-full px-3 py-2 bg-surface-container-low border border-border-subtle rounded text-body-md text-text-secondary cursor-not-allowed"
                    disabled
                    id="from-user"
                    type="text"
                    defaultValue="Priya Shah"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-label-md text-text-primary block" htmlFor="to-user">
                    To
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded text-body-md text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                      id="to-user"
                      value={toEmployee}
                      onChange={(e) => setToEmployee(e.target.value)}
                    >
                      <option value="">Select Employee...</option>
                      <option value="Rahul Desai">Rahul Desai (Ops)</option>
                      <option value="Anita Sharma">Anita Sharma (IT)</option>
                      <option value="Marcus Johnson">Marcus Johnson (Field Ops)</option>
                      <option value="Aditi Rao">Aditi Rao (Engineering)</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-1.5">
                <label className="text-label-md text-text-primary block" htmlFor="reason-text">
                  Reason
                </label>
                <textarea
                  className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded text-body-md text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                  id="reason-text"
                  placeholder="Provide justification for this transfer..."
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              {/* Submit */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-on-primary text-label-md py-2.5 px-6 rounded transition-colors shadow-sm flex items-center gap-2 font-medium"
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                  Submit Request
                </button>
=======
              <div className="space-y-1.5">
                <label className="text-label-md text-text-primary block" htmlFor="emp-select">Assign To</label>
                <select id="emp-select" className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded text-body-md text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none" value={toEmployeeId} onChange={e => setToEmployeeId(e.target.value)}>
                  <option value="">Select employee...</option>
                  {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name} ({emp.email})</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-label-md text-text-primary block" htmlFor="notes">Notes</label>
                <textarea id="notes" className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded text-body-md text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none" rows={3} value={reason} onChange={e => setReason(e.target.value)} placeholder="Optional notes..." />
>>>>>>> 0c3e4cf95e6e6e4335d56146084439ad368addef
              </div>

              <button type="submit" disabled={loading} className="bg-primary hover:bg-primary-container text-on-primary text-label-md py-2 px-6 rounded transition-colors shadow-sm disabled:opacity-50">
                {loading ? 'Allocating...' : 'Allocate Asset'}
              </button>
            </form>
          </div>

<<<<<<< HEAD
          {/* Contextual Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-container">
            {/* Asset Summary Card */}
            <div className="bg-surface-container-lowest rounded-lg border border-border-subtle p-5 shadow-sm">
              <h3 className="text-label-md uppercase tracking-wider text-text-secondary mb-4 border-b border-border-subtle pb-2">
                Asset Details
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-secondary-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">laptop_mac</span>
                </div>
                <div>
                  <p className="text-headline-sm text-text-primary">AF-0114</p>
                  <p className="text-body-sm text-text-secondary">Dell Latitude 7420</p>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                {[
                  { label: "Category:", value: "Electronics" },
                  { label: "Status:", value: "Allocated", badge: true },
                  { label: "Location:", value: "HQ Floor 3" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-body-sm">
                    <span className="text-text-secondary">{item.label}</span>
                    {item.badge ? (
                      <span className="bg-error/10 text-error px-2 py-0.5 rounded-full text-[10px] font-bold">
                        {item.value}
                      </span>
                    ) : (
                      <span className="text-text-primary font-medium">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Allocation History Timeline */}
            <div className="bg-surface-container-lowest rounded-lg border border-border-subtle p-5 shadow-sm flex-1">
              <h3 className="text-label-md uppercase tracking-wider text-text-secondary mb-5 border-b border-border-subtle pb-2">
                Allocation History
              </h3>
              <div className="relative border-l border-border-subtle ml-3 space-y-6">
                {history.map((item, i) => (
                  <div key={i} className="relative pl-6">
                    <div
                      className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ${
                        item.active
                          ? "bg-primary ring-4 ring-surface-container-lowest"
                          : "bg-border-subtle"
                      }`}
                    />
                    <p className="text-mono-data text-text-secondary mb-1">{item.date}</p>
                    <p className="text-body-sm text-text-primary">{item.desc}</p>
                    <p className="text-body-sm text-text-secondary text-xs mt-0.5">{item.sub}</p>
                  </div>
                ))}
              </div>
=======
          <div className="lg:col-span-1 bg-surface-container-lowest rounded-lg border border-border-subtle p-5 shadow-sm">
            <h3 className="text-label-md uppercase tracking-wider text-text-secondary mb-4 border-b border-border-subtle pb-2">Quick Info</h3>
            <div className="space-y-3 text-body-sm">
              <p><span className="text-text-secondary">Available Assets:</span> <span className="font-medium text-text-primary">{assets.length}</span></p>
              <p><span className="text-text-secondary">Employees:</span> <span className="font-medium text-text-primary">{employees.length}</span></p>
>>>>>>> 0c3e4cf95e6e6e4335d56146084439ad368addef
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
