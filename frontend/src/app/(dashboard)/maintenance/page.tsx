"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { useToast } from "@/components/ToastProvider";
import { maintenanceService } from "@/services/maintenance.service";
import type { MaintenanceRequest } from "@/types/maintenance";
import { Search, Plus, CheckCircle, Calendar, Wrench } from "lucide-react";

interface MaintenanceCard {
  id: string;
  title: string;
  priority?: string;
  priorityColor?: string;
  date?: string;
  assignee?: string;
  avatar?: string;
  borderLeft?: boolean;
  completed?: string;
}

interface Column {
  title: string;
  color: string;
  faded?: boolean;
  cards: MaintenanceCard[];
}

export default function MaintenancePage() {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ assetId: "AF-0125", title: "", priority: "High" });

  const [columns, setColumns] = useState<Column[]>([
    { title: "Pending", color: "bg-warning", cards: [] },
    { title: "Approved", color: "bg-info", cards: [] },
    { title: "In Progress", color: "bg-primary", cards: [] },
    { title: "Resolved", color: "bg-success", faded: true, cards: [] },
  ]);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const requests = await maintenanceService.list();
        const pending: MaintenanceCard[] = [];
        const approved: MaintenanceCard[] = [];
        const inProgress: MaintenanceCard[] = [];
        const resolved: MaintenanceCard[] = [];

        (requests || []).forEach((req: MaintenanceRequest) => {
          const r = req as MaintenanceRequest & Record<string, unknown>;
          const card: MaintenanceCard = {
            id: `AF-${String(req.assetId || req.id).padStart(4, "0")}`,
            title: req.description || "No description",
            priority: req.priority === "high" ? "High" : req.priority === "medium" ? "Med" : "Low",
            priorityColor: req.priority === "high" ? "bg-danger/10 text-danger" : req.priority === "medium" ? "bg-warning/10 text-warning" : "bg-surface-container-highest text-text-secondary",
            date: req.createdAt ? `Reported: ${new Date(req.createdAt).toLocaleDateString()}` : "Recently",
          };
          if (req.status === "pending") pending.push(card);
          else if (req.status === "approved") approved.push({ ...card, assignee: (r.assignedTechnician as string) || "Unassigned", borderLeft: true });
          else if (req.status === "in_progress") inProgress.push({ ...card, assignee: (r.assignedTechnician as string) || "Tech assigned", avatar: "T" });
          else if (req.status === "resolved") resolved.push({ ...card, completed: `Completed: ${r.resolvedAt ? new Date(r.resolvedAt as string).toLocaleDateString() : "Recently"}` });
        });

        setColumns([
          { title: "Pending", color: "bg-warning", cards: pending.length > 0 ? pending : [{ id: "AF-0062", title: "Projector bulb not turning on", priority: "High", priorityColor: "bg-danger/10 text-danger", date: "Reported: Today" }] },
          { title: "Approved", color: "bg-info", cards: approved.length > 0 ? approved : [{ id: "AF-003", title: "AC unit noisy compressor", priority: "Low", priorityColor: "bg-surface-container-highest text-text-secondary", assignee: "Unassigned", borderLeft: true }] },
          { title: "In Progress", color: "bg-primary", cards: inProgress.length > 0 ? inProgress : [{ id: "AF-0078", title: "Forklift engine diagnostic", priority: "High", priorityColor: "bg-danger/10 text-danger", assignee: "Tech: R. Varma", avatar: "RV" }] },
          { title: "Resolved", color: "bg-success", faded: true, cards: resolved.length > 0 ? resolved : [{ id: "AF-897", title: "Printer Jam - parts ordered & replaced", completed: "Completed: 5 Jul" }] },
        ]);
      } catch {
        setColumns([
          { title: "Pending", color: "bg-warning", cards: [{ id: "AF-0062", title: "Projector bulb not turning on", priority: "High", priorityColor: "bg-danger/10 text-danger", date: "Reported: Today" }, { id: "AF-0112", title: "Leaking water cooler", priority: "Med", priorityColor: "bg-warning/10 text-warning", date: "Reported: Yesterday" }] },
          { title: "Approved", color: "bg-info", cards: [{ id: "AF-003", title: "AC unit noisy compressor", priority: "Low", priorityColor: "bg-surface-container-highest text-text-secondary", assignee: "Unassigned", borderLeft: true }] },
          { title: "In Progress", color: "bg-primary", cards: [{ id: "AF-0078", title: "Forklift engine diagnostic", priority: "High", priorityColor: "bg-danger/10 text-danger", assignee: "Tech: R. Varma", avatar: "RV" }] },
          { title: "Resolved", color: "bg-success", faded: true, cards: [{ id: "AF-897", title: "Printer Jam", completed: "Completed: 5 Jul" }] },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showToast("Please describe the maintenance issue", "error");
      return;
    }
    try {
      await maintenanceService.create({
        assetId: parseInt(form.assetId.replace("AF-", "")),
        description: form.title,
        priority: form.priority.toLowerCase(),
      });

      const priorityColor = form.priority === "High" ? "bg-danger/10 text-danger" : form.priority === "Med" ? "bg-warning/10 text-warning" : "bg-surface-container-highest text-text-secondary";
      const newCard: MaintenanceCard = { id: form.assetId, title: form.title, priority: form.priority, priorityColor, date: "Reported: Just now" };
      setColumns(columns.map((col) => col.title === "Pending" ? { ...col, cards: [newCard, ...col.cards] } : col));
      showToast(`Maintenance request logged for ${form.assetId}`, "success");
      setIsModalOpen(false);
      setForm({ assetId: `AF-${Math.floor(100 + Math.random() * 900)}`, title: "", priority: "High" });
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to create request", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-text-secondary animate-pulse font-medium">Loading maintenance requests...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-surface animate-fade-in">
      <div className="px-container py-comfortable border-b border-border-subtle bg-surface-container-lowest shrink-0 flex justify-between items-center">
        <div>
          <h1 className="text-headline-lg text-text-primary">Maintenance Board</h1>
          <p className="text-body-sm text-text-secondary mt-1">Track and manage asset repairs and servicing</p>
        </div>
        <div className="flex gap-standard">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input className="pl-10 pr-4 py-2 border border-border-subtle rounded bg-surface-container-lowest text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64 transition-shadow" placeholder="Search tasks..." type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-primary text-on-primary px-4 py-2 rounded text-label-md flex items-center gap-2 hover:bg-primary/90 transition-colors font-medium shadow-sm">
            <Plus size={18} />
            New Request
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-container">
        <div className="flex gap-container h-full min-w-max">
          {columns.map((col) => {
            const visibleCards = col.cards.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase()));
            return (
              <div key={col.title} className={`w-80 flex flex-col bg-surface-container-low rounded-lg p-standard border border-border-subtle shrink-0 ${col.faded ? "opacity-80 hover:opacity-100 transition-opacity" : ""}`} style={{ minHeight: "calc(100vh - 200px)" }}>
                <div className="flex justify-between items-center mb-standard">
                  <h2 className="text-headline-sm text-text-primary flex items-center gap-2 uppercase tracking-wide"><span className={`w-2 h-2 rounded-full ${col.color}`} />{col.title}</h2>
                  <span className="text-mono-data bg-surface-container-highest px-2 py-1 rounded text-text-secondary font-semibold">{visibleCards.length}</span>
                </div>
                <div className="flex flex-col gap-standard overflow-y-auto pr-1 pb-4">
                  {visibleCards.length === 0 ? <p className="text-body-sm text-text-secondary italic text-center py-4">No matching tasks</p> : visibleCards.map((card) => {
                    if ("completed" in card && card.completed) {
                      return (
                        <div key={card.id} onClick={() => showToast(`Resolved task: ${card.title}`, "info")} className="bg-success/5 border border-success/20 rounded-lg p-standard cursor-pointer transition-all flex flex-col gap-compact hover:shadow-sm">
                          <div className="flex justify-between items-start"><span className="text-mono-data font-bold text-text-secondary line-through">{card.id}</span></div>
                          <div className="text-label-md text-text-secondary">{card.title}</div>
                          <div className="flex items-center gap-1 text-success mt-2"><CheckCircle size={14} /><span className="text-[11px] font-medium">{card.completed}</span></div>
                        </div>
                      );
                    }
                    return (
                      <div key={card.id} onClick={() => showToast(`Active Ticket ${card.id}: ${card.title}`, "info")} className={`bg-surface-container-lowest border border-border-subtle rounded-lg p-standard cursor-pointer transition-all flex flex-col gap-compact hover:shadow-md ${card.borderLeft ? "border-l-2 border-l-info" : ""}`}>
                        <div className="flex justify-between items-start">
                          <span className="text-mono-data font-bold text-text-primary">{card.id}</span>
                          {card.priority && <span className={`${card.priorityColor} px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider`}>{card.priority}</span>}
                        </div>
                        <div className="text-label-md text-text-primary line-clamp-2">{card.title}</div>
                        {card.date && <div className="flex items-center gap-1 text-text-secondary mt-2"><Calendar size={14} /><span className="text-[11px]">{card.date}</span></div>}
                        {card.assignee && (
                          <div className="mt-2 pt-2 border-t border-border-subtle flex justify-between items-center">
                            <div className={`flex items-center gap-1 ${card.avatar ? "text-primary" : "text-text-secondary"}`}><Wrench size={14} /><span className="text-[11px] font-medium">{card.assignee}</span></div>
                            {card.avatar && <div className="w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-text-secondary">{card.avatar}</div>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log New Maintenance Request">
        <form onSubmit={handleCreateRequest} className="space-y-4">
          <div><label className="block text-label-md mb-1" htmlFor="maint-asset">Asset Tag ID</label>
            <input id="maint-asset" type="text" value={form.assetId} onChange={(e) => setForm({ ...form, assetId: e.target.value })} className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md font-mono" /></div>
          <div><label className="block text-label-md mb-1" htmlFor="maint-title">Issue Summary</label>
            <input id="maint-title" type="text" placeholder="e.g. Broken screen hinge / Fan overheating" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md focus:border-primary outline-none" /></div>
          <div><label className="block text-label-md mb-1" htmlFor="maint-priority">Priority Severity</label>
            <select id="maint-priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md">
              <option value="High">High (Immediate Action Required)</option><option value="Med">Medium (Normal Servicing Queue)</option><option value="Low">Low (Scheduled Inspection)</option></select></div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded text-label-md border border-border-subtle hover:bg-surface-container">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded text-label-md bg-primary text-on-primary hover:bg-primary/90 font-medium">Submit Ticket</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
