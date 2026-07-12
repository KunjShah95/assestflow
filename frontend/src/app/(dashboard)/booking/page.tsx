export default function BookingPage() {
  return (
    <div className="flex-1 overflow-y-auto p-container bg-surface-bright animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-label-md text-text-secondary uppercase tracking-wider mb-1">Resource</h2>
          <h1 className="text-headline-lg text-text-primary flex items-center gap-2">
            Conference Room B2
            <span className="text-text-secondary text-headline-sm">– Tue, 7 Jul</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-surface border border-border-subtle rounded text-text-primary text-label-md hover:bg-surface-container-low transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            Change Date
          </button>
          <button className="px-4 py-2 bg-primary text-on-primary rounded text-label-md hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2">
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
            {["9:00", "10:00", "11:00", "12:00", "13:00"].map((time, i) => (
              <div key={time} className={`timeline-row flex items-start justify-end -mt-3 ${i === 4 ? "border-b-0" : ""}`}>
                <span>{time}</span>
              </div>
            ))}
          </div>

          {/* Schedule Column */}
          <div className="relative w-full pb-8">
            {/* Grid Lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className={`timeline-row ${i === 4 ? "border-b-0" : ""}`} />
            ))}

            {/* Booked Block (9:00 - 10:30) */}
            <div
              className="absolute top-0 left-0 right-4 bg-primary-fixed border border-primary text-on-primary-fixed rounded p-3 shadow-sm z-10"
              style={{ height: 90, marginTop: 0 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-label-md font-bold">Booked – Procurement Team</h4>
                  <p className="text-body-sm opacity-80">9:00 to 10:30</p>
                </div>
                <span className="material-symbols-outlined text-[18px] opacity-70">groups</span>
              </div>
            </div>

            {/* Conflict Request (9:30 - 10:30) */}
            <div
              className="absolute left-4 right-8 border-2 border-dashed border-error bg-error-container/30 rounded p-2 z-20 flex flex-col justify-end"
              style={{ top: 30, height: 60 }}
            >
              <div className="flex items-center gap-2 text-error">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                <span className="text-label-md">Requested 9:30 to 10:30 – conflict – slot is unavailable</span>
              </div>
            </div>

            {/* Empty Slot Hover (11:00 - 12:00) */}
            <div
              className="absolute left-0 right-4 rounded border border-transparent hover:border-primary border-dashed hover:bg-surface-container-low transition-all cursor-pointer z-0 flex items-center justify-center group"
              style={{ top: 120, height: 60 }}
            >
              <span className="opacity-0 group-hover:opacity-100 text-primary text-label-md flex items-center gap-1 transition-opacity">
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                Click to book 11:00 – 12:00
              </span>
            </div>
          </div>
        </div>
      </div>

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
              <div key={item.label} className="flex justify-between border-b border-surface-container-high pb-1 last:border-b-0">
                <dt className="text-text-secondary">{item.label}</dt>
                <dd className="font-medium text-text-primary">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
