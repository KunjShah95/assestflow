'use client';

import { useState, useEffect } from 'react';
import { assetService } from '@/services/asset.service';
import { bookingService } from '@/services/booking.service';
import type { Asset } from '@/types/asset';

export default function BookingPage() {
  const [resources, setResources] = useState<Asset[]>([]);
  const [selectedResource, setSelectedResource] = useState('CR-201');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [bookingPurpose, setBookingPurpose] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    assetService.list()
      .then(res => {
        // Filter bookable assets
        const list = (res.value || []).filter((a: any) => a.isBookable);
        setResources(list);
      })
      .catch(() => {});
  }, []);

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startTime || !endTime || !bookingPurpose) {
      setMessage('Please fill in all booking details.');
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setMessage('Booking request submitted! Awaiting manager confirmation.');
      setIsBookModalOpen(false);
      setStartTime('');
      setEndTime('');
      setBookingPurpose('');
    } catch {
      setMessage('Failed to create booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 animate-fade-in max-w-[1200px] mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-headline-lg font-bold text-text-primary">Resource Booking</h1>
        <p className="text-body-sm text-text-secondary mt-1">
          Reserve conference rooms, shared workspaces, or vehicles.
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-body-md font-bold shadow-sm ${
          message.includes('submitted') 
            ? 'bg-success/10 text-success border border-success/20' 
            : 'bg-error/10 text-error border border-error/20'
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline column */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl border border-border-subtle p-8 shadow-sm">
          {/* Selector */}
          <div className="mb-8 space-y-1.5">
            <label className="text-label-md font-bold text-text-secondary block">
              Resource
            </label>
            <select
              className="w-full px-4 py-3 bg-surface border border-border-subtle rounded-xl text-body-md text-text-primary font-bold focus:border-primary outline-none cursor-pointer"
              value={selectedResource}
              onChange={e => setSelectedResource(e.target.value)}
            >
              <option value="CR-201">Conference Room 201 - Max 8 Pax</option>
              <option value="CR-102">Conference Room 102 - Max 4 Pax</option>
              <option value="AUD-A">Main Auditorium - Max 100 Pax</option>
            </select>
          </div>

          {/* Visual Timeline Schedule */}
          <div className="relative border-l border-border-subtle pl-6 space-y-8 py-2">
            {/* Timeline hour 10:00 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-1 bg-surface-container-low px-2 py-0.5 rounded text-mono-data font-bold text-text-secondary text-[11px] border border-border-subtle">
                10:00
              </div>
              <div className="ml-4">
                {/* Booked Block (Blue) */}
                <div className="bg-[#eff6ff] border border-primary/20 text-[#1e40af] rounded-xl p-4 shadow-xs">
                  <div className="text-body-md font-black">Booked – Procurement Team</div>
                  <div className="text-mono-data text-xs mt-1 font-bold">9:30 AM – 11:00 AM</div>
                </div>
              </div>
            </div>

            {/* Timeline hour 11:00 */}
            <div className="relative h-4">
              <div className="absolute -left-[31px] top-0 bg-surface-container-low px-2 py-0.5 rounded text-mono-data font-bold text-text-secondary text-[11px] border border-border-subtle">
                11:00
              </div>
            </div>

            {/* Timeline hour 12:00 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-1 bg-surface-container-low px-2 py-0.5 rounded text-mono-data font-bold text-text-secondary text-[11px] border border-border-subtle">
                12:00
              </div>
              <div className="ml-4">
                {/* Conflict Block (Red dashed) */}
                <div className="border-2 border-dashed border-danger bg-danger/5 text-danger rounded-xl p-4 shadow-xs">
                  <div className="text-body-md font-black">Requesting 11:30 to 12:30</div>
                  <div className="text-body-sm font-bold mt-1">Conflict – slot is unavailable</div>
                </div>
              </div>
            </div>

            {/* Timeline hour 13:00 */}
            <div className="relative h-4">
              <div className="absolute -left-[31px] top-0 bg-surface-container-low px-2 py-0.5 rounded text-mono-data font-bold text-text-secondary text-[11px] border border-border-subtle">
                13:00
              </div>
            </div>

            {/* Timeline hour 14:00 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-0 bg-surface-container-low px-2 py-0.5 rounded text-mono-data font-bold text-text-secondary text-[11px] border border-border-subtle">
                14:00
              </div>
              <div className="ml-4 text-text-muted text-body-sm italic">
                No subsequent bookings scheduled for today.
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border-subtle">
            <button
              onClick={() => setIsBookModalOpen(true)}
              className="bg-primary hover:bg-surface-tint text-on-primary text-label-md px-6 py-3 rounded-lg font-bold shadow-md cursor-pointer transition-colors"
            >
              Book a slot
            </button>
          </div>
        </div>

        {/* Info panel */}
        <div className="bg-surface-container-lowest rounded-2xl border border-border-subtle p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-headline-sm font-bold text-text-primary mb-4 border-b border-border-subtle pb-2">
              Booking Policy
            </h3>
            <ul className="space-y-3 text-body-sm text-text-secondary list-disc pl-4 leading-relaxed">
              <li>Conference Room bookings are limited to a maximum of 2 hours per department slot.</li>
              <li>Overlapping reservation requests are automatically flagged as conflicts.</li>
              <li>Please cancel any unused bookings at least 1 hour in advance.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Book a Slot Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 bg-text-primary/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl w-full max-w-md p-8 shadow-2xl animate-fade-in">
            <h3 className="text-headline-md font-bold text-text-primary mb-6">Book Resource</h3>
            <form onSubmit={handleBookSubmit} className="space-y-4">
              <div>
                <label className="block text-label-md font-bold text-text-secondary mb-1">
                  Resource
                </label>
                <input
                  type="text"
                  value="Conference Room 201"
                  disabled
                  className="w-full px-3 py-2 bg-surface-container-low border border-border-subtle rounded-lg text-body-md text-text-secondary outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-label-md font-bold text-text-secondary mb-1" htmlFor="booking-purpose">
                  Booking Purpose
                </label>
                <input
                  id="booking-purpose"
                  type="text"
                  placeholder="e.g. Weekly Sync, Client Pitch"
                  value={bookingPurpose}
                  onChange={e => setBookingPurpose(e.target.value)}
                  className="w-full bg-surface border border-border-subtle rounded-lg px-3 py-2 text-body-md focus:border-primary outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-label-md font-bold text-text-secondary mb-1" htmlFor="start-time">
                    Start Time
                  </label>
                  <input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full bg-surface border border-border-subtle rounded-lg px-3 py-2 text-body-md focus:border-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-label-md font-bold text-text-secondary mb-1" htmlFor="end-time">
                    End Time
                  </label>
                  <input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full bg-surface border border-border-subtle rounded-lg px-3 py-2 text-body-md focus:border-primary outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle mt-6">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-label-md border border-border-subtle hover:bg-surface-container font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg text-label-md bg-primary text-on-primary hover:bg-surface-tint font-bold shadow-md cursor-pointer"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
