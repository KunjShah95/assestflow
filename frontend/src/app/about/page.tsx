"use client";

import Link from "next/link";

export default function AboutPage() {
  const values = [
    {
      title: "Verifiable Accuracy",
      desc: "We believe database entries should mirror physical realities without exception. Drift metrics must approach absolute zero.",
      icon: "task_alt"
    },
    {
      title: "Zero-Trust Philosophy",
      desc: "Every asset check-out, handoff, and maintenance ticket must register under strict cryptographic audit trails.",
      icon: "lock"
    },
    {
      title: "Operational Velocity",
      desc: "Software should speed up workflows, not weigh them down. We build tools that require zero documentation to operate.",
      icon: "bolt"
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-section-padding text-left">
      <div className="max-w-container-max mx-auto px-margin-desktop relative z-10">
        <div className="text-center mb-16 animate-reveal active">
          <span className="text-primary font-bold tracking-widest uppercase text-label-sm">Company Profile</span>
          <h1 className="font-display-hero text-display-hero mt-4 mb-6">Our Mission & Values</h1>
          <p className="text-text-secondary text-subheading-hero max-w-2xl mx-auto">
            We are building the unified operational protocol for physical enterprise assets.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-headline-section font-bold text-text-primary mb-6">Bridging Ledgers and Reality</h2>
            <p className="text-text-secondary text-body-lg mb-4 leading-relaxed">
              AssetFlow was founded to solve a multi-billion dollar headache: drift. Large corporations regularly lose track of tools, licenses, and components, leading to operational conflict and waste.
            </p>
            <p className="text-text-secondary text-body-lg mb-6 leading-relaxed">
              Our unified ledger synchronizes procurement, IT, and operations in real-time, providing immediate visibility and proof-of-custody across global plants and workspaces.
            </p>
            <Link href="/contact" className="bg-primary text-on-primary px-8 py-3.5 rounded-full font-button text-button hover:bg-accent-hover transition-colors inline-block shadow">
              Contact Our Executives
            </Link>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-border shadow-sm space-y-6">
            <h3 className="font-bold text-headline-card text-text-primary border-b border-divider pb-4">Our Core Values</h3>
            {values.map((v) => (
              <div key={v.title} className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 text-primary">
                  <span className="material-symbols-outlined">{v.icon}</span>
                </div>
                <div>
                  <h4 className="font-bold text-text-primary text-md">{v.title}</h4>
                  <p className="text-sm text-text-secondary mt-1">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
