"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

const pagesContent: Record<string, { title: string; subtitle: string; desc: string; icon: string; stats: string; statsLabel: string; bullets: string[] }> = {
  "command-center": {
    title: "Command Center Module",
    subtitle: "A unified, executive dashboard for cross-site resource allocation",
    desc: "Coordinate asset distribution across multiple warehouses, teams, and active sites. Command Center provides instantaneous visibility, checks owner approvals, and flags allocation disputes before they interrupt operation velocity.",
    icon: "verified_user",
    stats: "0%",
    statsLabel: "Dual-Booking Rate",
    bullets: [
      "Real-time geographical tracking across global depots",
      "One-click checkouts and proof-of-custody logging",
      "Instant allocation warnings on duplicate requests",
      "Custom role-based permissions for depot managers"
    ]
  },
  "core-intelligence": {
    title: "Core Intelligence & ML",
    subtitle: "Predictive maintenance algorithms driven by machine telemetry",
    desc: "Connect machine health data and IoT telemetry directly to your resource log. Core Intelligence maps machine degradation profiles to preemptively request repairs and flag failing parts before outages happen.",
    icon: "precision_manufacturing",
    stats: "30%",
    statsLabel: "Average Uptime Increase",
    bullets: [
      "Automated ticket dispatching for field maintenance engineers",
      "Sensor telemetry integration (vibration, heat, lifecycle hours)",
      "Degradation modeling for machinery, IT, and vehicle fleets",
      "Historical logs for component lifespans and recall audits"
    ]
  },
  "integrations": {
    title: "Automated Compliance & Integrations",
    subtitle: "SOC2, ISO, and ERP data pipelines connected in one click",
    desc: "Keep audit logs and asset lists synchronized across SAP, Oracle, and active cloud environments. Instantly generate reports verifying compliance with corporate policy, SOC2 guidelines, or ISO resource requirements.",
    icon: "receipt_long",
    stats: "1,200h",
    statsLabel: "Audit Hours Saved / Year",
    bullets: [
      "Standard CSV/JSON bulk importer and exporter pipelines",
      "OIDC/SAML authentication integrations (Okta, Azure, Google Workspace)",
      "Cryptographically sealed logs for audit transparency",
      "Webhook alerts for external ticketing platforms (Jira, ServiceNow)"
    ]
  }
};

export default function ProductSubpage({ params }: { params: Promise<{ subpage: string }> }) {
  const { subpage } = use(params);
  const content = pagesContent[subpage];

  if (!content) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-24 pb-section-padding text-left">
      <div className="max-w-container-max mx-auto px-margin-desktop relative z-10">
        <div className="mb-8">
          <Link href="/product" className="text-primary font-bold inline-flex items-center gap-1 hover:underline">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Products
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
              <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>
                {content.icon}
              </span>
            </div>
            <h1 className="font-display-hero text-headline-section font-bold mb-4 text-text-primary leading-tight">
              {content.title}
            </h1>
            <p className="text-primary font-semibold mb-6 text-lg">{content.subtitle}</p>
            <p className="text-text-secondary text-body-lg mb-8 leading-relaxed">{content.desc}</p>

            <ul className="space-y-4 mb-8">
              {content.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-success text-[18px] mt-0.5">check_circle</span>
                  <span className="text-text-secondary text-sm">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full lg:w-96 shrink-0 mx-auto bg-white border border-border p-12 rounded-[24px] text-center flex flex-col justify-center items-center shadow-sm">
            <span className="text-display-hero text-primary font-black mb-2 block">{content.stats}</span>
            <span className="text-text-secondary font-label-sm text-label-sm uppercase tracking-wider block">
              {content.statsLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
