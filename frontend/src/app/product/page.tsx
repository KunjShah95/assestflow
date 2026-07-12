"use client";

import Link from "next/link";

export default function ProductPage() {
  const features = [
    {
      title: "Prevent Allocation Conflicts",
      desc: "Ensure every asset has a single verified owner across the entire global directory. Eliminate dual-booking, phantom inventory, and resource hoarding.",
      icon: "verified_user",
      badge: "0% Conflict Rate",
      href: "/product/command-center"
    },
    {
      title: "Predictive Maintenance",
      desc: "Leverage machine learning telemetry to identify failing components before they halt production lines. Maximize utilization and extend asset lifespan.",
      icon: "precision_manufacturing",
      badge: "30% Uptime Increase",
      href: "/product/core-intelligence"
    },
    {
      title: "Automated Compliance",
      desc: "Generate audit-ready reports for ISO and SOC2 compliance with a single click. Keep detailed immutable logs of every transition and allocation.",
      icon: "receipt_long",
      badge: "1,200h Saved / Year",
      href: "/product/integrations"
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-section-padding text-left">
      <div className="max-w-container-max mx-auto px-margin-desktop relative z-10">
        <div className="text-center mb-16 animate-reveal active">
          <span className="text-primary font-bold tracking-widest uppercase text-label-sm">Core Product</span>
          <h1 className="font-display-hero text-display-hero mt-4 mb-6">AssetFlow Capabilities</h1>
          <p className="text-text-secondary text-subheading-hero max-w-2xl mx-auto">
            A unified suite of resource intelligence modules. Deploy the exact capabilities your global operation demands.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-gutter mb-20">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="bg-white p-8 rounded-[20px] border border-border shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 bg-surface rounded-xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
                  <span className="material-symbols-outlined text-primary group-hover:text-white" style={{ fontSize: "32px" }}>
                    {feature.icon}
                  </span>
                </div>
                <h3 className="font-headline-card text-headline-card mb-3">{feature.title}</h3>
                <p className="text-text-secondary mb-8">{feature.desc}</p>
              </div>
              <div className="pt-6 border-t border-divider flex items-center justify-between">
                <span className="text-primary font-bold text-lg">{feature.badge}</span>
                <Link href={feature.href} className="text-primary font-bold flex items-center gap-1 hover:underline">
                  Learn More
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action section */}
        <div className="bg-primary rounded-[32px] p-12 text-white relative overflow-hidden group text-center mt-12">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-headline-section text-headline-section mb-6">Explore the command modules</h2>
            <p className="text-xl opacity-90 mb-8">Discover how our core sub-systems coordinate to offer zero-trust resource tracking.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/product/command-center" className="bg-white text-primary px-8 py-3 rounded-full font-bold shadow-md hover:scale-105 transition-transform">
                Command Center
              </Link>
              <Link href="/product/core-intelligence" className="border border-white/30 text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-all">
                Core Intelligence
              </Link>
              <Link href="/product/integrations" className="border border-white/30 text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-all">
                Integrations
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
