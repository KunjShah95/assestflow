"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from "motion/react";
import {
  Menu, X, ArrowRight, ChevronRight, Settings, CalendarCheck, Wrench,
  Shield, TrendingUp, Bell, Layers, Building2, Users, Warehouse, Monitor,
  ArrowRightLeft, Clock, TriangleAlert, Database, Cloud, Lock, History,
  BookOpen, HeartPulse, CheckCircle, BarChart3, Search, HardDrive
} from "lucide-react";

function useMediaQuery(q: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(q);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [q]);
  return matches;
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const reduce = useReducedMotion();

  const links = [
    { label: "Platform", href: "#platform" },
    { label: "Modules", href: "#modules" },
    { label: "Workflow", href: "#workflow" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-[#E2E8F0]">
      <div className="max-w-[1320px] mx-auto px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center">
            <span className="text-white text-sm font-bold">A</span>
          </div>
          <span className="text-[#0F172A] text-lg font-bold tracking-tight">AssetFlow</span>
        </div>

        {!isMobile && (
          <div className="flex items-center gap-8 text-[15px] text-[#475569]">
            {links.map(l => (
              <a key={l.label} href={l.href} className="hover:text-[#0F172A] transition-colors">{l.label}</a>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4">
          {!isMobile && (
            <a href="/login" className="text-[15px] text-[#475569] hover:text-[#0F172A] transition-colors">Sign in</a>
          )}
          {isMobile ? (
            <button onClick={() => setOpen(!open)} className="p-2 text-[#0F172A]" aria-label="Toggle menu">
              <Menu size={20} />
            </button>
          ) : (
            <a href="/login" className="bg-[#0F172A] text-white text-[14px] font-medium px-5 py-2.5 rounded-[10px] hover:bg-[#1e293b] transition-colors shadow-sm">
              Get Started
            </a>
          )}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border-t border-[#E2E8F0] bg-white px-6 py-4 flex flex-col gap-3"
          >
            {[...links, { label: "Sign in", href: "/login" }].map(item => (
              <a key={item.label} href={item.href} onClick={() => setOpen(false)} className="text-[15px] text-[#475569] hover:text-[#0F172A] py-1 transition-colors">
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 0.5], ["0%", "15%"]);

  return (
    <section ref={ref} className="relative min-h-[100dvh] flex items-center pt-24 pb-16 overflow-hidden bg-white">
      <motion.div style={reduce ? undefined : { y }} className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #E2E8F0 1px, transparent 0)', backgroundSize: '40px 40px', opacity: 0.5 }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#2563EB]/[0.03] blur-3xl" />
      </motion.div>

      <div className="max-w-[1320px] mx-auto px-6 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1 className="text-[44px] md:text-[56px] lg:text-[64px] font-bold text-[#0F172A] tracking-[-0.02em] leading-[1.05] mb-6">
              Enterprise Resource Intelligence. Built for organizations that can&apos;t afford chaos.
            </h1>
            <p className="text-[18px] md:text-[20px] text-[#475569] leading-relaxed mb-10" style={{ maxWidth: "620px" }}>
              AssetFlow unifies assets, people, bookings, maintenance, audits, and operational intelligence into one platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/login" className="bg-[#0F172A] text-white text-[15px] font-medium px-7 py-3.5 rounded-[12px] hover:bg-[#1e293b] transition-all inline-flex items-center gap-2 shadow-sm">
                Explore Platform <ArrowRight size={18} />
              </a>
              <a href="#platform" className="border border-[#E2E8F0] text-[#475569] text-[15px] font-medium px-7 py-3.5 rounded-[12px] hover:bg-[#F8FAFC] transition-all inline-flex items-center gap-2">
                View Mission Control <ChevronRight size={18} />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="relative"
          >
            <div className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                {["#EF4444", "#F59E0B", "#10B981"].map(c => (
                  <div key={c} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                ))}
                <div className="ml-auto text-[11px] text-[#94A3B8] font-medium">assetflow.com</div>
              </div>
              <div className="p-5 md:p-6 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Total Assets", value: "1,284" },
                    { label: "Allocated", value: "847" },
                    { label: "Available", value: "437" },
                  ].map(m => (
                    <div key={m.label} className="bg-[#F8FAFC] rounded-[12px] p-3 border border-[#E2E8F0]">
                      <div className="text-[11px] text-[#94A3B8] font-medium uppercase tracking-wider">{m.label}</div>
                      <div className="text-[22px] font-bold text-[#0F172A] mt-1">{m.value}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex justify-between text-[13px] text-[#64748B] mb-1.5">
                    <span className="font-medium text-[#475569]">Utilization Rate</span>
                    <span>66% · ↑ 12% this quarter</span>
                  </div>
                  <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <motion.div
                      initial={reduce ? false : { width: 0 }}
                      animate={{ width: "66%" }}
                      transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full bg-[#2563EB]" />
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { text: "MacBook Pro → J. Chen", time: "2m ago", color: "#10B981" },
                    { text: "Projector returned from Marketing", time: "15m ago", color: "#2563EB" },
                    { text: "Maintenance: Server Rack #SR004", time: "1h ago", color: "#F59E0B" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-1.5">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] text-[#0F172A] truncate">{item.text}</div>
                        <div className="text-[12px] text-[#94A3B8]">{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TrustedBy() {
  const items = [
    { icon: Building2, label: "Enterprise" },
    { icon: Users, label: "Healthcare" },
    { icon: HardDrive, label: "Manufacturing" },
    { icon: Monitor, label: "Technology" },
    { icon: Building2, label: "Government" },
    { icon: Warehouse, label: "Logistics" },
  ];

  return (
    <section className="py-16 border-y border-[#E2E8F0] bg-[#F8FAFC]">
      <div className="max-w-[1320px] mx-auto px-6">
        <p className="text-center text-[13px] text-[#94A3B8] font-medium uppercase tracking-wider mb-8">Trusted by operations teams across industries</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {items.map(({ icon: Icon, label }, i) => (
            <FadeIn key={label} delay={i * 0.05}>
              <div className="flex items-center gap-2.5 text-[#64748B]">
                <Icon size={20} />
                <span className="text-[15px] font-medium">{label}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const problems = [
    "Spreadsheets that don't scale across departments",
    "Assets that vanish without a trace",
    "Duplicate purchases that bleed budgets",
    "Overdue returns that disrupt operations",
    "Maintenance delays that compound costs",
    "Audit failures that create compliance risk",
  ];

  return (
    <section className="py-[120px] bg-[#020617] text-white overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <p className="text-[#2563EB] text-[14px] font-medium uppercase tracking-wider mb-4">The Problem</p>
            <h2 className="text-[36px] md:text-[42px] font-bold tracking-[-0.02em] leading-[1.1] mb-6 text-white">
              Traditional asset management is broken.
            </h2>
            <p className="text-[17px] text-[#94A3B8] leading-relaxed max-w-[55ch]">
              Spreadsheets, email chains, and disconnected tools create blind spots that cost enterprises millions in lost, duplicated, and underutilized resources.
            </p>
          </FadeIn>

          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-white/10" />
            {problems.map((problem, i) => (
              <motion.div
                key={problem}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
                className="relative pl-12 py-3.5 group"
              >
                <div className={`absolute left-[13px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border ${i === problems.length - 1 ? 'bg-[#EF4444] border-[#EF4444]' : 'bg-[#020617] border-white/20 group-hover:border-[#2563EB]'} transition-colors z-10`} />
                <div className="text-[15px] text-[#CBD5E1] group-hover:text-white transition-colors">{problem}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Solution() {
  return (
    <section className="py-[120px] bg-white">
      <div className="max-w-[1320px] mx-auto px-6">
        <FadeIn>
          <div className="text-center max-w-[800px] mx-auto mb-16">
            <p className="text-[#2563EB] text-[14px] font-medium uppercase tracking-wider mb-4">The Solution</p>
            <h2 className="text-[36px] md:text-[42px] font-bold text-[#0F172A] tracking-[-0.02em] leading-[1.1] mb-6">
              One platform. Complete resource intelligence.
            </h2>
            <p className="text-[17px] text-[#475569] leading-relaxed">
              AssetFlow replaces spreadsheets, emails, and disconnected tools with a unified system that gives you real-time visibility, automated workflows, and actionable intelligence across your entire organization.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { metric: "85%", label: "Faster allocation", desc: "Automated conflict detection reduces assignment time from hours to seconds." },
            { metric: "100%", label: "Audit readiness", desc: "Real-time asset tracking ensures you're always ready for compliance reviews." },
            { metric: "3x", label: "Utilization improvement", desc: "Idle asset detection helps you reallocate underused resources effectively." },
          ].map((item, i) => (
            <FadeIn key={item.label} delay={i * 0.1}>
              <div className="bg-[#F8FAFC] rounded-[20px] border border-[#E2E8F0] p-8">
                <div className="text-[40px] font-bold text-[#2563EB] tracking-tight mb-2">{item.metric}</div>
                <div className="text-[17px] font-semibold text-[#0F172A] mb-2">{item.label}</div>
                <div className="text-[15px] text-[#64748B] leading-relaxed">{item.desc}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function MissionControl() {
  const cards = [
    { label: "Risk Score", color: "#EF4444", value: "Low", sub: "2 flagged items" },
    { label: "System Health", color: "#10B981", value: "97%", sub: "All systems nominal" },
    { label: "Utilization", color: "#2563EB", value: "66%", sub: "+12% this quarter" },
    { label: "Avg Lifecycle", color: "#F59E0B", value: "4.2yr", sub: "Per asset class" },
    { label: "Active Bookings", color: "#2563EB", value: "18", sub: "Across 6 departments" },
    { label: "MTBF", color: "#10B981", value: "247d", sub: "Mean time between failures" },
    { label: "Pending Requests", color: "#F59E0B", value: "7", sub: "3 marked urgent" },
    { label: "Compliance", color: "#10B981", value: "94%", sub: "On track for audit" },
  ];

  return (
    <section id="platform" className="py-[120px] bg-[#020617] text-white">
      <div className="max-w-[1320px] mx-auto px-6">
        <FadeIn>
          <div className="mb-16">
            <p className="text-[#2563EB] text-[14px] font-medium uppercase tracking-wider mb-4">Mission Control</p>
            <h2 className="text-[36px] md:text-[42px] font-bold tracking-[-0.02em] leading-[1.1] mb-4 text-white">
              Your entire operation at a glance.
            </h2>
            <p className="text-[17px] text-[#94A3B8] max-w-[600px]">
              What requires attention? What is at risk? Where is money wasted? Answered in real time.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <FadeIn key={card.label} delay={i * 0.04}>
              <div className="bg-white/5 rounded-[20px] border border-white/10 p-5 hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] text-[#94A3B8] font-medium uppercase tracking-wider">{card.label}</span>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: card.color }} />
                </div>
                <div className="text-[28px] font-bold text-white tracking-tight">{card.value}</div>
                <div className="text-[13px] text-[#64748B] mt-1">{card.sub}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function CoreModules() {
  const modules = [
    { icon: ArrowRightLeft, title: "Allocation Engine", desc: "Assign, transfer, and track assets with intelligent conflict detection.", color: "#2563EB" },
    { icon: CalendarCheck, title: "Booking Intelligence", desc: "Time-slot reservations with real-time availability and overlap prevention.", color: "#10B981" },
    { icon: Wrench, title: "Maintenance Workflow", desc: "Request → Approve → Assign → Resolve with full lifecycle tracking.", color: "#F59E0B" },
    { icon: TrendingUp, title: "Analytics & Reports", desc: "Utilization trends, idle detection, heatmaps, and exportable reports.", color: "#2563EB" },
    { icon: Shield, title: "Audit Center", desc: "Cycle management, discrepancy detection, and compliance reporting.", color: "#6366F1" },
    { icon: Bell, title: "Notification Engine", desc: "Real-time alerts, approval requests, and system-wide activity logs.", color: "#EC4899" },
    { icon: Lock, title: "Policy Engine", desc: "Role-based rules, approval thresholds, and departmental compliance gates.", color: "#14B8A6" },
    { icon: Layers, title: "Resource Intelligence", desc: "Cross-department demand forecasting and utilization optimization.", color: "#8B5CF6" },
  ];

  return (
    <section id="modules" className="py-[120px] bg-[#F8FAFC]">
      <div className="max-w-[1320px] mx-auto px-6">
        <FadeIn>
          <div className="mb-16">
            <p className="text-[#2563EB] text-[14px] font-medium uppercase tracking-wider mb-4">Core Modules</p>
            <h2 className="text-[36px] md:text-[42px] font-bold text-[#0F172A] tracking-[-0.02em] leading-[1.1] mb-4">
              Everything you need to run your resources.
            </h2>
            <p className="text-[17px] text-[#475569] max-w-[600px]">
              Eight integrated engines that work together seamlessly, sharing a single source of truth.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-4 gap-4">
          {modules.map((mod, i) => (
            <FadeIn key={mod.title} delay={i * 0.05}>
              <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-6 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 h-full">
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-4" style={{ backgroundColor: `${mod.color}12` }}>
                  <mod.icon size={20} style={{ color: mod.color }} />
                </div>
                <h3 className="text-[17px] font-semibold text-[#0F172A] mb-2">{mod.title}</h3>
                <p className="text-[15px] text-[#64748B] leading-relaxed">{mod.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function Workflow() {
  const steps = [
    { icon: Monitor, label: "Register", desc: "Add assets with QR tagging, categorization, and custom fields." },
    { icon: ArrowRightLeft, label: "Allocate", desc: "Assign to employees with full audit trail and condition tracking." },
    { icon: CalendarCheck, label: "Book", desc: "Reserve time-slotted resources — rooms, vehicles, equipment." },
    { icon: Wrench, label: "Maintain", desc: "Track repairs, servicing schedules, and preventive maintenance." },
    { icon: History, label: "Transfer", desc: "Move assets across departments, locations, and custodians." },
    { icon: Shield, label: "Audit", desc: "Verify asset existence, condition, and location with cycle counts." },
    { icon: Clock, label: "Retire", desc: "Decommission with full lifecycle documentation and disposal records." },
  ];

  return (
    <section id="workflow" className="py-[120px] bg-white">
      <div className="max-w-[1320px] mx-auto px-6">
        <FadeIn>
          <div className="mb-16">
            <p className="text-[#2563EB] text-[14px] font-medium uppercase tracking-wider mb-4">Enterprise Workflow</p>
            <h2 className="text-[36px] md:text-[42px] font-bold text-[#0F172A] tracking-[-0.02em] leading-[1.1] mb-4">
              From registration to retirement.
            </h2>
            <p className="text-[17px] text-[#475569] max-w-[600px]">
              Full lifecycle management for every asset in your organization.
            </p>
          </div>
        </FadeIn>

        <div className="max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
              className="flex gap-6 group"
            >
              <div className="flex flex-col items-center">
                <div className={`w-11 h-11 rounded-[12px] border-2 flex items-center justify-center bg-white transition-colors ${i === steps.length - 1 ? 'border-[#10B981]' : 'border-[#E2E8F0] group-hover:border-[#2563EB]'}`}>
                  <step.icon size={18} className={i === steps.length - 1 ? "text-[#10B981]" : "text-[#2563EB]"} />
                </div>
                {i < steps.length - 1 && <div className="w-px h-8 bg-[#E2E8F0] group-hover:bg-[#2563EB]/30 transition-colors" />}
              </div>
              <div className="pb-8 flex-1">
                <div className="text-[16px] font-semibold text-[#0F172A]">{step.label}</div>
                <div className="text-[15px] text-[#64748B] mt-1">{step.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Intelligence() {
  const cards = [
    { icon: TriangleAlert, title: "Idle Asset Detection", desc: "Automatically surface underutilized assets that can be reallocated or retired." },
    { icon: Wrench, title: "Predictive Maintenance", desc: "AI-driven scheduling that prevents downtime before it happens." },
    { icon: ArrowRightLeft, title: "Smart Allocation", desc: "Intelligent matching of resources to requests based on availability and fit." },
    { icon: Clock, title: "Conflict Resolution", desc: "Real-time detection and resolution of scheduling and allocation conflicts." },
    { icon: Building2, title: "Department Insights", desc: "Cross-department utilization patterns and optimization recommendations." },
    { icon: TrendingUp, title: "Risk Analysis", desc: "Proactive identification of compliance, maintenance, and lifecycle risks." },
  ];

  return (
    <section id="intelligence" className="py-[120px] bg-[#F8FAFC]">
      <div className="max-w-[1320px] mx-auto px-6">
        <FadeIn>
          <div className="mb-16">
            <p className="text-[#2563EB] text-[14px] font-medium uppercase tracking-wider mb-4">Enterprise Intelligence</p>
            <h2 className="text-[36px] md:text-[42px] font-bold text-[#0F172A] tracking-[-0.02em] leading-[1.1] mb-4">
              More than asset tracking. Decision intelligence.
            </h2>
            <p className="text-[17px] text-[#475569] max-w-[600px]">
              Our engines don&apos;t just log data — they surface insights, predict problems, and recommend actions.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-4">
          {cards.map((card, i) => (
            <FadeIn key={card.title} delay={i * 0.05}>
              <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-6 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 h-full">
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-4" style={{ backgroundColor: "#2563EB12" }}>
                  <card.icon size={20} style={{ color: "#2563EB" }} />
                </div>
                <h3 className="text-[17px] font-semibold text-[#0F172A] mb-2">{card.title}</h3>
                <p className="text-[15px] text-[#64748B] leading-relaxed">{card.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function Analytics() {
  const depts = [
    { label: "Operations", pct: 92, color: "#10B981" },
    { label: "Engineering", pct: 85, color: "#10B981" },
    { label: "R&D", pct: 78, color: "#2563EB" },
    { label: "Facilities", pct: 60, color: "#2563EB" },
    { label: "IT", pct: 55, color: "#F59E0B" },
    { label: "HR", pct: 45, color: "#F59E0B" },
  ];

  return (
    <section className="py-[120px] bg-white">
      <div className="max-w-[1320px] mx-auto px-6">
        <FadeIn>
          <div className="mb-16">
            <p className="text-[#2563EB] text-[14px] font-medium uppercase tracking-wider mb-4">Analytics</p>
            <h2 className="text-[36px] md:text-[42px] font-bold text-[#0F172A] tracking-[-0.02em] leading-[1.1] mb-4">
              Data that drives decisions.
            </h2>
            <p className="text-[17px] text-[#475569] max-w-[600px]">
              Understand utilization, identify trends, and optimize your entire asset portfolio.
            </p>
          </div>
        </FadeIn>

        <div className="max-w-3xl mx-auto">
          <div className="bg-[#F8FAFC] rounded-[20px] border border-[#E2E8F0] p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[18px] font-semibold text-[#0F172A]">Utilization by Department</h3>
              <span className="text-[13px] text-[#94A3B8] font-medium">Q2 2026</span>
            </div>
            <div className="space-y-5">
              {depts.map((d, i) => (
                <motion.div
                  key={d.label}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div className="flex justify-between text-[15px] mb-1.5">
                    <span className="text-[#0F172A] font-medium">{d.label}</span>
                    <span className="text-[#475569]">{d.pct}%</span>
                  </div>
                  <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${d.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: d.color }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Architecture() {
  const layers = [
    { icon: Users, label: "Identity & Access", sub: "Employees, departments, roles, permissions" },
    { icon: Database, label: "Asset Registry", sub: "Full catalog with categories, tags, serialization" },
    { icon: CalendarCheck, label: "Booking Engine", sub: "Time-slot reservations, conflict detection" },
    { icon: ArrowRightLeft, label: "Workflow Engine", sub: "Approval flows, state machines, automation" },
    { icon: Bell, label: "Notification Engine", sub: "Alerts, activity logs, real-time webhooks" },
    { icon: TrendingUp, label: "Analytics Engine", sub: "Reporting, KPIs, utilization metrics, exports" },
    { icon: Shield, label: "Audit Engine", sub: "Cycle management, discrepancy detection, compliance" },
    { icon: Lock, label: "Policy Engine", sub: "Rules, constraints, auto-approval thresholds" },
    { icon: Settings, label: "Intelligence Layer", sub: "Predictive maintenance, risk analysis, forecasting" },
  ];

  return (
    <section id="architecture" className="py-[120px] bg-[#F8FAFC]">
      <div className="max-w-[1320px] mx-auto px-6">
        <FadeIn>
          <div className="mb-16">
            <p className="text-[#2563EB] text-[14px] font-medium uppercase tracking-wider mb-4">Architecture</p>
            <h2 className="text-[36px] md:text-[42px] font-bold text-[#0F172A] tracking-[-0.02em] leading-[1.1] mb-4">
              Engine-based. Enterprise-grade.
            </h2>
            <p className="text-[17px] text-[#475569] max-w-[600px]">
              A modular architecture where every engine is independently scalable, testable, and deployable.
            </p>
          </div>
        </FadeIn>

        <div className="max-w-3xl mx-auto">
          {layers.map((layer, i) => (
            <FadeIn key={layer.label} delay={i * 0.04}>
              <div className={`flex items-center gap-4 p-5 bg-white border border-[#E2E8F0] ${i === 0 ? 'rounded-t-[20px]' : ''} ${i === layers.length - 1 ? 'rounded-b-[20px]' : ''} ${i > 0 ? '-mt-px' : ''} hover:bg-[#F8FAFC] transition-colors group`}>
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 bg-[#F8FAFC]">
                  <layer.icon size={18} style={{ color: "#2563EB" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-semibold text-[#0F172A]">{layer.label}</div>
                  <div className="text-[14px] text-[#64748B]">{layer.sub}</div>
                </div>
                <ChevronRight size={16} className="text-[#94A3B8] group-hover:text-[#2563EB] transition-colors shrink-0" />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function Security() {
  const items = [
    { icon: Lock, title: "Encryption at Rest & Transit", desc: "All data encrypted using AES-256 and TLS 1.3 protocols." },
    { icon: Shield, title: "SOC 2 Compliance", desc: "Audited annually for security, availability, and confidentiality." },
    { icon: Users, title: "Role-Based Access Control", desc: "Granular permissions with department-level isolation." },
    { icon: History, title: "Complete Audit Trail", desc: "Every action logged, immutable, and exportable for compliance." },
  ];

  return (
    <section id="security" className="py-[120px] bg-white">
      <div className="max-w-[1320px] mx-auto px-6">
        <FadeIn>
          <div className="mb-16">
            <p className="text-[#2563EB] text-[14px] font-medium uppercase tracking-wider mb-4">Security</p>
            <h2 className="text-[36px] md:text-[42px] font-bold text-[#0F172A] tracking-[-0.02em] leading-[1.1] mb-4">
              Enterprise security by design.
            </h2>
            <p className="text-[17px] text-[#475569] max-w-[600px]">
              Your asset data is sensitive. We treat it that way — with encryption, access control, and full auditability.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.08}>
              <div className="bg-[#F8FAFC] rounded-[20px] border border-[#E2E8F0] p-6 h-full">
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-4" style={{ backgroundColor: "#2563EB12" }}>
                  <item.icon size={20} style={{ color: "#2563EB" }} />
                </div>
                <h3 className="text-[16px] font-semibold text-[#0F172A] mb-2">{item.title}</h3>
                <p className="text-[14px] text-[#64748B] leading-relaxed">{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { role: "Asset Manager", quote: "Allocation conflicts dropped to zero. We finally have real-time visibility into every asset across all departments.", dept: "Operations · 12,000+ assets" },
    { role: "Department Head", quote: "No more double-bookings, no more misplaced equipment. AssetFlow gave us back hours every week.", dept: "Engineering · 8 departments" },
    { role: "Operations Lead", quote: "Audits went from three days to under an hour. The compliance team is thrilled.", dept: "Facilities · 5 locations" },
  ];

  return (
    <section className="py-[120px] bg-[#F8FAFC]">
      <div className="max-w-[1320px] mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-[#2563EB] text-[14px] font-medium uppercase tracking-wider mb-4">Testimonials</p>
            <h2 className="text-[36px] md:text-[42px] font-bold text-[#0F172A] tracking-[-0.02em] leading-[1.1] mb-4">
              Trusted by operations teams.
            </h2>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {items.map((item, i) => (
            <FadeIn key={item.role} delay={i * 0.1}>
              <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-8 h-full flex flex-col">
                <div className="text-[#2563EB] text-3xl leading-none mb-4 opacity-30">"</div>
                <p className="text-[15px] text-[#475569] leading-relaxed mb-6 flex-1">{item.quote}</p>
                <div>
                  <div className="text-[15px] font-semibold text-[#0F172A]">{item.role}</div>
                  <div className="text-[13px] text-[#64748B]">{item.dept}</div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="py-[120px] bg-[#020617] text-white overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#2563EB]/[0.04] blur-3xl" />

      <div className="max-w-[1320px] mx-auto px-6 text-center relative z-10">
        <FadeIn>
          <h2 className="text-[36px] md:text-[42px] font-bold tracking-[-0.02em] leading-[1.1] mb-6 text-white">
            Ready to run your organization like a modern enterprise?
          </h2>
          <p className="text-[17px] text-[#94A3B8] max-w-[600px] mx-auto mb-10">
            Join organizations that have transformed their resource management with AssetFlow. Free for teams up to 50 assets.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/login" className="bg-white text-[#0F172A] text-[15px] font-medium px-8 py-3.5 rounded-[12px] hover:bg-[#F1F5F9] transition-all inline-flex items-center gap-2 shadow-sm">
              Explore AssetFlow <ArrowRight size={18} />
            </a>
            <a href="#architecture" className="border border-white/20 text-white text-[15px] font-medium px-8 py-3.5 rounded-[12px] hover:bg-white/10 transition-all">
              View Architecture
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-[#E2E8F0] py-16">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <span className="text-[#0F172A] text-lg font-bold tracking-tight">AssetFlow</span>
            </div>
            <p className="text-[15px] text-[#64748B] max-w-sm leading-relaxed">
              Enterprise Resource Intelligence platform. Unified asset, resource, and operations management for organizations that demand precision.
            </p>
          </div>
          {[
            { title: "Product", links: ["Platform", "Modules", "Integrations", "Security", "Pricing"] },
            { title: "Company", links: ["About", "Blog", "Careers", "Contact", "Press"] },
            { title: "Legal", links: ["Privacy", "Terms", "Security", "Compliance", "Status"] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-[13px] text-[#94A3B8] font-medium uppercase tracking-wider mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link}><a href="#" className="text-[15px] text-[#475569] hover:text-[#0F172A] transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-[#E2E8F0]">
          <p className="text-[13px] text-[#94A3B8]">&copy; 2026 AssetFlow. All rights reserved.</p>
          <div className="flex gap-6 text-[13px] text-[#94A3B8]">
            <a href="#" className="hover:text-[#0F172A] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#0F172A] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-white text-[#0F172A]">
      <Navbar />
      <Hero />
      <TrustedBy />
      <ProblemSection />
      <Solution />
      <MissionControl />
      <CoreModules />
      <Workflow />
      <Intelligence />
      <Analytics />
      <Architecture />
      <Security />
      <Testimonials />
      <CtaSection />
      <Footer />
    </div>
  );
}
