"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { useToast } from "@/components/ToastProvider";
import { auditService } from "@/services/audit.service";

interface AuditItem {
  id: string;
  name: string;
  location: string;
  status: string;
  statusIcon: string;
  statusColor: string;
  rowBg: string;
}

export default function AuditPage() {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [auditItems, setAuditItems] = useState<AuditItem[]>([
    { id: "AF-003", name: "Dell laptop", location: "Desk E12", status: "Verified", statusIcon: "check_circle", statusColor: "text-success bg-success/10", rowBg: "" },
    { id: "AF-9921", name: "Office chair", location: "Desk E14", status: "Missing", statusIcon: "error", statusColor: "text-danger bg-danger/10", rowBg: "bg-error/5" },
    { id: "AF-9838", name: "Monitor", location: "Desk E15", status: "Damaged", statusIcon: "warning", statusColor: "text-warning bg-warning/10", rowBg: "bg-warning/5" },
    { id: "AF-004", name: "MacBook Pro", location: "Desk E16", status: "Verified", statusIcon: "check_circle", statusColor: "text-success bg-success/10", rowBg: "" },
  ]);

  useEffect(() => {
    async function fetchData() {
      try {
        const cycles = await auditService.listCycles();
        if (cycles && cycles.length > 0) {
          const latestCycle = cycles[0];
          try {
            const results = await auditService.getResults(latestCycle.id);
            if (results && results.length > 0) {
              setAuditItems(results.map((r: any) => ({
                id: `AF-${String(r.assetId).padStart(4, "0")}`,
                name: `Asset #${r.assetId}`,
                location: "On-site",
                status: r.status === "verified" ? "Verified" : r.status === "missing" ? "Missing" : "Damaged",
                statusIcon: r.status === "verified" ? "check_circle" : r.status === "missing" ? "error" : "warning",
                statusColor: r.status === "verified" ? "text-success bg-success/10" : r.status === "missing" ? "text-danger bg-danger/10" : "text-warning bg-warning/10",
                rowBg: r.status === "verified" ? "" : r.status === "missing" ? "bg-error/5" : "bg-warning/5",
              })));
            }
          } catch (err) { console.error("Failed to load audit results:", err); }
        }
      } catch (err) {
        console.error("Failed to load audit cycles:", err);
      }
    }
    fetchData();
  }, []);

  const handleToggleVerify = (id: string) => {
    setAuditItems((prev) => prev.map((item) => item.id === id ? { ...item, status: "Verified", statusIcon: "check_circle", statusColor: "text-success bg-success/10", rowBg: "" } : item));
    showToast(`Marked ${id} as Verified`, "success");
  };

  const handleExportAudit = () => showToast("Exporting Q3 Audit Report (CSV)...", "info");
  const handleSaveProgress = () => showToast("Q3 Audit progress saved successfully!", "success");

  const handleConfirmCloseCycle = () => {
    showToast("Q3 Audit Cycle Closed and locked for compliance reporting.", "success");
    setIsCloseModalOpen(false);
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center min-h-[60vh]"><div className="text-text-secondary animate-pulse font-medium">Loading audit data...</div></div>;
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background p-container animate-fade-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-headline-lg text-text-primary">Q3 Audit: Engineering Dept – 1-15 Jul</h2>
          <p className="text-body-md text-text-secondary mt-1">Auditors: A. Rao, S. Iqbal</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportAudit} className="px-4 py-2 border border-border-subtle text-text-primary rounded bg-surface-container-lowest hover:bg-surface-container-low transition-colors text-label-md flex items-center gap-2 shadow-sm font-medium">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span>Export
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-border-subtle rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low text-label-md text-text-secondary uppercase tracking-wider border-b border-border-subtle">
              <tr><th className="px-6 py-4 font-medium">Asset</th><th className="px-6 py-4 font-medium">Expected Location</th><th className="px-6 py-4 font-medium">Verification</th><th className="px-6 py-4 font-medium">Actions</th></tr>
            </thead>
            <tbody className="text-body-md divide-y divide-border-subtle">
              {auditItems.map((item) => (
                <tr key={item.id} className={`hover:bg-surface-container transition-colors ${item.rowBg}`}>
                  <td className="px-6 py-3 text-mono-data text-text-primary"><div className="font-medium">{item.id}</div><div className="text-text-secondary">{item.name}</div></td>
                  <td className="px-6 py-3 text-text-secondary">{item.location}</td>
                  <td className="px-6 py-3"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-md ${item.statusColor}`}><span className="material-symbols-outlined" style={{ fontSize: 14 }}>{item.statusIcon}</span>{item.status}</span></td>
                  <td className="px-6 py-3"><button onClick={() => handleToggleVerify(item.id)} className="text-text-secondary hover:text-primary transition-colors p-1.5 rounded hover:bg-surface-container-low" title="Verify Asset"><span className="material-symbols-outlined" style={{ fontSize: 20 }}>check_circle</span></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg flex items-start gap-3">
          <span className="material-symbols-outlined text-warning">info</span>
          <div><h3 className="text-headline-sm text-warning">{auditItems.filter((i) => i.status !== "Verified").length} assets flagged</h3>
            <p className="text-body-sm text-warning/80 mt-1">Discrepancy report generated automatically. Review required before closing cycle.</p></div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={handleSaveProgress} className="px-6 py-2.5 border border-border-subtle text-text-primary rounded bg-surface-container-lowest hover:bg-surface-container-low transition-colors text-label-md font-medium">Save Progress</button>
          <button onClick={() => setIsCloseModalOpen(true)} className="px-6 py-2.5 bg-primary text-on-primary rounded hover:bg-primary/90 transition-colors text-label-md font-medium shadow-sm">Close Audit Cycle</button>
        </div>
      </div>

      <Modal isOpen={isCloseModalOpen} onClose={() => setIsCloseModalOpen(false)} title="Close & Lock Audit Cycle">
        <div className="space-y-4">
          <p className="text-body-md text-text-primary">Are you sure you want to finalize and close the <strong>Q3 Audit: Engineering Dept</strong> cycle?</p>
          <div className="bg-surface-container-low p-4 rounded border border-border-subtle space-y-2 text-body-sm">
            <div className="flex justify-between"><span>Verified Assets:</span><span className="font-semibold text-success">{auditItems.filter((i) => i.status === "Verified").length}</span></div>
            <div className="flex justify-between"><span>Flagged Discrepancies:</span><span className="font-semibold text-warning">{auditItems.filter((i) => i.status !== "Verified").length}</span></div>
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button onClick={() => setIsCloseModalOpen(false)} className="px-4 py-2 rounded text-label-md border border-border-subtle hover:bg-surface-container">Cancel</button>
            <button onClick={handleConfirmCloseCycle} className="px-4 py-2 rounded text-label-md bg-primary text-on-primary hover:bg-primary/90 font-medium">Confirm &amp; Finalize</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
