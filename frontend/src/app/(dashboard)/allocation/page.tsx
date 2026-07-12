"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import { useApiError } from "@/hooks/useApiError";
import { allocationService } from "@/services/allocation.service";
import { employeeService } from "@/services/employee.service";
import { assetService } from "@/services/asset.service";
import type { Employee } from "@/types/employee";
import type { Asset } from "@/types/asset";
import { Search, Bell, Laptop, AlertCircle, ChevronDown, Send, UserPlus } from "lucide-react";

interface HistoryEntry {
  date: string;
  desc: string;
  sub: string;
  active: boolean;
}

interface ActiveAllocation {
  id: number;
  assetId: number;
  assetName: string | null;
  assetTag: string | null;
  employeeId: number;
  employeeName: string | null;
  departmentName: string | null;
}

export default function AllocationPage() {
  const { showToast, handleError } = useApiError();

  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"allocate" | "transfer">("allocate");
  const [activeAllocations, setActiveAllocations] = useState<ActiveAllocation[]>([]);
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);
  const [selectedAllocationId, setSelectedAllocationId] = useState<number | null>(null);
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [allocateEmployeeId, setAllocateEmployeeId] = useState("");
  const [toEmployeeId, setToEmployeeId] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const loadData = useCallback(async () => {
    const [records, emps, assets] = await Promise.all([
      allocationService.list(),
      employeeService.list(),
      assetService.list({ status: "available" }),
    ]);

    const active = (records || []).filter((r) => r.status === "active");
    setActiveAllocations(active);
    if (active.length > 0) {
      setSelectedAllocationId(active[0].id);
    }

    const available = assets || [];
    setAvailableAssets(available);
    if (available.length > 0) {
      setSelectedAssetId(available[0].id);
    }

    setEmployees(emps || []);

    const mapped: HistoryEntry[] = (records || []).map((r) => ({
      date: r.allocatedAt
        ? new Date(r.allocatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "Recently",
      desc: r.returnedAt
        ? `Returned by ${r.employeeName || `Emp #${r.employeeId}`}`
        : `Allocated to ${r.employeeName || `Emp #${r.employeeId}`}`,
      sub: r.returnedAt
        ? `Condition: ${r.conditionCheckinNotes || "Not reported"}`
        : `Dept: ${r.departmentName || "N/A"}`,
      active: r.status === "active",
    }));
    setHistory(mapped);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        await loadData();
      } catch (err) {
        handleError(err, "Could not load allocation data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [loadData, handleError]);

  const selected = activeAllocations.find((a) => a.id === selectedAllocationId) ?? activeAllocations[0] ?? null;
  const selectedAsset = availableAssets.find((a) => a.id === selectedAssetId) ?? availableAssets[0] ?? null;

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) {
      showToast("No available asset selected", "error");
      return;
    }
    if (!allocateEmployeeId) {
      showToast("Please select an employee", "error");
      return;
    }

    const emp = employees.find((e) => e.id === parseInt(allocateEmployeeId));
    setSubmitting(true);
    try {
      await allocationService.assign({
        assetId: selectedAsset.id,
        employeeId: parseInt(allocateEmployeeId),
        departmentId: emp?.departmentId ?? undefined,
      });
      showToast(`${selectedAsset.assetTag} allocated to ${emp?.name}!`, "success");
      setAllocateEmployeeId("");
      await loadData();
      setMode("transfer");
    } catch (err) {
      handleError(err, "Allocation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) {
      showToast("No allocated asset selected for transfer", "error");
      return;
    }
    if (!toEmployeeId) {
      showToast("Please select a destination employee", "error");
      return;
    }
    if (!reason.trim()) {
      showToast("Please provide a transfer reason/justification", "error");
      return;
    }
    if (parseInt(toEmployeeId) === selected.employeeId) {
      showToast("Cannot transfer to the current holder", "error");
      return;
    }

    setSubmitting(true);
    try {
      await allocationService.requestTransfer({
        assetId: selected.assetId,
        toEmployeeId: parseInt(toEmployeeId),
        reason: reason.trim(),
      });

      const toName = employees.find((e) => e.id === parseInt(toEmployeeId))?.name ?? "employee";
      const newEntry: HistoryEntry = {
        date: "Just now",
        desc: `Transfer Requested to ${toName}`,
        sub: `Reason: ${reason}`,
        active: true,
      };
      setHistory([newEntry, ...history.map((h) => ({ ...h, active: false }))]);
      showToast(`Transfer request submitted for ${selected.assetTag} to ${toName}!`, "success");
      setToEmployeeId("");
      setReason("");
    } catch (err) {
      handleError(err, "Transfer request failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-text-secondary animate-pulse font-medium">Loading allocation data...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-surface animate-fade-in">
      <div className="max-w-6xl mx-auto p-container md:p-8 space-y-comfortable">
        <div className="flex justify-between items-end pb-4 border-b border-border-subtle">
          <div>
            <h1 className="text-headline-lg text-text-primary">Allocation &amp; Transfer</h1>
            <p className="text-body-sm text-text-secondary mt-1">Allocate available assets or process transfer requests.</p>
          </div>
        </div>

        <div className="flex gap-2 border-b border-border-subtle pb-0">
          <button
            onClick={() => setMode("allocate")}
            className={`px-4 py-2 text-label-md border-b-2 transition-colors ${mode === "allocate" ? "border-primary text-primary font-bold" : "border-transparent text-text-secondary"}`}
          >
            Allocate Asset
          </button>
          <button
            onClick={() => setMode("transfer")}
            className={`px-4 py-2 text-label-md border-b-2 transition-colors ${mode === "transfer" ? "border-primary text-primary font-bold" : "border-transparent text-text-secondary"}`}
          >
            Transfer Request
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-container">
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-lg border border-border-subtle p-6 shadow-sm flex flex-col gap-6">
            {mode === "allocate" ? (
              <>
                <h2 className="text-headline-md text-text-primary">Allocate Available Asset</h2>
                {availableAssets.length === 0 ? (
                  <div className="text-body-sm text-text-secondary py-8 text-center">
                    No available assets to allocate. All assets are currently assigned or unavailable.
                  </div>
                ) : (
                  <form onSubmit={handleAllocate} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-label-md text-text-primary block" htmlFor="avail-asset">Asset</label>
                      <div className="relative">
                        <Laptop size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                        <select
                          id="avail-asset"
                          className="w-full pl-10 pr-3 py-2 bg-surface border border-border-subtle rounded text-body-md text-text-primary focus:border-primary outline-none appearance-none"
                          value={selectedAssetId ?? ""}
                          onChange={(e) => setSelectedAssetId(parseInt(e.target.value))}
                        >
                          {availableAssets.map((a) => (
                            <option key={a.id} value={a.id}>{a.assetTag} - {a.name}</option>
                          ))}
                        </select>
                        <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-label-md text-text-primary block" htmlFor="alloc-employee">Assign To</label>
                      <div className="relative">
                        <select
                          id="alloc-employee"
                          className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded text-body-md text-text-primary focus:border-primary outline-none appearance-none"
                          value={allocateEmployeeId}
                          onChange={(e) => setAllocateEmployeeId(e.target.value)}
                        >
                          <option value="">Select Employee...</option>
                          {employees.map((e) => (
                            <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
                          ))}
                        </select>
                        <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button type="submit" disabled={submitting} className="bg-primary hover:bg-primary/90 text-on-primary text-label-md py-2.5 px-6 rounded transition-colors shadow-sm flex items-center gap-2 font-medium disabled:opacity-50">
                        <UserPlus size={16} />
                        {submitting ? "Allocating..." : "Allocate Asset"}
                      </button>
                    </div>
                  </form>
                )}
              </>
            ) : (
              <>
                <h2 className="text-headline-md text-text-primary">Transfer Request</h2>
                {activeAllocations.length === 0 ? (
                  <div className="text-body-sm text-text-secondary py-8 text-center">
                    No actively allocated assets available for transfer.
                  </div>
                ) : (
                  <form onSubmit={handleSubmitTransfer} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-label-md text-text-primary block" htmlFor="asset-input">Asset</label>
                      <div className="relative">
                        <Laptop size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                        <select
                          id="asset-input"
                          className="w-full pl-10 pr-3 py-2 bg-surface border border-border-subtle rounded text-body-md text-text-primary focus:border-primary outline-none appearance-none"
                          value={selectedAllocationId ?? ""}
                          onChange={(e) => setSelectedAllocationId(parseInt(e.target.value))}
                        >
                          {activeAllocations.map((a) => (
                            <option key={a.id} value={a.id}>{a.assetTag} - {a.assetName}</option>
                          ))}
                        </select>
                        <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                      </div>
                    </div>

                    {selected && (
                      <div className="bg-error-container/30 border border-error/50 rounded p-3 flex gap-3 items-start">
                        <AlertCircle size={20} className="text-error mt-0.5 shrink-0" />
                        <div>
                          <p className="text-label-md text-error font-semibold">
                            Already Allocated to {selected.employeeName} ({selected.departmentName || "N/A"})
                          </p>
                          <p className="text-body-sm text-error mt-0.5">Submit a transfer request to reassign this asset.</p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-label-md text-text-primary block" htmlFor="from-user">From</label>
                        <input className="w-full px-3 py-2 bg-surface-container-low border border-border-subtle rounded text-body-md text-text-secondary cursor-not-allowed" disabled id="from-user" type="text" value={selected?.employeeName ?? ""} readOnly />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-label-md text-text-primary block" htmlFor="to-user">To</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded text-body-md text-text-primary focus:border-primary outline-none appearance-none" id="to-user" value={toEmployeeId} onChange={(e) => setToEmployeeId(e.target.value)}>
                            <option value="">Select Employee...</option>
                            {employees.filter((e) => e.id !== selected?.employeeId).map((e) => (
                              <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
                            ))}
                          </select>
                          <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-label-md text-text-primary block" htmlFor="reason-text">Reason</label>
                      <textarea className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded text-body-md text-text-primary focus:border-primary outline-none resize-none" id="reason-text" placeholder="Provide justification for this transfer..." rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button type="submit" disabled={submitting} className="bg-primary hover:bg-primary/90 text-on-primary text-label-md py-2.5 px-6 rounded transition-colors shadow-sm flex items-center gap-2 font-medium disabled:opacity-50">
                        <Send size={16} />
                        {submitting ? "Submitting..." : "Submit Request"}
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>

          <div className="lg:col-span-1 flex flex-col gap-container">
            <div className="bg-surface-container-lowest rounded-lg border border-border-subtle p-5 shadow-sm">
              <h3 className="text-label-md uppercase tracking-wider text-text-secondary mb-4 border-b border-border-subtle pb-2">Asset Details</h3>
              {mode === "allocate" && selectedAsset ? (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-secondary-container flex items-center justify-center text-primary"><Laptop size={24} /></div>
                    <div>
                      <p className="text-headline-sm text-text-primary">{selectedAsset.assetTag}</p>
                      <p className="text-body-sm text-text-secondary">{selectedAsset.name}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-body-sm"><span className="text-text-secondary">Location:</span><span className="text-text-primary font-medium">{selectedAsset.location || "N/A"}</span></div>
                    <div className="flex justify-between text-body-sm"><span className="text-text-secondary">Status:</span><span className="bg-success/10 text-success px-2 py-0.5 rounded-full text-[10px] font-bold">Available</span></div>
                  </div>
                </>
              ) : selected ? (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-secondary-container flex items-center justify-center text-primary"><Laptop size={24} /></div>
                    <div>
                      <p className="text-headline-sm text-text-primary">{selected.assetTag}</p>
                      <p className="text-body-sm text-text-secondary">{selected.assetName}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-body-sm"><span className="text-text-secondary">Holder:</span><span className="text-text-primary font-medium">{selected.employeeName}</span></div>
                    <div className="flex justify-between text-body-sm"><span className="text-text-secondary">Department:</span><span className="text-text-primary font-medium">{selected.departmentName || "N/A"}</span></div>
                    <div className="flex justify-between text-body-sm"><span className="text-text-secondary">Status:</span><span className="bg-error/10 text-error px-2 py-0.5 rounded-full text-[10px] font-bold">Allocated</span></div>
                  </div>
                </>
              ) : (
                <p className="text-body-sm text-text-secondary">No asset selected.</p>
              )}
            </div>

            <div className="bg-surface-container-lowest rounded-lg border border-border-subtle p-5 shadow-sm flex-1">
              <h3 className="text-label-md uppercase tracking-wider text-text-secondary mb-5 border-b border-border-subtle pb-2">Allocation History</h3>
              <div className="relative border-l border-border-subtle ml-3 space-y-6">
                {history.length === 0 ? (
                  <p className="pl-6 text-body-sm text-text-secondary italic">No allocation history available.</p>
                ) : (
                  history.map((item, i) => (
                    <div key={i} className="relative pl-6">
                      <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ${item.active ? "bg-primary ring-4 ring-surface-container-lowest" : "bg-border-subtle"}`} />
                      <p className="text-mono-data text-text-secondary mb-1">{item.date}</p>
                      <p className="text-body-sm text-text-primary">{item.desc}</p>
                      <p className="text-body-sm text-text-secondary text-xs mt-0.5">{item.sub}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
