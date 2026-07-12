"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Intersection Observer for scroll animations (.animate-reveal)
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll(".animate-reveal");
    elements.forEach((el) => observer.observe(el));

    // Cleanup observer on unmount
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleTimelineHover = (e: React.MouseEvent<HTMLDivElement>, fill: number) => {
    const icon = e.currentTarget.querySelector(".material-symbols-outlined");
    if (icon instanceof HTMLElement) {
      icon.style.fontVariationSettings = `'FILL' ${fill}`;
    }
  };

  return (
    <div className="bg-[#faf8ff] text-[#0F172A] font-body-md overflow-x-hidden min-h-screen flex flex-col relative selection:bg-[#004ac6]/30 selection:text-[#0F172A]">
      {/* Custom Styles Injection */}
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          display: inline-block;
          line-height: 1;
          text-transform: none;
          letter-spacing: normal;
          word-wrap: normal;
          white-space: nowrap;
          direction: ltr;
        }
        
        .grid-pattern {
          background-image: radial-gradient(circle at 2px 2px, #E2E8F0 1px, transparent 0);
          background-size: 40px 40px;
        }

        .radial-glow {
          background: radial-gradient(60% 60% at 50% 50%, rgba(37, 99, 235, 0.03) 0%, rgba(255, 255, 255, 0) 100%);
        }

        .animate-reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .animate-reveal.active {
          opacity: 1;
          transform: translateY(0);
        }

        .timeline-step:hover .step-line {
          background-color: #004ac6;
        }
      `}</style>

      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#faf8ff]/80 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-[1320px] mx-auto px-4 md:px-[64px] flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link className="text-[22px] leading-[28px] font-bold text-[#0F172A]" href="/">
              AssetFlow
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link className="text-[#004ac6] font-semibold text-[16px] leading-[24px] hover:text-[#004ac6] transition-colors duration-200" href="/product">
                Product
              </Link>
              <Link className="text-[#475569] text-[16px] leading-[24px] hover:text-[#004ac6] transition-colors duration-200" href="/solutions">
                Solutions
              </Link>
              <Link className="text-[#475569] text-[16px] leading-[24px] hover:text-[#004ac6] transition-colors duration-200" href="/developers">
                Developers
              </Link>
              <Link className="text-[#475569] text-[16px] leading-[24px] hover:text-[#004ac6] transition-colors duration-200" href="/pricing">
                Pricing
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block text-[#475569] text-[16px] leading-[24px] font-medium px-4 py-2 hover:text-[#004ac6] transition-colors cursor-pointer">
              Log In
            </Link>
            <Link href="/contact" className="bg-[#004ac6] text-white px-6 py-2.5 rounded-full text-[16px] leading-[24px] font-medium hover:bg-[#1D4ED8] transition-all shadow-sm cursor-pointer">
              Book Demo
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#0F172A] hover:text-[#004ac6] focus:outline-none"
            >
              <span className="material-symbols-outlined">{mobileMenuOpen ? "close" : "menu"}</span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E2E8F0] bg-[#faf8ff] px-6 py-4 flex flex-col gap-4 animate-fade-in shadow-lg">
            <Link className="text-[#475569] text-[16px] py-1" href="/product">Product</Link>
            <Link className="text-[#475569] text-[16px] py-1" href="/solutions">Solutions</Link>
            <Link className="text-[#475569] text-[16px] py-1" href="/developers">Developers</Link>
            <Link className="text-[#475569] text-[16px] py-1" href="/pricing">Pricing</Link>
            <div className="flex flex-col gap-3 pt-3 border-t border-[#E2E8F0]">
              <Link href="/login" className="text-[#475569] text-center py-2 hover:text-[#004ac6]">Log In</Link>
              <Link href="/contact" className="bg-[#004ac6] text-white py-2.5 rounded-full text-center font-medium hover:bg-[#1D4ED8] transition-all">Book Demo</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-[120px] grid-pattern overflow-hidden">
        <div className="absolute inset-0 radial-glow pointer-events-none"></div>
        <div className="max-w-[1320px] mx-auto px-4 md:px-[64px] text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#004ac6]/5 border border-[#004ac6]/10 text-[#004ac6] text-[14px] leading-[20px] font-medium mb-8 animate-reveal active">
            <span className="w-1.5 h-1.5 rounded-full bg-[#004ac6] animate-pulse"></span>
            Now optimizing $4B+ in enterprise assets
          </div>
          <h1 className="text-[40px] md:text-[64px] font-bold tracking-[-0.02em] leading-[1.1] max-w-4xl mx-auto mb-6 animate-reveal active">
            The Operating System for Enterprise Resources
          </h1>
          <p className="text-[20px] leading-[30px] font-normal text-[#475569] max-w-2xl mx-auto mb-10 animate-reveal active transition-all duration-500 delay-100">
            Unify asset intelligence across global operations. AssetFlow provides a single source of truth for every machine, license, and capital asset.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-reveal active transition-all duration-500 delay-200">
            <Link href="/login" className="w-full sm:w-auto bg-[#0F172A] text-white px-8 py-4 rounded-full text-[16px] leading-[24px] font-medium hover:bg-black transition-all text-center">
              Start Your Implementation
            </Link>
            <Link href="/contact" className="w-full sm:w-auto bg-white border border-[#E2E8F0] text-[#0F172A] px-8 py-4 rounded-full text-[16px] leading-[24px] font-medium hover:border-[#0F172A] transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">play_circle</span>
              Watch System Overview
            </Link>
          </div>
          <div className="relative max-w-5xl mx-auto animate-reveal active transition-all duration-500 delay-300">
            <div className="rounded-2xl border border-[#E2E8F0] shadow-2xl bg-white overflow-hidden p-2">
              <img
                className="w-full h-auto rounded-xl"
                alt="A clean, minimalist enterprise software dashboard showing actual AssetFlow resource metrics."
                src="/dashboard_preview.png"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden lg:block w-64 p-4 bg-white border border-[#E2E8F0] shadow-xl rounded-xl text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[14px] leading-[20px] font-medium text-[#94A3B8] uppercase">Real-time Drift</span>
                <span className="text-[#10B981] text-[14px] leading-[20px] font-medium">0.02%</span>
              </div>
              <div className="h-2 w-full bg-[#faf8ff] rounded-full overflow-hidden">
                <div className="h-full bg-[#10B981] w-[98%]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-12 border-y border-[#E2E8F0] bg-white relative z-10">
        <div className="max-w-[1320px] mx-auto px-4 md:px-[64px]">
          <p className="text-center text-[#94A3B8] text-[14px] leading-[20px] font-medium uppercase tracking-widest mb-8">
            Infrastructure powered by AssetFlow
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="font-bold text-2xl text-[#0F172A]">VERTEX</span>
            <span className="font-bold text-2xl text-[#0F172A]">SYNAPSE</span>
            <span className="font-bold text-2xl text-[#0F172A]">CORE-X</span>
            <span className="font-bold text-2xl text-[#0F172A]">ORBITAL</span>
            <span className="font-bold text-2xl text-[#0F172A]">LUMINA</span>
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="py-[120px] bg-[#faf8ff] relative z-10">
        <div className="max-w-[1320px] mx-auto px-4 md:px-[64px]">
          <div className="grid lg:grid-cols-2 gap-[32px] items-center">
            <div className="animate-reveal text-left">
              <h2 className="text-[32px] md:text-[42px] leading-[1.2] font-bold tracking-[-0.01em] mb-6">
                Stop managing assets with ghosts and guesses.
              </h2>
              <p className="text-[17px] leading-[26px] font-normal text-[#475569] mb-10">
                Legacy ERPs weren&apos;t built for the velocity of modern enterprise. Data fragmentation leads to multi-million dollar leakages annually.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-[#ba1a1a]/10 text-[#ba1a1a]">
                    <span className="material-symbols-outlined">warning</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F172A]">Information Silos</h4>
                    <p className="text-[#475569]">Procurement, operations, and IT speak different languages, creating conflict.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-[#004ac6]/10 text-[#004ac6]">
                    <span className="material-symbols-outlined">bolt</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F172A]">AssetFlow Intelligence</h4>
                    <p className="text-[#475569]">A unified protocol that synchronizes every state change across the stack instantly.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative animate-reveal">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm mt-12 text-left">
                  <span className="text-3xl font-bold text-[#ba1a1a] mb-2 block">12%</span>
                  <p className="text-[14px] leading-[20px] font-medium text-[#94A3B8]">Ghost Asset Rate in Legacy Systems</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm text-left">
                  <span className="text-3xl font-bold text-[#10B981] mb-2 block">&lt;0.01%</span>
                  <p className="text-[14px] leading-[20px] font-medium text-[#94A3B8]">Variance with AssetFlow</p>
                </div>
                <div className="col-span-2 bg-[#004ac6] p-8 rounded-2xl text-white shadow-xl text-left">
                  <h3 className="text-[22px] leading-[28px] font-semibold mb-4">The Result?</h3>
                  <p className="opacity-90 mb-6">One aerospace client recovered $14.2M in &quot;lost&quot; tooling within 90 days of implementation.</p>
                  <Link className="text-white font-bold inline-flex items-center gap-2 group cursor-pointer" href="/resources">
                    Read Case Study
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Control */}
      <section className="py-[120px] bg-[#0F172A] text-white overflow-hidden relative z-10">
        <div className="max-w-[1320px] mx-auto px-4 md:px-[64px] relative z-10 text-left">
          <div className="mb-16">
            <span className="text-[#004ac6] font-bold tracking-widest uppercase text-[14px]">Command Center</span>
            <h2 className="text-[32px] md:text-[42px] leading-[1.2] font-bold tracking-[-0.01em] mt-4 mb-4">Total Resource Visibility</h2>
            <p className="text-[#94A3B8] text-[17px] leading-[26px] max-w-2xl">
              A purpose-built interface for executive decision making. Know exactly what requires your attention and what assets are at risk before they fail.
            </p>
          </div>
          <div className="grid lg:grid-cols-4 gap-8 mb-12">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <p className="text-[#94A3B8] text-[14px] mb-2">Requires Attention</p>
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold">14</span>
                <span className="px-2 py-1 bg-[#F59E0B]/20 text-[#F59E0B] text-xs rounded">Priority</span>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <p className="text-[#94A3B8] text-[14px] mb-2">At Critical Risk</p>
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold">03</span>
                <span className="px-2 py-1 bg-[#EF4444]/20 text-[#EF4444] text-xs rounded">Critical</span>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <p className="text-[#94A3B8] text-[14px] mb-2">Efficiency Rating</p>
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold">94%</span>
                <span className="px-2 py-1 bg-[#10B981]/20 text-[#10B981] text-xs rounded">+2.4%</span>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <p className="text-[#94A3B8] text-[14px] mb-2">Active Transfers</p>
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold">1,029</span>
                <span className="px-2 py-1 bg-[#004ac6]/20 text-[#004ac6] text-xs rounded">Live</span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black shadow-2xl overflow-hidden p-1">
            <img
              className="w-full h-auto opacity-90 rounded-xl"
              alt="A dark-themed, high-resolution analytics dashboard."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8Yqf_B7QXhuHOrYU8-aSzgYsDNzLqxtopT7vvA44mZ7vasybUePZ2R6MTXKct00mbKVz3xhjrmP87nKvJX8N34O7fiAlyzdcIMiQAUDKVSY3-n0HwC6dqu0uO471PAle0An0ziWtSsAOWQNLCnZuTozomVSfZm_BW8QnT2SbJlPb8NaYlZuZ4NyWHKS_yAXy3lzlI6_EKeeenXSvCQUW99FFDe6_n01Bk6n52phrQM5YZQ143hxXlJMGFMkYsT1Es_0nr4a43b8G8"
            />
          </div>
        </div>
      </section>

      {/* Core Modules */}
      <section className="py-[120px] bg-[#faf8ff] relative z-10">
        <div className="max-w-[1320px] mx-auto px-4 md:px-[64px]">
          <div className="text-center mb-20">
            <h2 className="text-[32px] md:text-[42px] leading-[1.2] font-bold tracking-[-0.01em] mb-6">Designed for operational precision.</h2>
            <p className="text-[#475569] text-[17px] leading-[26px] max-w-2xl mx-auto">
              AssetFlow modular architecture allows you to deploy exactly the intelligence your enterprise needs.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-[32px]">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-[20px] border border-[#E2E8F0] shadow-sm hover:shadow-lg transition-all duration-300 group text-left">
              <div className="w-14 h-14 bg-[#faf8ff] rounded-xl flex items-center justify-center mb-8 group-hover:bg-[#004ac6] transition-colors">
                <span className="material-symbols-outlined text-[#004ac6] group-hover:text-white" style={{ fontSize: "32px" }}>verified_user</span>
              </div>
              <h3 className="text-[22px] leading-[28px] font-semibold mb-3">Prevent Allocation Conflicts</h3>
              <p className="text-[#475569] mb-8">Ensure every asset has a single verified owner across the entire global directory.</p>
              <div className="pt-6 border-t border-[#F1F5F9]">
                <span className="text-[#004ac6] font-bold text-2xl">0%</span>
                <span className="text-[#94A3B8] text-[14px] ml-2">Conflict Rate</span>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-white p-8 rounded-[20px] border border-[#E2E8F0] shadow-sm hover:shadow-lg transition-all duration-300 group text-left">
              <div className="w-14 h-14 bg-[#faf8ff] rounded-xl flex items-center justify-center mb-8 group-hover:bg-[#004ac6] transition-colors">
                <span className="material-symbols-outlined text-[#004ac6] group-hover:text-white" style={{ fontSize: "32px" }}>precision_manufacturing</span>
              </div>
              <h3 className="text-[22px] leading-[28px] font-semibold mb-3">Predictive Maintenance</h3>
              <p className="text-[#475569] mb-8">Leverage machine learning to identify failing components before they halt production lines.</p>
              <div className="pt-6 border-t border-[#F1F5F9]">
                <span className="text-[#004ac6] font-bold text-2xl">30%</span>
                <span className="text-[#94A3B8] text-[14px] ml-2">Uptime Increase</span>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-white p-8 rounded-[20px] border border-[#E2E8F0] shadow-sm hover:shadow-lg transition-all duration-300 group text-left">
              <div className="w-14 h-14 bg-[#faf8ff] rounded-xl flex items-center justify-center mb-8 group-hover:bg-[#004ac6] transition-colors">
                <span className="material-symbols-outlined text-[#004ac6] group-hover:text-white" style={{ fontSize: "32px" }}>receipt_long</span>
              </div>
              <h3 className="text-[22px] leading-[28px] font-semibold mb-3">Automated Compliance</h3>
              <p className="text-[#475569] mb-8">Generate audit-ready reports for ISO and SOC2 compliance with a single click.</p>
              <div className="pt-6 border-t border-[#F1F5F9]">
                <span className="text-[#004ac6] font-bold text-2xl">1,200h</span>
                <span className="text-[#94A3B8] text-[14px] ml-2">Saved / Year</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Timeline */}
      <section className="py-[120px] bg-white border-y border-[#E2E8F0] relative z-10">
        <div className="max-w-[1320px] mx-auto px-4 md:px-[64px]">
          <h2 className="text-[32px] md:text-[42px] leading-[1.2] font-bold tracking-[-0.01em] text-center mb-20">The Unified Asset Lifecycle</h2>
          <div className="relative">
            {/* Horizontal Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#E2E8F0] -translate-y-1/2 hidden md:block"></div>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-8 relative">
              {/* Step 1 */}
              <div
                className="timeline-step flex flex-col items-center text-center group cursor-pointer"
                onMouseEnter={(e) => handleTimelineHover(e, 1)}
                onMouseLeave={(e) => handleTimelineHover(e, 0)}
              >
                <div className="w-10 h-10 rounded-full bg-white border-2 border-[#004ac6] flex items-center justify-center z-10 mb-4 transition-all group-hover:scale-110">
                  <span className="material-symbols-outlined text-[#004ac6]" style={{ fontSize: "18px" }}>add_box</span>
                </div>
                <h4 className="font-bold text-[#0F172A] text-sm mb-2">Register</h4>
                <p className="text-xs text-[#94A3B8] px-2">Instant onboarding via IoT or Batch</p>
              </div>
              {/* Step 2 */}
              <div
                className="timeline-step flex flex-col items-center text-center group cursor-pointer"
                onMouseEnter={(e) => handleTimelineHover(e, 1)}
                onMouseLeave={(e) => handleTimelineHover(e, 0)}
              >
                <div className="w-10 h-10 rounded-full bg-white border-2 border-[#E2E8F0] flex items-center justify-center z-10 mb-4 transition-all group-hover:border-[#004ac6] group-hover:scale-110">
                  <span className="material-symbols-outlined text-[#94A3B8] group-hover:text-[#004ac6]" style={{ fontSize: "18px" }}>assignment_ind</span>
                </div>
                <h4 className="font-bold text-[#0F172A] text-sm mb-2">Allocate</h4>
                <p className="text-xs text-[#94A3B8] px-2">Owner assignment with proof-of-custody</p>
              </div>
              {/* Step 3 */}
              <div
                className="timeline-step flex flex-col items-center text-center group cursor-pointer"
                onMouseEnter={(e) => handleTimelineHover(e, 1)}
                onMouseLeave={(e) => handleTimelineHover(e, 0)}
              >
                <div className="w-10 h-10 rounded-full bg-white border-2 border-[#E2E8F0] flex items-center justify-center z-10 mb-4 transition-all group-hover:border-[#004ac6] group-hover:scale-110">
                  <span className="material-symbols-outlined text-[#94A3B8] group-hover:text-[#004ac6]" style={{ fontSize: "18px" }}>move_down</span>
                </div>
                <h4 className="font-bold text-[#0F172A] text-sm mb-2">Transfer</h4>
                <p className="text-xs text-[#94A3B8] px-2">Chain-of-custody logging</p>
              </div>
              {/* Step 4 */}
              <div
                className="timeline-step flex flex-col items-center text-center group cursor-pointer"
                onMouseEnter={(e) => handleTimelineHover(e, 1)}
                onMouseLeave={(e) => handleTimelineHover(e, 0)}
              >
                <div className="w-10 h-10 rounded-full bg-white border-2 border-[#E2E8F0] flex items-center justify-center z-10 mb-4 transition-all group-hover:border-[#004ac6] group-hover:scale-110">
                  <span className="material-symbols-outlined text-[#94A3B8] group-hover:text-[#004ac6]" style={{ fontSize: "18px" }}>event_available</span>
                </div>
                <h4 className="font-bold text-[#0F172A] text-sm mb-2">Book</h4>
                <p className="text-xs text-[#94A3B8] px-2">Reservation and scheduling logic</p>
              </div>
              {/* Step 5 */}
              <div
                className="timeline-step flex flex-col items-center text-center group cursor-pointer"
                onMouseEnter={(e) => handleTimelineHover(e, 1)}
                onMouseLeave={(e) => handleTimelineHover(e, 0)}
              >
                <div className="w-10 h-10 rounded-full bg-white border-2 border-[#E2E8F0] flex items-center justify-center z-10 mb-4 transition-all group-hover:border-[#004ac6] group-hover:scale-110">
                  <span className="material-symbols-outlined text-[#94A3B8] group-hover:text-[#004ac6]" style={{ fontSize: "18px" }}>build</span>
                </div>
                <h4 className="font-bold text-[#0F172A] text-sm mb-2">Maintain</h4>
                <p className="text-xs text-[#94A3B8] px-2">ML-driven service workflows</p>
              </div>
              {/* Step 6 */}
              <div
                className="timeline-step flex flex-col items-center text-center group cursor-pointer"
                onMouseEnter={(e) => handleTimelineHover(e, 1)}
                onMouseLeave={(e) => handleTimelineHover(e, 0)}
              >
                <div className="w-10 h-10 rounded-full bg-white border-2 border-[#E2E8F0] flex items-center justify-center z-10 mb-4 transition-all group-hover:border-[#004ac6] group-hover:scale-110">
                  <span className="material-symbols-outlined text-[#94A3B8] group-hover:text-[#004ac6]" style={{ fontSize: "18px" }}>fact_check</span>
                </div>
                <h4 className="font-bold text-[#0F172A] text-sm mb-2">Audit</h4>
                <p className="text-xs text-[#94A3B8] px-2">Automated verification cycles</p>
              </div>
              {/* Step 7 */}
              <div
                className="timeline-step flex flex-col items-center text-center group cursor-pointer"
                onMouseEnter={(e) => handleTimelineHover(e, 1)}
                onMouseLeave={(e) => handleTimelineHover(e, 0)}
              >
                <div className="w-10 h-10 rounded-full bg-white border-2 border-[#E2E8F0] flex items-center justify-center z-10 mb-4 transition-all group-hover:border-[#004ac6] group-hover:scale-110">
                  <span className="material-symbols-outlined text-[#94A3B8] group-hover:text-[#004ac6]" style={{ fontSize: "18px" }}>inventory</span>
                </div>
                <h4 className="font-bold text-[#0F172A] text-sm mb-2">Retain</h4>
                <p className="text-xs text-[#94A3B8] px-2">Depreciation and disposal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics & Security */}
      <section className="py-[120px] bg-[#faf8ff] overflow-hidden relative z-10">
        <div className="max-w-[1320px] mx-auto px-4 md:px-[64px]">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#004ac6]/5 rounded-full blur-3xl"></div>
              <div className="bg-white border border-[#E2E8F0] p-8 rounded-2xl shadow-xl relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-[#0F172A] text-left">Capital Utilization (Annual)</h3>
                  <span className="material-symbols-outlined text-[#94A3B8]">more_horiz</span>
                </div>
                {/* Mock Area Chart */}
                <div className="h-48 flex items-end gap-1 mb-4">
                  <div className="flex-1 bg-[#004ac6]/10 rounded-t-sm h-[30%]"></div>
                  <div className="flex-1 bg-[#004ac6]/20 rounded-t-sm h-[45%]"></div>
                  <div className="flex-1 bg-[#004ac6]/30 rounded-t-sm h-[40%]"></div>
                  <div className="flex-1 bg-[#004ac6]/40 rounded-t-sm h-[60%]"></div>
                  <div className="flex-1 bg-[#004ac6]/50 rounded-t-sm h-[55%]"></div>
                  <div className="flex-1 bg-[#004ac6]/60 rounded-t-sm h-[80%]"></div>
                  <div className="flex-1 bg-[#004ac6]/70 rounded-t-sm h-[75%]"></div>
                  <div className="flex-1 bg-[#004ac6]/80 rounded-t-sm h-[95%]"></div>
                  <div className="flex-1 bg-[#004ac6] rounded-t-sm h-[90%]"></div>
                </div>
                <div className="flex justify-between text-xs text-[#94A3B8] uppercase tracking-tighter">
                  <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span>
                </div>
              </div>
              <div className="mt-8 bg-[#0F172A] text-white p-8 rounded-2xl shadow-xl ml-12 text-left">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-[#10B981]">security</span>
                  <h3 className="font-bold">Enterprise Security</h3>
                </div>
                <p className="text-sm opacity-70 mb-4">End-to-end encryption with zero-trust architecture. SOC2 Type II, GDPR, and HIPAA compliant.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-xs py-2 px-3 bg-white/10 rounded border border-white/5">AES-256 Bit Encryption</div>
                  <div className="text-xs py-2 px-3 bg-white/10 rounded border border-white/5">Single Sign-On (OIDC)</div>
                </div>
              </div>
            </div>
            <div className="text-left">
              <h2 className="text-[32px] md:text-[42px] leading-[1.2] font-bold tracking-[-0.01em] mb-6">Built for scale, secured by design.</h2>
              <p className="text-[17px] leading-[26px] font-normal text-[#475569] mb-10">
                AssetFlow is designed to handle millions of records per second with 99.99% uptime. Our architecture ensures that your resource data is never at risk.
              </p>
              <ul className="space-y-6">
                <li className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#10B981]">check_circle</span>
                  <span className="text-[16px] leading-[24px]">Military-grade data encryption at rest and in transit</span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#10B981]">check_circle</span>
                  <span className="text-[16px] leading-[24px]">Granular RBAC (Role-Based Access Control)</span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#10B981]">check_circle</span>
                  <span className="text-[16px] leading-[24px]">Real-time immutable audit logs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials & CTA */}
      <section className="py-[120px] bg-white relative z-10">
        <div className="max-w-[1320px] mx-auto px-4 md:px-[64px] text-center">
          <div className="mb-20">
            <div className="flex justify-center gap-1 mb-6 text-[#F59E0B]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </div>
            <blockquote className="text-[32px] md:text-[42px] leading-[1.2] font-medium tracking-[-0.01em] max-w-4xl mx-auto mb-8 leading-tight">
              &quot;AssetFlow is the first tool that actually bridges the gap between our physical reality and our digital ledger. It&apos;s transformed how we manage capital.&quot;
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-surface">
                <img
                  className="w-full h-full object-cover"
                  alt="Sarah Jenkins Professional Headshot"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCROH1xTUcvOrPIL6FQQXrUK8wJe9XygKVbKrv8zpRJcwFIAm48sR6i6JOEL3QI7KlXhyfDT4EkhA0m3eBciQWE4jSWvdL5yFelZRMA1qZ-9J6sycg1wE9p-BcvlRzhMyX_VkMXezT_qtIYNCDnfHA3U-QCG39S1f27uAcDHBHgK4gMl6pXZdKaX2z698TKvVM11xCAOL4tSJ3hxPC0FPBm4_Kc8NRefpA3-scF1iqDDGzusiBv9TC8Pf2gmg566ItaIWkfF3mtDy6E"
                />
              </div>
              <div className="text-left">
                <p className="font-bold text-[#0F172A]">Sarah Jenkins</p>
                <p className="text-[#94A3B8] text-[14px]">COO, Vertex Global</p>
              </div>
            </div>
          </div>
          <div className="bg-[#004ac6] rounded-[32px] p-12 md:p-20 text-white relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-[32px] md:text-[42px] leading-[1.2] font-bold tracking-[-0.01em] mb-6">Ready to optimize your enterprise?</h2>
              <p className="text-xl opacity-90 mb-10">Join 400+ world-class organizations using AssetFlow to achieve resource intelligence.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/login" className="bg-white text-[#004ac6] px-10 py-5 rounded-full font-bold text-[16px] leading-[24px] shadow-xl hover:scale-105 transition-transform">
                  Book Strategy Demo
                </Link>
                <Link href="/contact" className="text-white border border-white/30 px-10 py-5 rounded-full font-bold text-[16px] leading-[24px] hover:bg-white/10 transition-all">
                  Download OS Report
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#faf8ff] border-t border-[#E2E8F0] relative z-10">
        <div className="max-w-[1320px] mx-auto px-4 md:px-[64px] py-[120px] text-left">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-[32px]">
            <div className="col-span-2 lg:col-span-1">
              <Link className="text-[22px] leading-[28px] font-bold text-[#0F172A] mb-6 block" href="/">
                AssetFlow
              </Link>
              <p className="text-[#94A3B8] text-sm mb-6 max-w-xs">Operating System for Enterprise Resources. Intelligence at every node.</p>
              <div className="flex gap-4">
                <a className="text-[#94A3B8] hover:text-[#004ac6] transition-colors" href="#"><span className="material-symbols-outlined">public</span></a>
                <a className="text-[#94A3B8] hover:text-[#004ac6] transition-colors" href="#"><span className="material-symbols-outlined">alternate_email</span></a>
              </div>
            </div>
            <div>
              <h5 className="font-bold text-[#0F172A] mb-6">Product</h5>
              <ul className="space-y-4">
                <li><a className="text-[#94A3B8] hover:text-[#004ac6] transition-all" href="#">Command Center</a></li>
                <li><a className="text-[#94A3B8] hover:text-[#004ac6] transition-all" href="#">Core Intelligence</a></li>
                <li><a className="text-[#94A3B8] hover:text-[#004ac6] transition-all" href="#">API Reference</a></li>
                <li><a className="text-[#94A3B8] hover:text-[#004ac6] transition-all" href="#">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-[#0F172A] mb-6">Company</h5>
              <ul className="space-y-4">
                <li><a className="text-[#94A3B8] hover:text-[#004ac6] transition-all" href="#">About Us</a></li>
                <li><a className="text-[#94A3B8] hover:text-[#004ac6] transition-all" href="#">Our Mission</a></li>
                <li><a className="text-[#94A3B8] hover:text-[#004ac6] transition-all" href="#">Careers</a></li>
                <li><a className="text-[#94A3B8] hover:text-[#004ac6] transition-all" href="#">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-[#0F172A] mb-6">Resources</h5>
              <ul className="space-y-4">
                <li><a className="text-[#94A3B8] hover:text-[#004ac6] transition-all" href="#">Case Studies</a></li>
                <li><a className="text-[#94A3B8] hover:text-[#004ac6] transition-all" href="#">Documentation</a></li>
                <li><a className="text-[#94A3B8] hover:text-[#004ac6] transition-all" href="#">Blog</a></li>
                <li><a className="text-[#94A3B8] hover:text-[#004ac6] transition-all" href="#">Security</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-[#0F172A] mb-6">Legal</h5>
              <ul className="space-y-4">
                <li><a className="text-[#94A3B8] hover:text-[#004ac6] transition-all" href="#">Privacy Policy</a></li>
                <li><a className="text-[#94A3B8] hover:text-[#004ac6] transition-all" href="#">Terms of Service</a></li>
                <li><a className="text-[#94A3B8] hover:text-[#004ac6] transition-all" href="#">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-[120px] pt-8 border-t border-[#F1F5F9] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#94A3B8] text-sm">© {new Date().getFullYear()} AssetFlow OS. Enterprise Resource Intelligence.</p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-xs text-[#16A34A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                All Systems Operational
              </span>
              <span className="text-[#94A3B8] text-xs">v4.1.2-alpha</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
