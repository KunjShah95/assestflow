"use client";

import React, { useState, useEffect, useRef } from "react";
import Modal from "@/components/Modal";
import { useApiError } from "@/hooks/useApiError";
import { bookingService } from "@/services/booking.service";
import { Calendar, Plus, Users, AlertTriangle, PlusCircle, Trash2 } from "lucide-react";

const START_HOUR = 0;
const END_HOUR = 24;

interface BookingSlot {
  id: string;
  title: string;
  time: string;
  top: number;
  height: number;
  type: "booked" | "conflict";
}

export default function BookingPage() {
  const { showToast, handleError } = useApiError();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("Today");
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [tempDateInput, setTempDateInput] = useState(new Date().toISOString().split("T")[0]);

  const [bookingForm, setBookingForm] = useState({
    title: "Engineering Review",
    timeRange: "11:00 - 12:00",
    department: "Engineering",
  });

  const [slots, setSlots] = useState<BookingSlot[]>([]);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const bookings = await bookingService.list();
        const mappedSlots: BookingSlot[] = (bookings || []).map((b) => {
          const startDate = new Date(b.startTime);
          const endDate = new Date(b.endTime);
          const startHour = startDate.getHours() + startDate.getMinutes() / 60;
          const endHour = endDate.getHours() + endDate.getMinutes() / 60;
          const top = startHour * 60;
          const height = (endHour - startHour) * 60;

          const startStr = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
          const endStr = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

          return {
            id: `b-${b.id}`,
            title: `Booked – ${b.status === "cancelled" ? "Cancelled" : b.status}`,
            time: `${startStr} to ${endStr}`,
            top,
            height: Math.max(height, 30),
            type: "booked" as const,
          };
        });

        setSlots(mappedSlots.length > 0 ? mappedSlots : [
          { id: "b1", title: "Booked – Procurement Team", time: "09:00 to 10:30", top: 9 * 60, height: 90, type: "booked" },
          { id: "b2", title: "Requested 09:30 to 10:30 – conflict", time: "09:30 to 10:30", top: 9.5 * 60, height: 60, type: "conflict" },
        ]);
      } catch (err) {
        handleError(err, "Could not load bookings");
        setSlots([
          { id: "b1", title: "Booked – Procurement Team", time: "09:00 to 10:30", top: 9 * 60, height: 90, type: "booked" },
          { id: "b2", title: "Requested 09:30 to 10:30 – conflict", time: "09:30 to 10:30", top: 9.5 * 60, height: 60, type: "conflict" },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  // Scroll to 8:00 AM position initially once loaded
  useEffect(() => {
    if (!loading && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 8 * 60 - 20;
    }
  }, [loading]);

  const handleOpenBookingForTime = (timeRange: string) => {
    setBookingForm({ ...bookingForm, timeRange });
    setIsBookModalOpen(true);
  };

  const handleCancelBooking = async (slotId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (confirm("Are you sure you want to cancel/delete this booking?")) {
      try {
        if (slotId.startsWith("b-")) {
          const numericId = parseInt(slotId.replace("b-", ""));
          await bookingService.cancel(numericId);
        }
        setSlots(slots.filter((s) => s.id !== slotId));
        showToast("Booking cancelled and removed successfully", "success");
      } catch (err) {
        handleError(err, "Failed to cancel booking");
      }
    }
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.title) {
      showToast("Please enter a meeting/booking title", "error");
      return;
    }
    try {
      const [startStr, endStr] = bookingForm.timeRange.split(" - ");
      const today = new Date().toISOString().split("T")[0];
      const newBooking = await bookingService.create({
        assetId: 4,
        startTime: `${today}T${startStr}:00`,
        endTime: `${today}T${endStr}:00`,
      });

      const startHour = parseInt(startStr.split(":")[0]);
      const endHour = parseInt(endStr.split(":")[0]);
      const top = startHour * 60;
      const height = (endHour - startHour) * 60;

      const newSlot: BookingSlot = {
        id: `b-${newBooking.id}`,
        title: `Booked – ${bookingForm.title} (${bookingForm.department})`,
        time: bookingForm.timeRange,
        top,
        height: Math.max(height, 30),
        type: "booked",
      };
      setSlots([...slots, newSlot]);
      showToast(`Confirmed slot booking: ${bookingForm.title} (${bookingForm.timeRange})`, "success");
      setIsBookModalOpen(false);
    } catch (err) {
      handleError(err, "Booking failed");
    }
  };

  const handleUpdateDate = (e: React.FormEvent) => {
    e.preventDefault();
    const dateObj = new Date(tempDateInput);
    if (isNaN(dateObj.getTime())) {
      showToast("Invalid date selected", "error");
      return;
    }
    const formatted = dateObj.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });
    setSelectedDate(formatted);
    showToast(`Switched calendar to ${formatted}`, "info");
    setIsDateModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-text-secondary animate-pulse font-medium">Loading bookings...</div>
      </div>
    );
  }

  const totalRows = END_HOUR - START_HOUR;
  const hoursList: string[] = [];
  for (let h = START_HOUR; h <= END_HOUR; h++) {
    hoursList.push(`${h.toString().padStart(2, "0")}:00`);
  }

  return (
    <div className="flex-1 overflow-y-auto p-container bg-surface-bright animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-label-md text-text-secondary uppercase tracking-wider mb-1">Resource</h2>
          <h1 className="text-headline-lg text-text-primary flex items-center gap-2">
            Conference Room B2
            <span className="text-text-secondary text-headline-sm">– {selectedDate}</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
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

      <div className="bg-surface-container-lowest border border-border-subtle rounded-lg shadow-sm relative overflow-hidden">
        {/* Scrollable Container */}
        <div ref={scrollContainerRef} className="h-[550px] overflow-y-auto p-comfortable relative scroll-smooth">
          <div className="timeline-grid pb-4">
            {/* Left Column: Time Labels aligned exactly to grid lines */}
            <div className="relative border-r border-border-subtle text-mono-data text-text-secondary select-none pr-4 text-right" style={{ height: totalRows * 60 }}>
              {hoursList.map((time, i) => (
                <div key={time} className="absolute right-4 -translate-y-1/2" style={{ top: i * 60 }}>
                  {time}
                </div>
              ))}
            </div>

            {/* Right Column: 24 Grid Rows and absolute positioned Bookings */}
            <div className="relative w-full" style={{ height: totalRows * 60 }}>
              {Array.from({ length: totalRows }).map((_, i) => (
                <div key={i} className={`timeline-row ${i === totalRows - 1 ? "border-b-0" : ""}`} />
              ))}
              {slots.map((slot) => {
                const isCancelled = slot.title.toLowerCase().includes("cancelled");
                if (slot.type === "booked") {
                  return (
                    <div key={slot.id} onClick={() => showToast(`${slot.title} (${slot.time})`, "info")}
                      className={`absolute left-0 right-4 border rounded p-3 shadow-sm z-10 cursor-pointer hover:opacity-95 transition-opacity ${
                        isCancelled 
                          ? "bg-surface-container border-border-subtle text-text-secondary line-through opacity-60" 
                          : "bg-primary-fixed border-primary text-on-primary-fixed"
                      }`}
                      style={{ top: slot.top, height: slot.height }}>
                      <div className="flex justify-between items-start h-full">
                        <div>
                          <h4 className="text-label-md font-bold">{slot.title}</h4>
                          <p className="text-body-sm opacity-80">{slot.time}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={(e) => handleCancelBooking(slot.id, e)} className="p-1 rounded hover:bg-black/10 text-current transition-colors" title="Cancel/Delete booking">
                            <Trash2 size={16} />
                          </button>
                          <Users size={18} className="opacity-70" />
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={slot.id} onClick={() => showToast("Slot conflict", "warning")}
                    className="absolute left-4 right-8 border-2 border-dashed border-error bg-error-container/30 rounded p-2 z-20 flex flex-col justify-end cursor-pointer"
                    style={{ top: slot.top, height: slot.height }}>
                    <div className="flex items-center gap-2 text-error">
                      <AlertTriangle size={16} />
                      <span className="text-label-md">{slot.title}</span>
                    </div>
                  </div>
                );
              })}
              
              {/* Click to book slots */}
              {Array.from({ length: totalRows }).map((_, idx) => {
                const hour = START_HOUR + idx;
                const nextHour = hour + 1;
                const timeRange = `${hour.toString().padStart(2, "0")}:00 - ${nextHour.toString().padStart(2, "0")}:00`;
                const top = idx * 60;
                
                // Check if slot is occupied
                const isOccupied = slots.some(slot => {
                  const [startStr, endStr] = slot.time.split(/ to | - /);
                  const startH = parseInt(startStr.split(":")[0]);
                  const endH = parseInt(endStr.split(":")[0]);
                  return hour >= startH && hour < endH;
                });
                
                if (isOccupied) return null;

                return (
                  <div key={`empty-${hour}`} onClick={() => handleOpenBookingForTime(timeRange)}
                    className="absolute left-0 right-4 rounded border border-transparent hover:border-primary border-dashed hover:bg-surface-container-low transition-all cursor-pointer z-0 flex items-center justify-center group"
                    style={{ top, height: 60 }}>
                    <span className="opacity-0 group-hover:opacity-100 text-primary text-label-md flex items-center gap-1 transition-opacity font-medium">
                      <PlusCircle size={16} />Click to book {timeRange}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest border border-border-subtle rounded-lg p-comfortable">
          <h3 className="text-headline-sm mb-3">Resource Details</h3>
          <dl className="space-y-2 text-body-sm">
            {[{ label: "Capacity", value: "12 People" }, { label: "Equipment", value: "Projector, Whiteboard" }, { label: "Location", value: "Floor 2, East Wing" }].map((item) => (
              <div key={item.label} className="flex justify-between border-b border-surface-container-high pb-1 last:border-b-0">
                <dt className="text-text-secondary">{item.label}</dt>
                <dd className="font-medium text-text-primary">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

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
            <input id="book-title" type="text" placeholder="e.g. Q3 Sprint Planning" value={bookingForm.title} onChange={(e) => setBookingForm({ ...bookingForm, title: e.target.value })} className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block text-label-md mb-1" htmlFor="book-time">Time Range</label>
            <select id="book-time" value={bookingForm.timeRange} onChange={(e) => setBookingForm({ ...bookingForm, timeRange: e.target.value })} className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md focus:border-primary outline-none">
              {Array.from({ length: 24 }).map((_, idx) => {
                const hour = idx;
                const nextHour = idx + 1;
                const timeRange = `${hour.toString().padStart(2, "0")}:00 - ${nextHour.toString().padStart(2, "0")}:00`;
                return (
                  <option key={timeRange} value={timeRange}>
                    {timeRange}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block text-label-md mb-1" htmlFor="book-dept">Department</label>
            <select id="book-dept" value={bookingForm.department} onChange={(e) => setBookingForm({ ...bookingForm, department: e.target.value })} className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md">
              <option value="Engineering">Engineering</option>
              <option value="Procurement">Procurement</option>
              <option value="IT">IT Infrastructure</option>
              <option value="HR">Human Resources</option>
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
