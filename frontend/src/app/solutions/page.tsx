"use client";

import Link from "next/link";
import { Plane, Factory, Truck, ArrowRight } from "lucide-react";

export default function SolutionsPage() {
  const industries = [
    {
      title: "Aerospace Operations",
      tagline: "Track critical high-value tools and flight components",
      desc: "One aerospace manufacturer recovered $14.2M in 'lost' tooling within 90 days of deploying AssetFlow's proof-of-custody tracking. Prevent flight-line bottlenecks and ensure tool certification logs are updated in real-time.",
      icon: "flight",
      metric: "99.99%",
      metricLabel: "Drift Accuracy"
    },
    {
      title: "Manufacturing & Assembly",
      tagline: "Synchronize factory lines and robotic assets",
      desc: "Connect physical robotics and shop-floor assets to your ledger. Run predictive maintenance scripts directly on real-time operational telemetry to reduce machine downtime and schedule repair tickets automatically.",
      icon: "precision_manufacturing",
      metric: "30%",
      metricLabel: "Uptime Increase"
    },
    {
      title: "Global Supply Chain & Logistics",
      tagline: "Real-time visibility across depots and fleets",
      desc: "Never lose sight of cargo containers, mobile hardware, and warehouse equipment. Integrate GPS and IoT sensors seamlessly to keep an immutable, cryptographically secure record of chain-of-custody.",
      icon: "local_shipping",
      metric: "<0.01%",
      metricLabel: "Asset Variance"
    }
  ];

  const iconMap: Record<string, typeof Plane> = {
    flight: Plane,
    precision_manufacturing: Factory,
    local_shipping: Truck,
  };

  return (
    <div className="min-h-screen pt-24 pb-section-padding text-left">
      <div className="max-w-container-max mx-auto px-margin-desktop relative z-10">
        <div className="text-center mb-16 animate-reveal active">
          <span className="text-primary font-bold tracking-widest uppercase text-label-sm">Enterprise Solutions</span>
          <h1 className="font-display-hero text-display-hero mt-4 mb-6">Designed for Operational Velocity</h1>
          <p className="text-text-secondary text-subheading-hero max-w-2xl mx-auto">
            AssetFlow unifies physical reality and digital ledgers for industries that cannot afford delays.
          </p>
        </div>

        <div className="space-y-12">
          {industries.map((ind, i) => {
            const Icon = iconMap[ind.icon] || Plane;
            return (
              <div
                key={ind.title}
                className={`bg-white p-8 md:p-12 rounded-[24px] border border-border shadow-sm flex flex-col lg:flex-row items-center gap-12 hover:shadow-md transition-shadow ${
                  i % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary font-label-sm text-label-sm mb-4">
                    <Icon size={18} />
                    {ind.title}
                  </div>
                  <h2 className="text-headline-section text-headline-section mb-4 font-bold text-text-primary leading-tight">
                    {ind.title}
                  </h2>
                  <p className="text-primary font-semibold mb-4 text-lg">{ind.tagline}</p>
                  <p className="text-text-secondary text-body-lg mb-6 leading-relaxed">{ind.desc}</p>
                  <Link href="/contact" className="bg-text-primary text-white px-6 py-3 rounded-full font-button text-button hover:bg-black transition-colors inline-flex items-center gap-2">
                    Request Case Study
                    <ArrowRight size={18} />
                  </Link>
                </div>

                <div className="w-full lg:w-80 shrink-0 bg-surface border border-border p-8 rounded-2xl text-center flex flex-col justify-center items-center">
                  <span className="text-display-hero text-primary font-black mb-2 block">{ind.metric}</span>
                  <span className="text-text-secondary font-label-sm text-label-sm uppercase tracking-wider block">{ind.metricLabel}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
