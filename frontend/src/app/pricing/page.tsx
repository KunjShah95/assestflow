"use client";

import Link from "next/link";
import { useState } from "react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const plans = [
    {
      name: "Starter",
      desc: "For growing companies tracking local resources.",
      monthlyPrice: 49,
      annualPrice: 39,
      features: [
        "Up to 250 assets tracked",
        "Dual-booking checks",
        "Email & ticket support",
        "Basic CSV import/export",
        "1 admin user"
      ]
    },
    {
      name: "Growth",
      desc: "For mid-size enterprises with global assets.",
      monthlyPrice: 199,
      annualPrice: 159,
      popular: true,
      features: [
        "Up to 2,000 assets tracked",
        "Real-time GPS & IoT syncing",
        "Predictive maintenance scripts",
        "SSO & standard IAM",
        "Up to 15 admin users"
      ]
    },
    {
      name: "Enterprise",
      desc: "For multi-site corporations with zero-trust needs.",
      monthlyPrice: null, // custom
      annualPrice: null,
      features: [
        "Unlimited assets & sites",
        "Immutable SOC2 / audit logs",
        "Granular RBAC",
        "Military-grade encryption keys",
        "24/7 dedicated support team"
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-section-padding text-left">
      <div className="max-w-container-max mx-auto px-margin-desktop relative z-10">
        <div className="text-center mb-12 animate-reveal active">
          <span className="text-primary font-bold tracking-widest uppercase text-label-sm">Operational Pricing</span>
          <h1 className="font-display-hero text-display-hero mt-4 mb-6">Simple, Resource-Driven Pricing</h1>
          <p className="text-text-secondary text-subheading-hero max-w-2xl mx-auto mb-8">
            Scale your resource visibility as your enterprise grows. Choose the tier that matches your operational capacity.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-4 bg-surface-container border border-border p-1.5 rounded-full">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                billingCycle === "monthly" ? "bg-primary text-on-primary shadow" : "text-text-secondary hover:text-primary"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-1.5 ${
                billingCycle === "annual" ? "bg-primary text-on-primary shadow" : "text-text-secondary hover:text-primary"
              }`}
            >
              Annual Billing
              <span className="text-xs bg-success text-white px-2 py-0.5 rounded-full font-medium">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-gutter items-stretch mb-16">
          {plans.map((plan) => {
            const isCustom = plan.monthlyPrice === null;
            const price = isCustom ? "Custom" : billingCycle === "annual" ? plan.annualPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.name}
                className={`bg-white p-8 rounded-[24px] border shadow-sm flex flex-col justify-between hover:shadow-lg transition-shadow relative ${
                  plan.popular ? "border-primary ring-1 ring-primary" : "border-border"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
                <div>
                  <div className="mb-6">
                    <h3 className="text-headline-card font-bold text-text-primary mb-2">{plan.name}</h3>
                    <p className="text-text-secondary text-sm">{plan.desc}</p>
                  </div>

                  <div className="mb-8">
                    {isCustom ? (
                      <span className="text-4xl font-extrabold text-text-primary">Contact Sales</span>
                    ) : (
                      <div className="flex items-baseline">
                        <span className="text-5xl font-black text-text-primary">${price}</span>
                        <span className="text-text-muted text-sm ml-2">/ month</span>
                      </div>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-success text-[18px] shrink-0 mt-0.5">check_circle</span>
                        <span className="text-sm text-text-secondary">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={isCustom ? "/contact" : "/login"}
                  className={`w-full py-3 rounded-full font-bold text-center block transition-all hover:scale-[1.02] ${
                    plan.popular
                      ? "bg-primary text-on-primary hover:bg-accent-hover"
                      : "bg-surface border border-border text-text-primary hover:border-text-primary"
                  }`}
                >
                  {isCustom ? "Get Enterprise Quote" : "Start Free Trial"}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
