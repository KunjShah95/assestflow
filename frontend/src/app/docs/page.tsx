"use client";

import Link from "next/link";
import { FileText } from "lucide-react";

export default function DocsPage() {
  const sections = [
    {
      title: "Getting Started",
      items: [
        { label: "Introduction to AssetFlow", href: "#" },
        { label: "System Architecture & Security", href: "#" },
        { label: "Onboarding Assets", href: "#" }
      ]
    },
    {
      title: "API Integration",
      items: [
        { label: "Authentication & Bearer Tokens", href: "/developers" },
        { label: "Assets Endpoints", href: "/developers/api" },
        { label: "Webhooks Reference", href: "/developers/webhooks" }
      ]
    },
    {
      title: "Operational Workflows",
      items: [
        { label: "Managing Asset Allocations", href: "/allocation" },
        { label: "Resource Booking Protocols", href: "/booking" },
        { label: "Raising Maintenance Requests", href: "/maintenance" }
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-section-padding text-left">
      <div className="max-w-container-max mx-auto px-margin-desktop relative z-10">
        <div className="text-center mb-16 animate-reveal active">
          <span className="text-primary font-bold tracking-widest uppercase text-label-sm">Knowledge Base</span>
          <h1 className="font-display-hero text-display-hero mt-4 mb-6">Documentation Portal</h1>
          <p className="text-text-secondary text-subheading-hero max-w-2xl mx-auto">
            Everything you need to configure, run, and scale AssetFlow in your enterprise.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-gutter items-start">
          {sections.map((sec) => (
            <div key={sec.title} className="bg-white p-8 rounded-[20px] border border-border shadow-sm">
              <h3 className="font-bold text-headline-card text-text-primary mb-6 border-b border-divider pb-4">
                {sec.title}
              </h3>
              <ul className="space-y-4">
                {sec.items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-text-secondary hover:text-primary transition-colors flex items-center gap-2 group">
                      <FileText size={18} className="text-text-muted group-hover:text-primary" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
