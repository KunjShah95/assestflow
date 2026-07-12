"use client";

import { use } from "react";
import { notFound } from "next/navigation";

const pagesContent: Record<string, { title: string; date: string; sections: { heading: string; body: string }[] }> = {
  privacy: {
    title: "Privacy Policy",
    date: "Last updated: July 12, 2026",
    sections: [
      {
        heading: "1. Information We Collect",
        body: "We collect information you provide directly to us when creating accounts, setting up organization lists, and integrating telemetry feeds. This includes names, emails, hardware identifier codes, and GPS location tracking records."
      },
      {
        heading: "2. How We Use Information",
        body: "We use the collected information to synchronize real-time resource allocations, perform predictive maintenance modeling, verify ownership claims, and log cryptographically secure history trails."
      }
    ]
  },
  terms: {
    title: "Terms of Service",
    date: "Last updated: July 12, 2026",
    sections: [
      {
        heading: "1. Acceptance of Terms",
        body: "By creating an account or deploying AssetFlow's command tools, you agree to comply with our zero-trust utilization terms and acknowledge our security logs."
      },
      {
        heading: "2. Permitted Use & Ownership",
        body: "AssetFlow grants a limited, non-exclusive license to track resources. Database allocations must represent authentic physical assets; ghost assets or fraudulent records violate our terms."
      }
    ]
  },
  cookies: {
    title: "Cookie Policy",
    date: "Last updated: July 12, 2026",
    sections: [
      {
        heading: "1. What Cookies We Use",
        body: "We use strict functional cookies to maintain active login tokens, check authorization contexts, and save system preference configurations (such as dark mode or list layout settings)."
      },
      {
        heading: "2. Third-Party Script Cookies",
        body: "We do not host advertising tracker cookies. We only include essential telemetry counters to verify API speed and database lookup performance."
      }
    ]
  }
};

export default function LegalPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = use(params);
  const content = pagesContent[page];

  if (!content) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-24 pb-section-padding text-left">
      <div className="max-w-3xl mx-auto px-margin-desktop relative z-10">
        <h1 className="text-headline-section font-bold text-text-primary mb-2">{content.title}</h1>
        <p className="text-text-muted text-sm mb-8">{content.date}</p>

        <div className="space-y-8 bg-white p-8 md:p-12 rounded-[24px] border border-border shadow-sm">
          {content.sections.map((sec) => (
            <div key={sec.heading} className="space-y-3">
              <h3 className="font-bold text-headline-card text-text-primary">{sec.heading}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{sec.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
