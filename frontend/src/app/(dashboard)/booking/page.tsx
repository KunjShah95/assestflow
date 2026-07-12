<<<<<<< HEAD
"use client";

import React, { useState } from "react";
import Modal from "@/components/Modal";
import { useToast } from "@/components/ToastProvider";

interface BookingSlot {
  id: string;
  title: string;
  time: string;
  top: number;
  height: number;
  type: "booked" | "conflict";
}

export default function BookingPage() {
  const { showToast } = useToast();

  const [selectedDate, setSelectedDate] = useState("Tue, 7 Jul");
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [tempDateInput, setTempDateInput] = useState("2026-07-07");

  const [bookingForm, setBookingForm] = useState({
    title: "Engineering Review",
    timeRange: "11:00 - 12:00",
    department: "Engineering",
  });

  const [slots, setSlots] = useState<BookingSlot[]>([
    {
      id: "b1",
      title: "Booked – Procurement Team",
      time: "9:00 to 10:30",
      top: 0,
      height: 90,
      type: "booked",
    },
    {
      id: "b2",
      title: "Requested 9:30 to 10:30 – conflict – slot is unavailable",
      time: "9:30 to 10:30",
      top: 30,
      height: 60,
      type: "conflict",
    },
  ]);

  const handleOpenBookingForTime = (timeRange: string) => {
    setBookingForm({ ...bookingForm, timeRange });
    setIsBookModalOpen(true);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.title) {
      showToast("Please enter a meeting/booking title", "error");
      return;
    }

    let top = 120;
    let height = 60;
    if (bookingForm.timeRange === "12:00 - 13:00") {
      top = 180;
    } else if (bookingForm.timeRange === "13:00 - 14:00") {
      top = 240;
    }

    const newSlot: BookingSlot = {
      id: Math.random().toString(),
      title: `Booked – ${bookingForm.title} (${bookingForm.department})`,
      time: bookingForm.timeRange,
      top,
      height,
      type: "booked",
    };

    setSlots([...slots, newSlot]);
    showToast(`Confirmed slot booking: ${bookingForm.title} (${bookingForm.timeRange})`, "success");
    setIsBookModalOpen(false);
  };

  const handleUpdateDate = (e: React.FormEvent) => {
    e.preventDefault();
    const dateObj = new Date(tempDateInput);
    if (isNaN(dateObj.getTime())) {
      showToast("Invalid date selected", "error");
      return;
    }
    const formatted = dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    setSelectedDate(formatted);
    showToast(`Switched calendar to ${formatted}`, "info");
    setIsDateModalOpen(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-container bg-surface-bright animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-label-md text-text-secondary uppercase tracking-wider mb-1">
            Resource
          </h2>
          <h1 className="text-headline-lg text-text-primary flex items-center gap-2">
            Conference Room B2
            <span className="text-text-secondary text-headline-sm">
              – {selectedDate}
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDateModalOpen(true)}
            className="px-4 py-2 bg-surface border border-border-subtle rounded text-text-primary text-label-md hover:bg-surface-container-low transition-colors flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            Change Date
          </button>
          <button
            onClick={() => handleOpenBookingForTime("11:00 - 12:00")}
            className="px-4 py-2 bg-primary text-on-primary rounded text-label-md hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2 font-medium"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Book a slot
          </button>
        </div>
      </div>

      {/* Booking Calendar */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-lg shadow-sm p-comfortable relative">
        <div className="timeline-grid">
          {/* Time Column */}
          <div className="flex flex-col text-right pr-4 border-r border-border-subtle text-mono-data text-text-secondary">
            {["9:00", "10:00", "11:00", "12:00", "13:00", "14:00"].map((time, i) => (
              <div
                key={time}
                className={`timeline-row flex items-start justify-end -mt-3 ${
                  i === 5 ? "border-b-0" : ""
                }`}
              >
                <span>{time}</span>
              </div>
            ))}
          </div>

          {/* Schedule Column */}
          <div className="relative w-full pb-8" style={{ minHeight: 300 }}>
            {/* Grid Lines */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`timeline-row ${i === 5 ? "border-b-0" : ""}`} />
            ))}

            {/* Existing & Dynamic Slots */}
            {slots.map((slot) => {
              if (slot.type === "booked") {
                return (
                  <div
                    key={slot.id}
                    onClick={() =>
                      showToast(`${slot.title} (${slot.time})`, "info")
                    }
                    className="absolute left-0 right-4 bg-primary-fixed border border-primary text-on-primary-fixed rounded p-3 shadow-sm z-10 cursor-pointer hover:opacity-95 transition-opacity"
                    style={{ top: slot.top, height: slot.height }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-label-md font-bold">{slot.title}</h4>
                        <p className="text-body-sm opacity-80">{slot.time}</p>
                      </div>
                      <span className="material-symbols-outlined text-[18px] opacity-70">
                        groups
                      </span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={slot.id}
                  onClick={() =>
                    showToast("Slot conflict: requested time overlaps with existing booking", "warning")
                  }
                  className="absolute left-4 right-8 border-2 border-dashed border-error bg-error-container/30 rounded p-2 z-20 flex flex-col justify-end cursor-pointer"
                  style={{ top: slot.top, height: slot.height }}
                >
                  <div className="flex items-center gap-2 text-error">
                    <span className="material-symbols-outlined text-[16px]">warning</span>
                    <span className="text-label-md">{slot.title}</span>
                  </div>
                </div>
              );
            })}

            {/* Empty Slot Interactive Hover (11:00 - 12:00) */}
            <div
              onClick={() => handleOpenBookingForTime("11:00 - 12:00")}
              className="absolute left-0 right-4 rounded border border-transparent hover:border-primary border-dashed hover:bg-surface-container-low transition-all cursor-pointer z-0 flex items-center justify-center group"
              style={{ top: 120, height: 60 }}
            >
              <span className="opacity-0 group-hover:opacity-100 text-primary text-label-md flex items-center gap-1 transition-opacity font-medium">
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                Click to book 11:00 – 12:00
              </span>
            </div>

            {/* Empty Slot Interactive Hover (12:00 - 13:00) */}
            <div
              onClick={() => handleOpenBookingForTime("12:00 - 13:00")}
              className="absolute left-0 right-4 rounded border border-transparent hover:border-primary border-dashed hover:bg-surface-container-low transition-all cursor-pointer z-0 flex items-center justify-center group"
              style={{ top: 180, height: 60 }}
            >
              <span className="opacity-0 group-hover:opacity-100 text-primary text-label-md flex items-center gap-1 transition-opacity font-medium">
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                Click to book 12:00 – 13:00
              </span>
            </div>
          </div>
=======
'use client';

import { useState, useEffect } from 'react';
import { assetService } from '@/services/asset.service';
import { bookingService } from '@/services/booking.service';
import { useAuth } from '@/contexts/AuthContext';
import type { Asset } from '@/types/asset';
import type { Booking } from '@/types/booking';

export default function BookingPage() {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    assetService.list().then(r => setAssets(r.value || [])).catch(() => {});
    bookingService.myBookings().then(setMyBookings).catch(() => {});
  }, []);

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAssetId || !startTime || !endTime) { setMessage('Fill all fields'); return; }
    setLoading(true);
    try {
      await bookingService.create({ assetId: parseInt(selectedAssetId), startTime: new Date(startTime).toISOString(), endTime: new Date(endTime).toISOString() });
      setMessage('Booking created!');
      setSelectedAssetId(''); setStartTime(''); setEndTime('');
      bookingService.myBookings().then(setMyBookings).catch(() => {});
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Booking failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="flex-1 overflow-y-auto p-container bg-surface-bright animate-fade-in">
      <div className="mb-6">
        <h1 className="text-headline-lg text-text-primary">Resource Booking</h1>
        <p className="text-body-sm text-text-secondary mt-1">Reserve assets and resources for specific time slots.</p>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded text-body-sm ${message.includes('created') ? 'bg-success/10 text-success border border-success/20' : 'bg-error/10 text-error border border-error/20'}`}>{message}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-container-lowest border border-border-subtle rounded-lg p-comfortable shadow-sm">
          <h2 className="text-headline-sm mb-4">New Booking</h2>
          <form onSubmit={handleBook} className="space-y-4">
            <div>
              <label className="text-label-md text-text-primary block mb-1">Asset / Resource</label>
              <select className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" value={selectedAssetId} onChange={e => setSelectedAssetId(e.target.value)}>
                <option value="">Select...</option>
                {assets.map(a => <option key={a.id} value={a.id}>{a.tag} – {a.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-label-md text-text-primary block mb-1">Start</label>
                <input type="datetime-local" className="w-full px-3 py-2 border border-border-subtle rounded text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" value={startTime} onChange={e => setStartTime(e.target.value)} />
              </div>
              <div>
                <label className="text-label-md text-text-primary block mb-1">End</label>
                <input type="datetime-local" className="w-full px-3 py-2 border border-border-subtle rounded text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" value={endTime} onChange={e => setEndTime(e.target.value)} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="bg-primary text-on-primary px-4 py-2 rounded text-label-md hover:bg-primary-container transition-colors disabled:opacity-50">
              {loading ? 'Booking...' : 'Book Now'}
            </button>
          </form>
>>>>>>> 0c3e4cf95e6e6e4335d56146084439ad368addef
        </div>

<<<<<<< HEAD
      {/* Resource Details Panel */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest border border-border-subtle rounded-lg p-comfortable">
          <h3 className="text-headline-sm mb-3">Resource Details</h3>
          <dl className="space-y-2 text-body-sm">
            {[
              { label: "Capacity", value: "12 People" },
              { label: "Equipment", value: "Projector, Whiteboard" },
              { label: "Location", value: "Floor 2, East Wing" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between border-b border-surface-container-high pb-1 last:border-b-0"
              >
                <dt className="text-text-secondary">{item.label}</dt>
                <dd className="font-medium text-text-primary">{item.value}</dd>
              </div>
            ))}
          </dl>
=======
        <div className="bg-surface-container-lowest border border-border-subtle rounded-lg p-comfortable shadow-sm">
          <h3 className="text-headline-sm mb-3">My Bookings</h3>
          {myBookings.length === 0 ? (
            <p className="text-body-sm text-text-secondary">No bookings yet.</p>
          ) : (
            <ul className="space-y-3">
              {myBookings.map(b => (
                <li key={b.id} className="border-b border-border-subtle pb-2 last:border-0">
                  <p className="text-body-sm font-medium">Asset #{b.assetId}</p>
                  <p className="text-mono-data text-text-secondary">{new Date(b.startTime).toLocaleDateString()} – {new Date(b.endTime).toLocaleDateString()}</p>
                  <span className="inline-block text-[10px] uppercase font-bold text-info">{b.status}</span>
                </li>
              ))}
            </ul>
          )}
>>>>>>> 0c3e4cf95e6e6e4335d56146084439ad368addef
        </div>
      </div>

      {/* Change Date Modal */}
      <Modal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        title="Select Schedule Date"
      >
        <form onSubmit={handleUpdateDate} className="space-y-4">
          <div>
            <label className="block text-label-md mb-1" htmlFor="date-input">
              Date
            </label>
            <input
              id="date-input"
              type="date"
              value={tempDateInput}
              onChange={(e) => setTempDateInput(e.target.value)}
              className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md"
            />
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsDateModalOpen(false)}
              className="px-4 py-2 rounded text-label-md border border-border-subtle hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded text-label-md bg-primary text-on-primary hover:bg-primary/90"
            >
              Update Calendar
            </button>
          </div>
        </form>
      </Modal>

      {/* Book Slot Modal */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title="Book Resource Slot"
      >
        <form onSubmit={handleSubmitBooking} className="space-y-4">
          <div>
            <label className="block text-label-md mb-1" htmlFor="book-title">
              Booking Title / Purpose
            </label>
            <input
              id="book-title"
              type="text"
              placeholder="e.g. Q3 Sprint Planning"
              value={bookingForm.title}
              onChange={(e) => setBookingForm({ ...bookingForm, title: e.target.value })}
              className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-label-md mb-1" htmlFor="book-time">
              Time Range
            </label>
            <select
              id="book-time"
              value={bookingForm.timeRange}
              onChange={(e) => setBookingForm({ ...bookingForm, timeRange: e.target.value })}
              className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md"
            >
              <option value="11:00 - 12:00">11:00 AM - 12:00 PM</option>
              <option value="12:00 - 13:00">12:00 PM - 1:00 PM</option>
              <option value="13:00 - 14:00">1:00 PM - 2:00 PM</option>
            </select>
          </div>
          <div>
            <label className="block text-label-md mb-1" htmlFor="book-dept">
              Department
            </label>
            <select
              id="book-dept"
              value={bookingForm.department}
              onChange={(e) => setBookingForm({ ...bookingForm, department: e.target.value })}
              className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md"
            >
              <option value="Engineering">Engineering</option>
              <option value="Procurement">Procurement</option>
              <option value="IT">IT Infrastructure</option>
              <option value="HR">Human Resources</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsBookModalOpen(false)}
              className="px-4 py-2 rounded text-label-md border border-border-subtle hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded text-label-md bg-primary text-on-primary hover:bg-primary/90 font-medium"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
