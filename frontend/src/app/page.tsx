"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from "motion/react";
import {
  Gear, CalendarCheck, Wrench, ShieldCheck, ChartLine, Bell,
  ArrowRight, Stack, Buildings, Users, Warehouse, GraduationCap,
  BuildingOffice, Hospital, Monitor, ArrowsLeftRight, Clock,
  Barricade, Database, Cloud, Lock, ClockCounterClockwise,
  List, X, CaretRight
} from "@phosphor-icons/react";

const ACCENT = "#2563EB";
const PRIMARY = "#0B1220";
const BEZIER = [0.32, 0.72, 0, 1] as const;

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

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 48, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, delay, ease: BEZIER }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function DoubleBezel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-black/[0.02] p-[1px] rounded-[1.5rem] ${className}`}>
      <div className="bg-white rounded-[calc(1.5rem-1px)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] h-full">
        {children}
      </div>
    </div>
  );
}

function DarkBezel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/[0.06] p-[1px] rounded-[1.5rem] ${className}`}>
      <div className="bg-[#0B1220] rounded-[calc(1.5rem-1px)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] h-full">
        {children}
      </div>
    </div>
  );
}

function IslandButton({ href, children, variant = "primary", className = "" }: { href: string; children: React.ReactNode; variant?: "primary" | "ghost"; className?: string }) {
  const base = {
    primary: "bg-[#0B1220] text-white hover:bg-[#1a2538]",
    ghost: "border border-[#E5E7EB] text-[#475569] hover:border-[#CBD5E1] hover:text-[#0B1220]",
  };
  const iconWrap = {
    primary: "bg-white/10 text-white",
    ghost: "bg-black/5 text-[#475569]",
  };
  return (
    <a href={href} className={`group inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] ${base[variant]} ${className}`}>
      <span>{children}</span>
      <span className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-[2px] group-hover:-translate-y-[1px] group-hover:scale-105 ${iconWrap[variant]}`}>
        <ArrowRight size={14} weight="bold" />
      </span>
    </a>
  );
}

function LightIslandButton({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} className={`group inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium text-[#0B1220] bg-white hover:bg-[#F8FAFC] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] ${className}`}>
      <span>{children}</span>
      <span className="w-8 h-8 rounded-full bg-[#0B1220]/10 text-[#0B1220] flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-[2px] group-hover:-translate-y-[1px] group-hover:scale-105">
        <ArrowRight size={14} weight="bold" />
      </span>
    </a>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium text-[#2563EB] bg-[#2563EB]/8 mb-5">
      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
      {children}
    </div>
  );
}

function DotGrid({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
  );
}

function GrainOverlay() {
  return <div className="grain-overlay" />;
}

const NAV_LINKS = ["Platform", "Modules", "Intelligence", "Workflow", "Pricing"];

function Navbar() {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const reduce = useReducedMotion();

  return (
    <>
      <nav className="fixed top-4 md:top-5 left-1/2 -translate-x-1/2 z-40 w-max max-w-[calc(100vw-2rem)]">
        <div className="backdrop-blur-2xl bg-white/90 rounded-full border border-white/20 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between px-4 md:px-5 h-12 md:h-14">
            <div className="flex items-center gap-2 pr-4 md:pr-8">
              <div className="w-7 h-7 rounded-lg bg-[#0B1220] flex items-center justify-center">
                <span className="text-white text-[11px] font-bold">A</span>
              </div>
              <span className="text-[#0B1220] text-[15px] font-bold tracking-tight">AssetFlow</span>
            </div>

            {!isMobile && (
              <div className="flex items-center gap-6 text-[13px] text-[#475569] mr-6">
                {NAV_LINKS.map(l => (
                  <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-[#0B1220] transition-colors duration-300">{l}</a>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3">
              {!isMobile && (
                <a href="/login" className="text-[13px] text-[#475569] hover:text-[#0B1220] transition-colors duration-300 mr-1">Sign in</a>
              )}
              {isMobile ? (
                <button onClick={() => setOpen(true)} className="w-8 h-8 flex items-center justify-center text-[#0B1220]" aria-label="Menu">
                  <List size={18} weight="light" />
                </button>
              ) : (
                <IslandButton href="/login">Get Started</IslandButton>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: BEZIER }}
            className="fixed inset-0 z-50 backdrop-blur-3xl bg-white/98 flex flex-col"
          >
            <div className="flex justify-end p-5">
              <button onClick={() => setOpen(false)} className="w-10 h-10 flex items-center justify-center text-[#0B1220]" aria-label="Close">
                <X size={20} weight="light" />
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-8 pb-24">
              {NAV_LINKS.map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  initial={reduce ? false : { opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: BEZIER }}
                  className="text-[36px] md:text-[52px] font-bold text-[#0B1220] tracking-[-0.03em] hover:text-[#2563EB] transition-colors duration-300"
                >
                  {item}
                </motion.a>
              ))}
              <motion.a
                href="/login"
                onClick={() => setOpen(false)}
                initial={reduce ? false : { opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + NAV_LINKS.length * 0.08, duration: 0.6, ease: BEZIER }}
              >
                <IslandButton href="/login">Sign In</IslandButton>
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100dvh] flex items-center pt-28 md:pt-40 pb-20 overflow-hidden bg-[#FAFBFC]">
      <motion.div style={reduce ? undefined : { y, opacity }} className="absolute inset-0 pointer-events-none">
        <DotGrid />
        <div className="absolute top-1/3 left-[10%] -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#2563EB]/[0.03] blur-3xl" />
        <div className="absolute top-1/2 right-[5%] w-[400px] h-[400px] rounded-full bg-[#0B1220]/[0.015] blur-3xl" />
      </motion.div>

      <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <Reveal>
            <Eyebrow>Enterprise Resource Intelligence</Eyebrow>
            <h1 className="text-[44px] md:text-[68px] lg:text-[76px] font-bold text-[#0B1220] tracking-[-0.035em] leading-[0.92] mb-6">
              The operating system for your organization&apos;s resources.
            </h1>
            <p className="text-[16px] md:text-[17px] text-[#64748B] leading-relaxed max-w-[55ch] mb-10">
              AssetFlow unifies assets, people, bookings, maintenance, audits, and operational intelligence into one platform that runs your entire resource operation.
            </p>
            <div className="flex flex-wrap gap-4">
              <IslandButton href="/login">Explore Platform</IslandButton>
              <a href="#mission-control" className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium text-[#475569] hover:text-[#0B1220] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] border border-transparent hover:border-[#E5E7EB]">
                <span>Watch Overview</span>
                <span className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center group-hover:translate-x-[2px] group-hover:-translate-y-[1px] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:bg-black/10">
                  <CaretRight size={14} weight="bold" />
                </span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <DoubleBezel>
              <div className="p-4 md:p-6">
                <div className="flex items-center gap-1.5 mb-4">
                  {["#EF4444", "#F59E0B", "#10B981"].map(c => (
                    <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
                  ))}
                  <div className="ml-auto text-[10px] text-[#94A3B8] font-medium tracking-wider uppercase">Live</div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: "Total Assets", value: "1,284" },
                    { label: "Allocated", value: "847" },
                    { label: "Available", value: "437" },
                  ].map(m => (
                    <div key={m.label} className="bg-[#F8FAFC] rounded-xl p-3">
                      <div className="text-[10px] text-[#94A3B8] font-medium uppercase tracking-wider">{m.label}</div>
                      <div className="text-[24px] font-bold text-[#0B1220] mt-0.5 tracking-tight">{m.value}</div>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-[12px] text-[#64748B] mb-2">
                    <span className="font-medium">Utilization Rate</span>
                    <span>66% · ↑ 12% this quarter</span>
                  </div>
                  <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <motion.div
                      initial={reduce ? false : { width: 0 }}
                      whileInView={{ width: "66%" }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6, duration: 1.2, ease: BEZIER }}
                      className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6]" />
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    { text: "MacBook Pro #MB2847 → J. Chen", time: "2m ago", color: "#10B981" },
                    { text: "Projector #PJ0192 returned from Marketing", time: "15m ago", color: "#2563EB" },
                    { text: "Maintenance due: Server Rack #SR004", time: "1h ago", color: "#F59E0B" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-1.5">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] text-[#0B1220] truncate font-medium">{item.text}</div>
                        <div className="text-[11px] text-[#94A3B8]">{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DoubleBezel>
          </Reveal>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <div className="w-5 h-8 rounded-full border border-black/10 flex items-start justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1.5 rounded-full bg-black/30"
          />
        </div>
      </motion.div>
    </section>
  );
}

function TrustedBy() {
  const items = [
    { icon: GraduationCap, label: "Universities" },
    { icon: Hospital, label: "Healthcare" },
    { icon: Buildings, label: "Manufacturing" },
    { icon: BuildingOffice, label: "Corporate" },
    { icon: Warehouse, label: "Government" },
    { icon: Users, label: "Logistics" },
  ];

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium text-[#64748B] bg-[#F8FAFC]">
            Built for every industry
          </span>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
          {items.map(({ icon: Icon, label }, i) => (
            <Reveal key={label} delay={i * 0.05}>
              <div className="flex items-center gap-2.5 px-5 py-2.5 text-[#64748B] hover:text-[#0B1220] transition-colors duration-300">
                <Icon size={18} weight="light" />
                <span className="text-[14px] font-medium">{label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const problems = [
    "Spreadsheets that don't scale",
    "Assets vanish without a trace",
    "Duplicate purchases bleed budgets",
    "Overdue returns disrupt operations",
    "Maintenance delays compound costs",
    "Audit failures trigger compliance risk",
  ];

  return (
    <section className="py-32 md:py-40 bg-[#0B1220] text-white overflow-hidden relative">
      <DotGrid className="opacity-[0.04]" />
      <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#2563EB]/[0.04] blur-3xl" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <Reveal>
            <Eyebrow>The Problem</Eyebrow>
            <h2 className="text-[36px] md:text-[52px] font-bold tracking-[-0.03em] leading-[1.05] mb-6">
              Traditional asset management is a friction machine.
            </h2>
            <p className="text-[16px] text-[#94A3B8] leading-relaxed max-w-[55ch]">
              Spreadsheets, email chains, and disconnected tools create blind spots that cost enterprises millions in lost, duplicated, and underutilized resources. You&apos;re not managing assets — you&apos;re managing chaos.
            </p>
          </Reveal>

          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-white/10" />
            {problems.map((problem, i) => (
              <motion.div
                key={problem}
                initial={{ opacity: 0, x: 32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, ease: BEZIER }}
                className="relative pl-12 py-3.5 group cursor-default"
              >
                <div className={`absolute left-[13px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border ${i === problems.length - 1 ? 'bg-[#EF4444] border-[#EF4444]' : 'bg-[#0B1220] border-white/20 group-hover:border-[#2563EB]'} transition-colors duration-500 z-10`} />
                <div className="text-[15px] text-[#CBD5E1] group-hover:text-white transition-colors duration-300 font-medium">{problem}</div>
              </motion.div>
            ))}

            <Reveal delay={0.4}>
              <DarkBezel className="mt-8 ml-12">
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#2563EB] text-[13px] font-semibold">AssetFlow resolves this</span>
                    <ArrowRight size={14} weight="bold" className="text-[#2563EB]" />
                  </div>
                  <p className="text-[14px] text-[#94A3B8]">Everything connected. Real-time visibility. Zero blind spots.</p>
                </div>
              </DarkBezel>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function MissionControl() {
  const cards = [
    { label: "Risk Score", color: "#EF4444", value: "Low", sub: "2 flagged items", span: "col-span-1" },
    { label: "Health", color: "#10B981", value: "97%", sub: "All systems nominal", span: "col-span-1" },
    { label: "Utilization", color: "#2563EB", value: "66%", sub: "+12% this quarter", span: "col-span-1" },
    { label: "Lifecycle", color: "#F59E0B", value: "4.2yr", sub: "Avg asset age", span: "col-span-1" },
    { label: "Active Bookings", color: "#2563EB", value: "18", sub: "Across 6 departments", span: "col-span-2" },
    { label: "MTBF", color: "#14B8A6", value: "247d", sub: "Mean time between failures", span: "col-span-1" },
    { label: "Pending Requests", color: "#F59E0B", value: "7", sub: "Maintenance · 3 urgent", span: "col-span-1" },
    { label: "Compliance", color: "#10B981", value: "94%", sub: "On track for quarterly audit", span: "col-span-2" },
  ];

  return (
    <section id="platform" className="py-32 md:py-40 bg-[#FAFBFC]">
      <div className="max-w-[1400px] mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <Eyebrow>Mission Control</Eyebrow>
            <h2 className="text-[36px] md:text-[52px] font-bold text-[#0B1220] tracking-[-0.03em] leading-[1.05] mb-4">
              Your entire operation at a glance.
            </h2>
            <p className="text-[16px] text-[#64748B] max-w-[60ch] mx-auto">
              Real-time KPIs, health monitoring, and operational intelligence in a single, unified dashboard.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {cards.map((card, i) => (
            <Reveal key={card.label} delay={i * 0.04}>
              <DoubleBezel className={card.span}>
                <div className="p-4 md:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] text-[#94A3B8] font-medium uppercase tracking-[0.15em]">{card.label}</span>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: card.color }} />
                  </div>
                  <div className="text-[28px] md:text-[32px] font-bold text-[#0B1220] tracking-tight">{card.value}</div>
                  <div className="text-[12px] text-[#94A3B8] mt-1">{card.sub}</div>
                </div>
              </DoubleBezel>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CoreModules() {
  const modules = [
    { icon: ArrowsLeftRight, title: "Allocation Engine", desc: "Assign, transfer, and track assets with intelligent conflict detection and role-based access.", color: "#2563EB", span: "md:col-span-1" },
    { icon: CalendarCheck, title: "Booking Intelligence", desc: "Time-slot reservations with real-time availability, overlap prevention, and calendar sync.", color: "#10B981", span: "md:col-span-1" },
    { icon: Wrench, title: "Maintenance Workflow", desc: "Request → Approve → Assign → Resolve. Full lifecycle with preventive scheduling.", color: "#F59E0B", span: "md:col-span-1" },
    { icon: ChartLine, title: "Analytics & Reporting", desc: "Utilization trends, idle detection, heatmaps, exportable reports, and custom dashboards.", color: "#2563EB", span: "md:col-span-2" },
    { icon: ShieldCheck, title: "Audit Center", desc: "Cycle management, discrepancy detection, serialized tracking, and compliance reporting.", color: "#6366F1", span: "md:col-span-1" },
    { icon: Bell, title: "Notification Engine", desc: "Real-time alerts, multi-channel approval requests, and system-wide activity logs.", color: "#EC4899", span: "md:col-span-1" },
    { icon: Lock, title: "Policy Engine", desc: "Role-based rules, auto-approval thresholds, departmental policies, and compliance gates.", color: "#14B8A6", span: "md:col-span-1" },
    { icon: Stack, title: "Resource Intelligence", desc: "Cross-department demand forecasting, utilization optimization, and what-if analysis.", color: "#8B5CF6", span: "md:col-span-2" },
  ];

  return (
    <section id="modules" className="py-32 md:py-40 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <Eyebrow>Core Modules</Eyebrow>
            <h2 className="text-[36px] md:text-[52px] font-bold text-[#0B1220] tracking-[-0.03em] leading-[1.05] mb-4">
              Seven integrated engines. One unified platform.
            </h2>
            <p className="text-[16px] text-[#64748B] max-w-[60ch] mx-auto">
              Every engine is built to work independently or in concert, sharing a single source of truth.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-4 gap-3 md:gap-4 auto-rows-fr">
          {modules.map((mod, i) => (
            <Reveal key={mod.title} delay={i * 0.05}>
              <DoubleBezel className={`${mod.span} h-full`}>
                <div className="p-5 md:p-6 h-full flex flex-col">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 shrink-0" style={{ backgroundColor: `${mod.color}12` }}>
                    <mod.icon size={18} weight="light" style={{ color: mod.color }} />
                  </div>
                  <h3 className="text-[15px] font-semibold text-[#0B1220] mb-1.5">{mod.title}</h3>
                  <p className="text-[13px] text-[#64748B] leading-relaxed flex-1">{mod.desc}</p>
                </div>
              </DoubleBezel>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Workflow() {
  const steps = [
    { icon: Monitor, label: "Register", desc: "Add assets with QR tagging, categorization, and custom fields." },
    { icon: ArrowsLeftRight, label: "Allocate", desc: "Assign to employees with timestamps, conditions, and audit trail." },
    { icon: CalendarCheck, label: "Book", desc: "Reserve time-slotted resources — rooms, vehicles, equipment, and more." },
    { icon: Wrench, label: "Maintain", desc: "Track repairs, servicing schedules, and preventive maintenance cycles." },
    { icon: ClockCounterClockwise, label: "Transfer", desc: "Move assets across departments, locations, and custodians." },
    { icon: ShieldCheck, label: "Audit", desc: "Verify existence, condition, and location with cycle counts." },
    { icon: Clock, label: "Retire", desc: "Decommission with full lifecycle documentation and disposal records." },
  ];

  return (
    <section id="workflow" className="py-32 md:py-40 bg-[#FAFBFC]">
      <div className="max-w-[1400px] mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <Eyebrow>Enterprise Workflow</Eyebrow>
            <h2 className="text-[36px] md:text-[52px] font-bold text-[#0B1220] tracking-[-0.03em] leading-[1.05] mb-4">
              From registration to retirement.
            </h2>
            <p className="text-[16px] text-[#64748B] max-w-[60ch] mx-auto">
              Full lifecycle management for every asset in your organization, from acquisition to decommission.
            </p>
          </div>
        </Reveal>

        <div className="max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -24, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.8, ease: BEZIER }}
              className="flex gap-6 group cursor-default"
            >
              <div className="flex flex-col items-center">
                <DoubleBezel className="w-11 h-11 !rounded-xl">
                  <div className="w-11 h-11 rounded-[calc(1.5rem-1px)] flex items-center justify-center">
                    <step.icon size={16} weight="light" className={i === steps.length - 1 ? "text-[#10B981]" : "text-[#2563EB]"} />
                  </div>
                </DoubleBezel>
                {i < steps.length - 1 && <div className="w-px h-8 bg-black/5 group-hover:bg-[#2563EB]/20 transition-colors duration-500" />}
              </div>
              <div className="pb-8 flex-1">
                <div className="text-[15px] font-semibold text-[#0B1220]">{step.label}</div>
                <div className="text-[14px] text-[#64748B] mt-0.5">{step.desc}</div>
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
    { icon: Barricade, title: "Idle Asset Detection", desc: "Automatically surface underutilized assets that can be reallocated or retired.", color: "#2563EB", span: "md:col-span-1" },
    { icon: Wrench, title: "Predictive Maintenance", desc: "AI-driven scheduling that prevents downtime before it happens, reducing repair costs.", color: "#10B981", span: "md:col-span-2" },
    { icon: ArrowsLeftRight, title: "Smart Allocation", desc: "Intelligent matching of resources to requests based on availability, skills, and proximity.", color: "#F59E0B", span: "md:col-span-1" },
    { icon: Clock, title: "Conflict Resolution", desc: "Real-time detection and resolution of scheduling, allocation, and booking conflicts.", color: "#6366F1", span: "md:col-span-1" },
    { icon: Buildings, title: "Department Insights", desc: "Cross-department utilization patterns, cost allocation, and optimization recommendations.", color: "#14B8A6", span: "md:col-span-2" },
    { icon: Bell, title: "Risk Analysis", desc: "Proactive identification of compliance gaps, maintenance risks, and lifecycle exposure.", color: "#EC4899", span: "md:col-span-1" },
  ];

  return (
    <section id="intelligence" className="py-32 md:py-40 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <Eyebrow>Intelligence Layer</Eyebrow>
            <h2 className="text-[36px] md:text-[52px] font-bold text-[#0B1220] tracking-[-0.03em] leading-[1.05] mb-4">
              Beyond tracking. Enterprise decision intelligence.
            </h2>
            <p className="text-[16px] text-[#64748B] max-w-[60ch] mx-auto">
              Our engines don&apos;t just log data — they surface insights, predict problems, and recommend actions before you ask.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-3 md:gap-4 auto-rows-fr">
          {cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.05}>
              <DoubleBezel className={`${card.span} h-full`}>
                <div className="p-5 md:p-6 h-full flex flex-col">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 shrink-0" style={{ backgroundColor: `${card.color}12` }}>
                    <card.icon size={18} weight="light" style={{ color: card.color }} />
                  </div>
                  <h3 className="text-[15px] font-semibold text-[#0B1220] mb-1.5">{card.title}</h3>
                  <p className="text-[13px] text-[#64748B] leading-relaxed flex-1">{card.desc}</p>
                </div>
              </DoubleBezel>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Analytics() {
  const depts = [
    { label: "Operations", pct: 92 },
    { label: "Engineering", pct: 85 },
    { label: "R&D", pct: 78 },
    { label: "Facilities", pct: 60 },
    { label: "IT", pct: 55 },
    { label: "HR", pct: 45 },
  ];

  return (
    <section className="py-32 md:py-40 bg-[#FAFBFC]">
      <div className="max-w-[1400px] mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <Eyebrow>Analytics</Eyebrow>
            <h2 className="text-[36px] md:text-[52px] font-bold text-[#0B1220] tracking-[-0.03em] leading-[1.05] mb-4">
              Data that drives decisions.
            </h2>
            <p className="text-[16px] text-[#64748B] max-w-[60ch] mx-auto">
              Understand utilization, identify trends, and optimize your entire asset portfolio with data you can trust.
            </p>
          </div>
        </Reveal>

        <div className="max-w-3xl mx-auto">
          <DoubleBezel>
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[15px] font-semibold text-[#0B1220]">Utilization by Department</h3>
                <span className="text-[11px] text-[#94A3B8] font-medium uppercase tracking-wider">Q2 2026</span>
              </div>
              <div className="space-y-4">
                {depts.map((d, i) => (
                  <motion.div
                    key={d.label}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <div className="flex justify-between text-[14px] mb-1.5">
                      <span className="text-[#0B1220] font-medium">{d.label}</span>
                      <span className="text-[#64748B]">{d.pct}%</span>
                    </div>
                    <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${d.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08, duration: 1, ease: BEZIER }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: d.pct > 80 ? "#10B981" : d.pct > 60 ? "#2563EB" : "#F59E0B" }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </DoubleBezel>
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
    { icon: ArrowsLeftRight, label: "Workflow Engine", sub: "Approval flows, state machines, automation" },
    { icon: Bell, label: "Notification Engine", sub: "Alerts, activity logs, real-time webhooks" },
    { icon: ChartLine, label: "Analytics Engine", sub: "Reporting, KPIs, utilization metrics, exports" },
    { icon: ShieldCheck, label: "Audit Engine", sub: "Cycle management, discrepancy detection, compliance" },
    { icon: Lock, label: "Policy Engine", sub: "Rules, constraints, auto-approval thresholds" },
    { icon: Gear, label: "Intelligence", sub: "Predictive maintenance, risk analysis, forecasting" },
  ];

  return (
    <section id="architecture" className="py-32 md:py-40 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <Eyebrow>Architecture</Eyebrow>
            <h2 className="text-[36px] md:text-[52px] font-bold text-[#0B1220] tracking-[-0.03em] leading-[1.05] mb-4">
              Engine-based. Enterprise-grade.
            </h2>
            <p className="text-[16px] text-[#64748B] max-w-[60ch] mx-auto">
              A modular architecture where every engine is independently scalable, testable, and deployable.
            </p>
          </div>
        </Reveal>

        <div className="max-w-3xl mx-auto">
          {layers.map((layer, i) => (
            <Reveal key={layer.label} delay={i * 0.04}>
              <DoubleBezel className="mb-2">
                <div className="flex items-center gap-4 p-4 md:p-5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-[#F8FAFC]">
                    <layer.icon size={16} weight="light" style={{ color: ACCENT }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-[#0B1220]">{layer.label}</div>
                    <div className="text-[12px] text-[#94A3B8]">{layer.sub}</div>
                  </div>
                  <motion.div
                    initial={{ x: -4, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    className="text-[#2563EB] shrink-0"
                  >
                    <ArrowRight size={14} weight="bold" />
                  </motion.div>
                </div>
              </DoubleBezel>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { role: "Asset Manager", quote: "Allocation conflicts dropped to zero. We finally have real-time visibility into every single asset across all departments.", dept: "Operations · 12,000+ assets" },
    { role: "Department Head", quote: "No more double-bookings, no more misplaced equipment. AssetFlow gave us back hours every week.", dept: "Engineering · 8 departments" },
    { role: "Operations Lead", quote: "Audits went from taking three days to under an hour. The compliance team is thrilled.", dept: "Facilities · 5 locations" },
  ];

  return (
    <section className="py-32 md:py-40 bg-[#FAFBFC]">
      <div className="max-w-[1400px] mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <Eyebrow>Testimonials</Eyebrow>
            <h2 className="text-[36px] md:text-[52px] font-bold text-[#0B1220] tracking-[-0.03em] leading-[1.05] mb-4">
              Trusted by operations teams.
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto">
          {items.map((item, i) => (
            <Reveal key={item.role} delay={i * 0.1}>
              <DoubleBezel className="h-full">
                <div className="p-6 md:p-8 flex flex-col h-full">
                  <svg className="w-6 h-6 text-[#2563EB] mb-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" opacity="0.25">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-[15px] text-[#475569] leading-relaxed mb-6 flex-1">&ldquo;{item.quote}&rdquo;</p>
                  <div>
                    <div className="text-[14px] font-semibold text-[#0B1220]">{item.role}</div>
                    <div className="text-[12px] text-[#94A3B8]">{item.dept}</div>
                  </div>
                </div>
              </DoubleBezel>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="py-32 md:py-40 bg-[#0B1220] text-white overflow-hidden relative">
      <DotGrid className="opacity-[0.04]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#2563EB]/[0.04] blur-3xl" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 text-center relative z-10">
        <Reveal>
          <Eyebrow>Get Started</Eyebrow>
          <h2 className="text-[36px] md:text-[56px] font-bold tracking-[-0.03em] leading-[1.02] mb-6 max-w-[900px] mx-auto">
            Ready to run your organization like a modern enterprise?
          </h2>
          <p className="text-[16px] text-[#94A3B8] max-w-[55ch] mx-auto mb-10">
            Join organizations that have transformed their resource management with AssetFlow. Free for teams up to 50 assets.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <LightIslandButton href="/login">Explore AssetFlow</LightIslandButton>
            <a href="#architecture" className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium text-[#94A3B8] hover:text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] border border-white/10 hover:border-white/20">
              <span>View Architecture</span>
              <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:translate-x-[2px] group-hover:-translate-y-[1px] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:bg-white/10">
                <ArrowRight size={14} weight="bold" />
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0B1220] border-t border-white/5 py-16 md:py-20">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-10 mb-14">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
                <span className="text-[#0B1220] text-[11px] font-bold">A</span>
              </div>
              <span className="text-white text-[15px] font-bold tracking-tight">AssetFlow</span>
            </div>
            <p className="text-[14px] text-[#64748B] max-w-sm leading-relaxed">
              Enterprise Resource Intelligence platform. Unified asset, resource, and operations management for organizations that demand precision.
            </p>
          </div>
          {[
            { title: "Product", links: ["Platform", "Modules", "Integrations", "Security", "Pricing"] },
            { title: "Company", links: ["About", "Blog", "Careers", "Contact", "Press"] },
            { title: "Legal", links: ["Privacy", "Terms", "Security", "Compliance", "Status"] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-[11px] text-[#64748B] font-medium uppercase tracking-[0.15em] mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-[14px] text-[#94A3B8] hover:text-white transition-colors duration-300">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5">
          <p className="text-[12px] text-[#64748B]">&copy; 2026 AssetFlow. All rights reserved.</p>
          <div className="flex gap-6 text-[12px] text-[#64748B]">
            <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <>
      <GrainOverlay />
      <div className="bg-[#FAFBFC] text-[#0B1220]">
        <Navbar />
        <Hero />
        <TrustedBy />
        <ProblemSection />
        <MissionControl />
        <CoreModules />
        <Workflow />
        <Intelligence />
        <Analytics />
        <Architecture />
        <Testimonials />
        <CtaSection />
        <Footer />
      </div>
    </>
  );
}
