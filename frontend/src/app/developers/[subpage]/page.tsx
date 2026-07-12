"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Code, RefreshCw } from "lucide-react";

const pagesContent: Record<string, { title: string; subtitle: string; desc: string; icon: string; sections: { label: string; code: string; desc: string }[] }> = {
  api: {
    title: "REST API Reference",
    subtitle: "Complete documentation for AssetFlow's endpoints",
    desc: "Use our JSON REST API to manage assets, bookings, and users. All requests must include a valid authentication token in the headers.",
    icon: "api",
    sections: [
      {
        label: "List Assets (GET /v1/assets)",
        desc: "Returns a paginated list of assets tracked within your active workspace.",
        code: `GET /v1/assets?limit=10&page=1
Host: api.assetflow.com
Authorization: Bearer YOUR_API_KEY`
      },
      {
        label: "Register Asset (POST /v1/assets)",
        desc: "Creates a new asset record and generates a unique proof-of-custody logging tag.",
        code: `POST /v1/assets
Host: api.assetflow.com
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "name": "Robotic Arm v4",
  "category": "Machinery",
  "serialNumber": "SN-ARM-9029",
  "departmentId": 1
}`
      }
    ]
  },
  webhooks: {
    title: "Webhook Subscriptions",
    subtitle: "Subscribe to real-time asset lifecycle triggers",
    desc: "Configure HTTP POST webhooks to send real-time event logs to your external notifications or service portals.",
    icon: "sync_alt",
    sections: [
      {
        label: "Asset Checked Out (asset.checkout)",
        desc: "Triggered whenever an employee takes custody of a physical asset.",
        code: `{
  "event": "asset.checkout",
  "timestamp": "2026-07-12T10:30:00Z",
  "data": {
    "assetId": 482,
    "assetName": "MacBook Pro M3",
    "allocatedTo": "John Doe",
    "approvedBy": "Admin Approval"
  }
}`
      },
      {
        label: "Maintenance Warning (asset.maintenance_flagged)",
        desc: "Triggered by predictive health models when telemetry values cross danger thresholds.",
        code: `{
  "event": "asset.maintenance_flagged",
  "timestamp": "2026-07-12T10:31:00Z",
  "data": {
    "assetId": 109,
    "assetName": "Server Rack SR-004",
    "telemetryType": "Temperature",
    "value": "89C",
    "limit": "80C"
  }
}`
      }
    ]
  }
};

const iconMap: Record<string, typeof Code> = {
  api: Code,
  sync_alt: RefreshCw,
};

export default function DevelopersSubpage({ params }: { params: Promise<{ subpage: string }> }) {
  const { subpage } = use(params);
  const content = pagesContent[subpage];

  if (!content) {
    notFound();
  }

  const Icon = iconMap[content.icon] || Code;

  return (
    <div className="min-h-screen pt-24 pb-section-padding text-left">
      <div className="max-w-container-max mx-auto px-margin-desktop relative z-10">
        <div className="mb-8">
          <Link href="/developers" className="text-primary font-bold inline-flex items-center gap-1 hover:underline">
            <ArrowLeft size={16} />
            Back to Developer Hub
          </Link>
        </div>

        <div className="mb-12">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
            <Icon size={24} />
          </div>
          <h1 className="text-headline-section font-bold text-text-primary mb-2">{content.title}</h1>
          <p className="text-primary font-semibold text-md mb-4">{content.subtitle}</p>
          <p className="text-text-secondary text-body-lg max-w-3xl leading-relaxed">{content.desc}</p>
        </div>

        <div className="space-y-8">
          {content.sections.map((sec) => (
            <div key={sec.label} className="bg-white p-8 rounded-2xl border border-border shadow-sm">
              <h3 className="font-bold text-headline-card text-text-primary mb-2">{sec.label}</h3>
              <p className="text-text-secondary text-sm mb-4">{sec.desc}</p>
              <pre className="bg-dark-bg text-white p-6 rounded-xl overflow-x-auto font-mono text-sm leading-relaxed">
                <code>{sec.code}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
