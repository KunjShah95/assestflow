"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

const pagesContent: Record<string, { title: string; subtitle: string; desc: string; icon: string; items: { title: string; meta: string; summary: string }[] }> = {
  "case-studies": {
    title: "Client Case Studies",
    subtitle: "Real results from world-class organizations using AssetFlow",
    desc: "Discover how top-tier manufacturers, logistics firms, and enterprise organizations optimize utilization and reclaim lost assets.",
    icon: "work_history",
    items: [
      {
        title: "Vertex Global Aerospace recovers $14.2M in lost tooling",
        meta: "Aerospace · 90 Days Deployment",
        summary: "How Vertex Global integrated IoT tracking and custom approval systems into AssetFlow to reduce tooling loss rates down to <0.01% in less than three months."
      },
      {
        title: "Synapse Labs speeds up device check-outs by 400%",
        meta: "Medical Electronics · 500+ Assets",
        summary: "By replacing legacy ERP lists with AssetFlow's real-time top-navbar dashboard, Synapse Labs solved allocation friction and simplified compliance audits."
      }
    ]
  },
  blog: {
    title: "Operational Intelligence Blog",
    subtitle: "Industry insights on resource management, ML, and compliance",
    desc: "Read technical guides, optimization strategies, and executive resources written by our developers and systems architects.",
    icon: "rss_feed",
    items: [
      {
        title: "Reducing Ghost Asset Rates: A Guide for Operations",
        meta: "Published July 10, 2026 · 8 min read",
        summary: "What are phantom resources, how do they sneak into legacy ERPs, and how can real-time status updates help you eliminate them permanently?"
      },
      {
        title: "Introduction to Telemetry-Driven Predictive Maintenance",
        meta: "Published July 02, 2026 · 12 min read",
        summary: "Learn how vibration and temperature sensor data can feed into machine learning models to prevent critical factory-line shutdowns."
      }
    ]
  },
  security: {
    title: "Enterprise Security & Compliance",
    subtitle: "Defense-in-depth resource security protocols",
    desc: "AssetFlow is built on secure, zero-trust architecture. We protect your logs and data pipelines at rest and in transit.",
    icon: "security",
    items: [
      {
        title: "AES-256 Bit Data Encryption",
        meta: "Active State · Compliance Requirement",
        summary: "All asset locations, logs, and user metadata are encrypted using military-grade AES-256 standards both at rest and during API transit."
      },
      {
        title: "SOC2 Type II & GDPR Compliance",
        meta: "Certified Audit · Annual Audit Cycle",
        summary: "We undergo strict annual third-party audits to guarantee that your data management complies with SOC2 Type II, GDPR, and HIPAA safety rules."
      }
    ]
  }
};

export default function ResourcesPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const content = pagesContent[category];

  if (!content) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-24 pb-section-padding text-left">
      <div className="max-w-container-max mx-auto px-margin-desktop relative z-10">
        <div className="mb-12">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
            <span className="material-symbols-outlined">{content.icon}</span>
          </div>
          <h1 className="text-headline-section font-bold text-text-primary mb-2">{content.title}</h1>
          <p className="text-primary font-semibold text-md mb-4">{content.subtitle}</p>
          <p className="text-text-secondary text-body-lg max-w-3xl leading-relaxed">{content.desc}</p>
        </div>

        <div className="space-y-6">
          {content.items.map((item) => (
            <div key={item.title} className="bg-white p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2 block">{item.meta}</span>
              <h3 className="font-bold text-headline-card text-text-primary mb-3 leading-tight">{item.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-4">{item.summary}</p>
              <Link href="#" className="text-primary font-bold text-sm inline-flex items-center gap-1 hover:underline">
                Read Article
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
