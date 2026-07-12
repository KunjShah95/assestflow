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
        </div>

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
