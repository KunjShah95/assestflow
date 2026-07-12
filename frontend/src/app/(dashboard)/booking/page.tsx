"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Modal from "@/components/Modal";
import { useApiError } from "@/hooks/useApiError";
import { bookingService } from "@/services/booking.service";
import { assetService } from "@/services/asset.service";
import type { Asset } from "@/types/asset";
import type { Booking } from "@/types/booking";
import { Calendar, Plus, Users, PlusCircle } from "lucide-react";

interface BookingSlot {
  id: string;
  title: string;
  time: string;
  top: number;
  height: number;
}

const TIMELINE_START_HOUR = 9;
const TIMELINE_END_HOUR = 18;
const ROW_HEIGHT = 60;

function minutesFromMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

function formatTime12(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function slotFromBooking(b: Booking, purpose?: string): BookingSlot {
  const start = new Date(b.startTime);
  const end = new Date(b.endTime);
  const startMin = minutesFromMidnight(start);
  const endMin = minutesFromMidnight(end);
  const label = b.status === "cancelled"
    ? "Cancelled"
    : purpose
      ? purpose
      : `Booked – ${b.status}`;
  return {
    id: `b-${b.id}`,
    title: label,
    time: `${formatTime12(start)} – ${formatTime12(end)}`,
    top: Math.max(0, startMin - TIMELINE_START_HOUR * 60),
    height: Math.max(endMin - startMin, 30),
  };
}

function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function BookingPage() {
  const { showToast, handleError } = useApiError();

  const [loading, setLoading] = useState(true);
  const [bookableAssets, setBookableAssets] = useState<Asset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(toDateString(new Date()));
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [tempDateInput, setTempDateInput] = useState(toDateString(new Date()));

  const [bookingForm, setBookingForm] = useState({
    title: "",
    timeRange: "11:00 - 12:00",
  });

  const [slots, setSlots] = useState<BookingSlot[]>([]);

  const selectedAsset = bookableAssets.find((a) => a.id === selectedAssetId) ?? bookableAssets[0] ?? null;

  const loadBookings = useCallback(async (assetId: number, date: string) => {
    const dayStart = `${date}T00:00:00`;
    const dayEnd = `${date}T23:59:59`;
    const bookings = await bookingService.calendar(assetId, dayStart, dayEnd);
    const mapped = (bookings || [])
      .filter((b) => b.status !== "cancelled")
      .map((b) => slotFromBooking(b));
    setSlots(mapped);
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const assets = await assetService.list();
        const bookable = (assets || []).filter((a) => a.isBookable);
        setBookableAssets(bookable);
        if (bookable.length > 0) {
          setSelectedAssetId(bookable[0].id);
          await loadBookings(bookable[0].id, selectedDate);
        }
      } catch (err) {
        handleError(err, "Could not load booking data");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [selectedDate, loadBookings, handleError]);

  useEffect(() => {
    if (selectedAssetId) {
      const t = setTimeout(() => {
        loadBookings(selectedAssetId, selectedDate).catch((err) =>
          handleError(err, "Could not load bookings for this date")
        );
      }, 0);
      return () => clearTimeout(t);
    }
  }, [selectedAssetId, selectedDate, loadBookings, handleError]);

  const timelineHeight = (TIMELINE_END_HOUR - TIMELINE_START_HOUR) * ROW_HEIGHT;
  const hourLabels = useMemo(() => {
    const labels: string[] = [];
    for (let h = TIMELINE_START_HOUR; h < TIMELINE_END_HOUR; h++) {
      labels.push(`${h}:00`);
    }
    return labels;
  }, []);

  const handleOpenBookingForTime = (timeRange: string) => {
    setBookingForm({ ...bookingForm, timeRange });
    setIsBookModalOpen(true);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId) {
      showToast("No bookable resource selected", "error");
      return;
    }
    if (!bookingForm.title.trim()) {
      showToast("Please enter a meeting/booking title", "error");
      return;
    }
    try {
      const [startStr, endStr] = bookingForm.timeRange.split(" - ");
      await bookingService.create({
        assetId: selectedAssetId,
        startTime: `${selectedDate}T${startStr}:00`,
        endTime: `${selectedDate}T${endStr}:00`,
      });

      await loadBookings(selectedAssetId, selectedDate);
      showToast(`Confirmed: ${bookingForm.title} (${bookingForm.timeRange})`, "success");
      setIsBookModalOpen(false);
      setBookingForm({ title: "", timeRange: "11:00 - 12:00" });
    } catch (err) {
      handleError(err, "Booking failed");
    }
  };

  const handleUpdateDate = (e: React.FormEvent) => {
    e.preventDefault();
    const dateObj = new Date(`${tempDateInput}T12:00:00`);
    if (isNaN(dateObj.getTime())) {
      showToast("Invalid date selected", "error");
      return;
    }
    setSelectedDate(tempDateInput);
    setIsDateModalOpen(false);
  };

  const dateLabel = selectedDate === toDateString(new Date())
    ? "Today"
    : new Date(`${selectedDate}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-text-secondary animate-pulse font-medium">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-container bg-surface-bright animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-label-md text-text-secondary uppercase tracking-wider mb-1">Resource</h2>
          <h1 className="text-headline-lg text-text-primary flex items-center gap-2">
            {selectedAsset?.name ?? "No resource"}
            <span className="text-text-secondary text-headline-sm">– {dateLabel}</span>
          </h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {bookableAssets.length > 1 && (
            <select
              value={selectedAssetId ?? ""}
              onChange={(e) => setSelectedAssetId(parseInt(e.target.value))}
              className="px-3 py-2 bg-surface border border-border-subtle rounded text-body-sm"
            >
              {bookableAssets.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          )}
          <button onClick={() => setIsDateModalOpen(true)} className="px-4 py-2 bg-surface border border-border-subtle rounded text-text-primary text-label-md hover:bg-surface-container-low transition-colors flex items-center gap-2 shadow-sm">
            <Calendar size={18} />
            Change Date
          </button>
          <button onClick={() => handleOpenBookingForTime("11:00 - 12:00")} className="px-4 py-2 bg-primary text-on-primary rounded text-label-md hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2 font-medium">
            <Plus size={18} />
            Book a slot
          </button>
        </div>
      </div>

      {bookableAssets.length === 0 ? (
        <div className="bg-surface-container-lowest border border-border-subtle rounded-lg p-8 text-center text-text-secondary">
          No bookable resources found in the asset directory.
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-border-subtle rounded-lg shadow-sm p-comfortable relative">
          <div className="timeline-grid">
            <div className="flex flex-col text-right pr-4 border-r border-border-subtle text-mono-data text-text-secondary">
              {hourLabels.map((time, i) => (
                <div key={time} className={`timeline-row flex items-start justify-end pt-1 ${i === hourLabels.length - 1 ? "border-b-0" : ""}`}>
                  <span>{time}</span>
                </div>
              ))}
            </div>
            <div className="relative w-full overflow-y-auto" style={{ height: timelineHeight }}>
              {hourLabels.map((_, i) => (
                <div key={i} className={`timeline-row ${i === hourLabels.length - 1 ? "border-b-0" : ""}`} />
              ))}
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => showToast(`${slot.title} (${slot.time})`, "info")}
                  className="absolute left-0 right-4 bg-primary-fixed border border-primary text-on-primary-fixed rounded p-3 shadow-sm z-10 cursor-pointer hover:opacity-95 transition-opacity"
                  style={{ top: slot.top, height: slot.height }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-label-md font-bold truncate">{slot.title}</h4>
                      <p className="text-body-sm opacity-80">{slot.time}</p>
                    </div>
                    <Users size={18} className="opacity-70 shrink-0" />
                  </div>
                </div>
              ))}
              {slots.length === 0 && (
                <div
                  onClick={() => handleOpenBookingForTime("11:00 - 12:00")}
                  className="absolute left-0 right-4 rounded border border-dashed border-border-subtle hover:border-primary hover:bg-surface-container-low transition-all cursor-pointer z-0 flex items-center justify-center group"
                  style={{ top: 120, height: 60 }}
                >
                  <span className="text-text-secondary group-hover:text-primary text-label-md flex items-center gap-1 font-medium">
                    <PlusCircle size={16} />Click to book 11:00 – 12:00
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedAsset && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest border border-border-subtle rounded-lg p-comfortable">
            <h3 className="text-headline-sm mb-3">Resource Details</h3>
            <dl className="space-y-2 text-body-sm">
              <div className="flex justify-between border-b border-surface-container-high pb-1">
                <dt className="text-text-secondary">Tag</dt>
                <dd className="font-medium text-text-primary">{selectedAsset.assetTag}</dd>
              </div>
              <div className="flex justify-between border-b border-surface-container-high pb-1">
                <dt className="text-text-secondary">Location</dt>
                <dd className="font-medium text-text-primary">{selectedAsset.location || "N/A"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-secondary">Status</dt>
                <dd className="font-medium text-text-primary capitalize">{selectedAsset.status}</dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      <Modal isOpen={isDateModalOpen} onClose={() => setIsDateModalOpen(false)} title="Select Schedule Date">
        <form onSubmit={handleUpdateDate} className="space-y-4">
          <div>
            <label className="block text-label-md mb-1" htmlFor="date-input">Date</label>
            <input id="date-input" type="date" value={tempDateInput} onChange={(e) => setTempDateInput(e.target.value)} className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md" />
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={() => setIsDateModalOpen(false)} className="px-4 py-2 rounded text-label-md border border-border-subtle hover:bg-surface-container">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded text-label-md bg-primary text-on-primary hover:bg-primary/90">Update Calendar</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isBookModalOpen} onClose={() => setIsBookModalOpen(false)} title="Book Resource Slot">
        <form onSubmit={handleSubmitBooking} className="space-y-4">
          <div>
            <label className="block text-label-md mb-1" htmlFor="book-title">Booking Title / Purpose</label>
            <input id="book-title" type="text" placeholder="e.g. Q3 Sprint Planning" value={bookingForm.title} onChange={(e) => setBookingForm({ ...bookingForm, title: e.target.value })} className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md focus:border-primary outline-none" required />
          </div>
          <div>
            <label className="block text-label-md mb-1" htmlFor="book-time">Time Range</label>
            <select id="book-time" value={bookingForm.timeRange} onChange={(e) => setBookingForm({ ...bookingForm, timeRange: e.target.value })} className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md">
              <option value="09:00 - 10:00">9:00 AM - 10:00 AM</option>
              <option value="10:00 - 11:00">10:00 AM - 11:00 AM</option>
              <option value="11:00 - 12:00">11:00 AM - 12:00 PM</option>
              <option value="12:00 - 13:00">12:00 PM - 1:00 PM</option>
              <option value="13:00 - 14:00">1:00 PM - 2:00 PM</option>
              <option value="14:00 - 15:00">2:00 PM - 3:00 PM</option>
              <option value="15:00 - 16:00">3:00 PM - 4:00 PM</option>
              <option value="16:00 - 17:00">4:00 PM - 5:00 PM</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsBookModalOpen(false)} className="px-4 py-2 rounded text-label-md border border-border-subtle hover:bg-surface-container">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded text-label-md bg-primary text-on-primary hover:bg-primary/90 font-medium">Confirm Booking</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
