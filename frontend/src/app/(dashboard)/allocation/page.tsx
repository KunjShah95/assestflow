"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useApiError } from "@/hooks/useApiError";
import { allocationService } from "@/services/allocation.service";
import { Search, Bell, Laptop, AlertCircle, ChevronDown, Send } from "lucide-react";

interface HistoryEntry {
  date: string;
  desc: string;
  sub: string;
  active: boolean;
}

export default function AllocationPage() {
  const { showToast, handleError } = useApiError();

  const [loading, setLoading] = useState(true);
  const [toEmployee, setToEmployee] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    async function fetchAllocations() {
      try {
        const records = await allocationService.list();
        const mapped: HistoryEntry[] = (records || []).map((r) => ({
          date: r.allocatedAt ? new Date(r.allocatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently",
          desc: r.returnedAt
            ? `Returned by ${r.employeeName || `Emp #${r.employeeId}`}`
            : `Allocated to ${r.employeeName || `Emp #${r.employeeId}`}`,
          sub: r.returnedAt
            ? `Condition: ${r.conditionCheckinNotes || "Not reported"}`
            : `Dept: ${r.departmentName || "N/A"}`,
          active: r.status === "active",
        }));
        setHistory(mapped.length > 0 ? mapped : [
          { date: "Mar 12, 2023", desc: "Allocated to Priya Shah", sub: "Dept: Engineering", active: true },
          { date: "Jan 04, 2023", desc: "Returned by Arjun Nair", sub: "Condition reported: Good", active: false },
        ]);
      } catch (err) {
        handleError(err, "Could not load allocation history");
        setHistory([
          { date: "Mar 12, 2023", desc: "Allocated to Priya Shah", sub: "Dept: Engineering", active: true },
          { date: "Jan 04, 2023", desc: "Returned by Arjun Nair", sub: "Condition reported: Good", active: false },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchAllocations();
  }, []);

  const handleSubmitTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toEmployee) {
      showToast("Please select a destination employee", "error");
      return;
    }
    if (!reason.trim()) {
      showToast("Please provide a transfer reason/justification", "error");
      return;
    }

    setSubmitting(true);
    try {
      await allocationService.requestTransfer({
        assetId: 114,
        toEmployeeId: 2,
        reason: reason.trim(),
      });

      const newEntry: HistoryEntry = { date: "Just now", desc: `Transfer Requested to ${toEmployee}`, sub: `Reason: ${reason}`, active: true };
      setHistory((prev) => [newEntry, ...prev.map((h) => ({ ...h, active: false }))]);
      showToast(`Transfer request submitted for AF-0114 to ${toEmployee}!`, "success");
      setToEmployee("");
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
            <p className="text-body-sm text-text-secondary mt-1">Manage asset assignments and process transfer requests.</p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => showToast("Search active asset allocations", "info")} className="text-text-secondary hover:text-primary transition-colors p-1">
              <Search size={20} />
            </button>
            <button onClick={() => showToast("No new allocation alerts", "info")} className="text-text-secondary hover:text-primary transition-colors p-1">
              <Bell size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-container">
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-lg border border-border-subtle p-6 shadow-sm flex flex-col gap-6">
            <h2 className="text-headline-md text-text-primary">Transfer Request</h2>
            <form onSubmit={handleSubmitTransfer} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-label-md text-text-primary block" htmlFor="asset-input">Asset</label>
                <div className="relative">
                  <Laptop size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                  <input className="w-full pl-10 pr-3 py-2 bg-surface border border-border-subtle rounded text-body-md text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" id="asset-input" readOnly type="text" defaultValue="AF-0114 - Dell Laptop" />
                </div>
              </div>

              <div className="bg-error-container/30 border border-error/50 rounded p-3 flex gap-3 items-start">
                <AlertCircle size={20} className="text-error mt-0.5 shrink-0" />
                <div>
                  <p className="text-label-md text-error font-semibold">Already Allocated to Priya Shah (Engineering)</p>
                  <p className="text-body-sm text-error mt-0.5">Direct re-allocation is blocked – submit a transfer request below.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-label-md text-text-primary block" htmlFor="from-user">From</label>
                  <input className="w-full px-3 py-2 bg-surface-container-low border border-border-subtle rounded text-body-md text-text-secondary cursor-not-allowed" disabled id="from-user" type="text" defaultValue="Priya Shah" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-label-md text-text-primary block" htmlFor="to-user">To</label>
                  <div className="relative">
                    <select className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded text-body-md text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none" id="to-user" value={toEmployee} onChange={(e) => setToEmployee(e.target.value)}>
                      <option value="">Select Employee...</option>
                      <option value="Rahul Desai">Rahul Desai (Ops)</option>
                      <option value="Anita Sharma">Anita Sharma (IT)</option>
                      <option value="Marcus Johnson">Marcus Johnson (Field Ops)</option>
                      <option value="Aditi Rao">Aditi Rao (Engineering)</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-label-md text-text-primary block" htmlFor="reason-text">Reason</label>
                <textarea className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded text-body-md text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none" id="reason-text" placeholder="Provide justification for this transfer..." rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={submitting}
                  className="bg-primary hover:bg-primary/90 text-on-primary text-label-md py-2.5 px-6 rounded transition-colors shadow-sm flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                  <Send size={16} />
                  {submitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-container">
            <div className="bg-surface-container-lowest rounded-lg border border-border-subtle p-5 shadow-sm">
              <h3 className="text-label-md uppercase tracking-wider text-text-secondary mb-4 border-b border-border-subtle pb-2">Asset Details</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-secondary-container flex items-center justify-center text-primary"><Laptop size={24} /></div>
                <div><p className="text-headline-sm text-text-primary">AF-0114</p><p className="text-body-sm text-text-secondary">Dell Latitude 7420</p></div>
              </div>
              <div className="space-y-2 mt-4">
                {[{ label: "Category:", value: "Electronics" }, { label: "Status:", value: "Allocated", badge: true }, { label: "Location:", value: "HQ Floor 3" }].map((item) => (
                  <div key={item.label} className="flex justify-between text-body-sm">
                    <span className="text-text-secondary">{item.label}</span>
                    {item.badge ? <span className="bg-error/10 text-error px-2 py-0.5 rounded-full text-[10px] font-bold">{item.value}</span> : <span className="text-text-primary font-medium">{item.value}</span>}
                  </div>
                ))}
              </div>
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
