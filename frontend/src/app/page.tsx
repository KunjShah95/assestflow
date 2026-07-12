"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from "motion/react";
import { Gear, CalendarCheck, Wrench, ShieldCheck, ChartLine, Bell, ArrowRight, CaretRight, Stack, Buildings, Users, Warehouse, GraduationCap, BuildingOffice, Hospital, Monitor, ArrowsLeftRight, Clock, Barricade, Database, Cloud, Lock, ClockCounterClockwise } from "@phosphor-icons/react";

const accent = "#2563EB";
const primary = "#0B1220";

function useMediaQuery(q: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(q);
    const t = setTimeout(() => {
      setMatches(mql.matches);
    }, 0);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => {
      clearTimeout(t);
      mql.removeEventListener("change", handler);
    };
  }, [q]);
  return matches;
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const reduce = useReducedMotion();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-[#E5E7EB]">
      <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between h-16 md:h-[72px]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0B1220] flex items-center justify-center">
            <span className="text-white text-sm font-bold">A</span>
          </div>
          <span className="text-[#0B1220] text-lg font-bold tracking-tight">AssetFlow</span>
        </div>

        {!isMobile && (
          <div className="flex items-center gap-8 text-[15px] text-[#475569]">
            <a href="#mission-control" className="hover:text-[#0B1220] transition-colors">Platform</a>
            <a href="#modules" className="hover:text-[#0B1220] transition-colors">Modules</a>
            <a href="#intelligence" className="hover:text-[#0B1220] transition-colors">Intelligence</a>
            <a href="#workflow" className="hover:text-[#0B1220] transition-colors">Workflow</a>
            <a href="#pricing" className="hover:text-[#0B1220] transition-colors">Pricing</a>
          </div>
        )}

        <div className="flex items-center gap-4">
          <a href="/login" className="text-[15px] text-[#475569] hover:text-[#0B1220] transition-colors hidden md:inline">Sign in</a>
          {isMobile ? (
            <button onClick={() => setOpen(!open)} className="p-2 text-[#0B1220]">
              <span className="block w-5 h-0.5 bg-current mb-1" />
              <span className="block w-5 h-0.5 bg-current mb-1" />
              <span className="block w-5 h-0.5 bg-current" />
            </button>
          ) : (
            <a href="/login" className="bg-[#0B1220] text-white text-[14px] font-medium px-5 py-2 rounded-lg hover:bg-[#1e293b] transition-colors">Get Started</a>
          )}
        </div>
      </div>
      <AnimatePresence>
        {open && isMobile && (
          <motion.div initial={reduce ? false : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="border-t border-[#E5E7EB] bg-white px-6 py-4 flex flex-col gap-3">
            {["Platform", "Modules", "Intelligence", "Workflow", "Pricing"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setOpen(false)} className="text-[15px] text-[#475569] hover:text-[#0B1220] py-1">{item}</a>
            ))}
            <a href="/login" className="text-[15px] text-[#0B1220] font-medium pt-2 border-t border-[#E5E7EB]">Sign in</a>
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
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100dvh] flex items-center pt-24 md:pt-28 overflow-hidden bg-[#F8FAFC]">
      <motion.div style={reduce ? undefined : { y, opacity }} className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #E5E7EB 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#2563EB]/[0.03] blur-3xl" />
      </motion.div>

      <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={reduce ? false : { opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
            <div className="inline-flex items-center gap-2 bg-[#2563EB]/10 text-[#2563EB] text-[13px] font-medium px-4 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
              Enterprise Resource Intelligence
            </div>
            <h1 className="text-[40px] md:text-[56px] lg:text-[64px] font-bold text-[#0B1220] tracking-[-0.03em] leading-[1.05] mb-6">
              Enterprise Resource Intelligence. Built for the Organizations That Can&apos;t Afford Chaos.
            </h1>
            <p className="text-[17px] md:text-[18px] text-[#475569] leading-relaxed max-w-[65ch] mb-8">
              AssetFlow unifies assets, people, bookings, maintenance, audits, and operational intelligence into one modern enterprise platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/login" className="bg-[#0B1220] text-white text-[15px] font-medium px-7 py-3.5 rounded-xl hover:bg-[#1e293b] transition-all inline-flex items-center gap-2 shadow-sm">
                Explore Platform <ArrowRight size={18} weight="bold" />
              </a>
              <a href="#mission-control" className="border border-[#E5E7EB] text-[#0B1220] text-[15px] font-medium px-7 py-3.5 rounded-xl hover:bg-[#F1F5F9] transition-all inline-flex items-center gap-2">
                Watch Demo <CaretRight size={18} />
              </a>
            </div>
          </motion.div>

          <motion.div initial={reduce ? false : { opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="relative">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_20px_60px_-12px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#E5E7EB] bg-[#F8FAFC]">
                {["#EF4444", "#F59E0B", "#10B981"].map(c => <div key={c} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />)}
              </div>
              <div className="p-4 md:p-6 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {["Total Assets", "Allocated", "Available"].map(label => (
                    <div key={label} className="bg-[#F8FAFC] rounded-xl p-3 border border-[#E5E7EB]">
                      <div className="text-[11px] text-[#64748B] font-medium uppercase tracking-wider">{label}</div>
                      <div className="text-[22px] font-bold text-[#0B1220] mt-1">
                        {label === "Total Assets" ? "1,284" : label === "Allocated" ? "847" : "437"}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div className="h-full w-[66%] bg-[#2563EB] rounded-full" />
                </div>
                <div className="flex justify-between text-[12px] text-[#64748B]">
                  <span>Utilization Rate: 66%</span>
                  <span>↑ 12% this quarter</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-3 -right-3 w-full h-full border-2 border-[#2563EB]/20 rounded-2xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TrustedBy() {
  const items = [
    { icon: GraduationCap, label: "Universities" },
    { icon: Hospital, label: "Hospitals" },
    { icon: Buildings, label: "Manufacturing" },
    { icon: BuildingOffice, label: "Corporate Offices" },
    { icon: Warehouse, label: "Government" },
    { icon: Users, label: " Warehouses" },
  ];
  const reduce = useReducedMotion();

  return (
    <section className="py-16 md:py-20 bg-white border-y border-[#E5E7EB]">
      <div className="max-w-[1400px] mx-auto px-6">
        <p className="text-center text-[13px] text-[#64748B] font-medium uppercase tracking-[0.15em] mb-8">Built For</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {items.map(({ icon: Icon, label }) => (
            <motion.div key={label} initial={reduce ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center gap-2.5 text-[#475569]">
              <Icon size={22} weight="duotone" />
              <span className="text-[15px] font-medium">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const reduce = useReducedMotion();
  const problems = ["Spreadsheet Chaos", "Lost Assets", "Duplicate Purchases", "Overdue Returns", "Maintenance Delays", "Audit Failures"];

  return (
    <section className="py-24 md:py-32 bg-[#0B1220] text-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={reduce ? false : { opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
            <p className="text-[#2563EB] text-[13px] font-medium uppercase tracking-[0.15em] mb-4">The Problem</p>
            <h2 className="text-[36px] md:text-[48px] font-bold tracking-[-0.03em] leading-[1.1] mb-6">
              Traditional asset management is broken.
            </h2>
            <p className="text-[17px] text-[#94A3B8] leading-relaxed max-w-[65ch]">
              Spreadsheets, email chains, and disconnected tools create blind spots that cost enterprises millions in lost, duplicated, and underutilized resources.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-[#1E293B]" />
            {problems.map((problem, i) => (
              <motion.div key={problem} initial={reduce ? false : { opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="relative pl-12 py-4 group cursor-default"
              >
                <div className={`absolute left-[13px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 ${i === problems.length - 1 ? 'bg-[#EF4444] border-[#EF4444]' : 'bg-[#0B1220] border-[#475569] group-hover:border-[#2563EB]'} transition-colors z-10`} />
                <div className="text-[15px] text-[#CBD5E1] group-hover:text-white transition-colors">{problem}</div>
                {i < problems.length - 1 && <div className="text-[12px] text-[#475569] mt-0.5">↓</div>}
              </motion.div>
            ))}
            <motion.div initial={reduce ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 ml-12 bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-xl p-5"
            >
              <p className="text-[#2563EB] font-semibold text-[15px]">→ AssetFlow</p>
              <p className="text-[#94A3B8] text-[14px] mt-1">Everything connected. Real-time visibility. Zero blind spots.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MissionControl() {
  const reduce = useReducedMotion();
  const cards = [
    { label: "Risk", color: "#EF4444", value: "Low", sub: "2 flagged items" },
    { label: "Health", color: "#10B981", value: "97%", sub: "All systems nominal" },
    { label: "Utilization", color: "#2563EB", value: "66%", sub: "+12% this quarter" },
    { label: "Lifecycle", color: "#F59E0B", value: "4.2yr", sub: "Avg asset age" },
    { label: "Bookings", color: "#2563EB", value: "18", sub: "Active today" },
    { label: "Maintenance", color: "#F59E0B", value: "7", sub: "Pending requests" },
    { label: "Transfers", color: "#2563EB", value: "3", sub: "In progress" },
    { label: "Analytics", color: "#10B981", value: "Live", sub: "Real-time feed" },
  ];

  return (
    <section id="mission-control" className="py-24 md:py-32 bg-[#F8FAFC]">
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-[#2563EB] text-[13px] font-medium uppercase tracking-[0.15em] mb-4">Mission Control</p>
          <h2 className="text-[36px] md:text-[48px] font-bold text-[#0B1220] tracking-[-0.03em] leading-[1.1] mb-4">
            Your entire operation at a glance.
          </h2>
          <p className="text-[17px] text-[#475569] max-w-[65ch] mx-auto">Real-time KPIs, health monitoring, and operational intelligence in a single dashboard.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <motion.div key={card.label} initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-5 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] transition-shadow cursor-default group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] text-[#64748B] font-medium uppercase tracking-wider">{card.label}</span>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: card.color }} />
              </div>
              <div className="text-[28px] font-bold text-[#0B1220] group-hover:translate-x-0.5 transition-transform">{card.value}</div>
              <div className="text-[13px] text-[#64748B] mt-1">{card.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CoreModules() {
  const reduce = useReducedMotion();
  const modules = [
    { icon: ArrowsLeftRight, title: "Allocation Engine", desc: "Assign, transfer, and track assets with intelligent conflict detection.", color: "#2563EB", span: "md:col-span-1" },
    { icon: CalendarCheck, title: "Booking Intelligence", desc: "Time-slot reservations with real-time availability and overlap prevention.", color: "#10B981", span: "md:col-span-1" },
    { icon: Wrench, title: "Maintenance Workflow", desc: "Request → Approve → Assign → Resolve. Full lifecycle management.", color: "#F59E0B", span: "md:col-span-1" },
    { icon: ChartLine, title: "Analytics & Reports", desc: "Utilization trends, idle detection, heatmaps, and exportable reports.", color: "#2563EB", span: "md:col-span-2" },
    { icon: ShieldCheck, title: "Audit Center", desc: "Cycle management, discrepancy detection, and compliance reporting.", color: "#6366F1", span: "md:col-span-1" },
    { icon: Bell, title: "Notification Engine", desc: "Real-time alerts, approval requests, and system-wide activity logs.", color: "#EC4899", span: "md:col-span-1" },
  ];

  return (
    <section id="modules" className="py-24 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-[#2563EB] text-[13px] font-medium uppercase tracking-[0.15em] mb-4">Core Modules</p>
          <h2 className="text-[36px] md:text-[48px] font-bold text-[#0B1220] tracking-[-0.03em] leading-[1.1] mb-4">
            Everything you need to run your resources.
          </h2>
          <p className="text-[17px] text-[#475569] max-w-[65ch] mx-auto">Six integrated engines that work together seamlessly.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 auto-rows-fr">
          {modules.map((mod, i) => (
            <motion.div key={mod.title} initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className={`${mod.span} bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB] p-6 md:p-8 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-0.5 group`}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${mod.color}12` }}>
                <mod.icon size={20} weight="duotone" style={{ color: mod.color }} />
              </div>
              <h3 className="text-[17px] font-semibold text-[#0B1220] mb-2">{mod.title}</h3>
              <p className="text-[14px] text-[#64748B] leading-relaxed">{mod.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Workflow() {
  const reduce = useReducedMotion();
  const steps = [
    { icon: Monitor, label: "Register", desc: "Add assets with tagging, categorization, and QR codes." },
    { icon: ArrowsLeftRight, label: "Allocate", desc: "Assign to employees with full audit trail." },
    { icon: ArrowsLeftRight, label: "Transfer", desc: "Move assets between departments, locations, or people." },
    { icon: CalendarCheck, label: "Book", desc: "Reserve time-slotted resources like rooms and vehicles." },
    { icon: Wrench, label: "Maintain", desc: "Track repairs, servicing, and preventive maintenance." },
    { icon: ShieldCheck, label: "Audit", desc: "Verify asset existence, condition, and location." },
    { icon: ClockCounterClockwise, label: "Retire", desc: "Decommission assets with full lifecycle documentation." },
  ];

  return (
    <section id="workflow" className="py-24 md:py-32 bg-[#F8FAFC]">
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-[#2563EB] text-[13px] font-medium uppercase tracking-[0.15em] mb-4">Enterprise Workflow</p>
          <h2 className="text-[36px] md:text-[48px] font-bold text-[#0B1220] tracking-[-0.03em] leading-[1.1] mb-4">
            From registration to retirement.
          </h2>
          <p className="text-[17px] text-[#475569] max-w-[65ch] mx-auto">Full lifecycle management for every asset in your organization.</p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.div key={step.label} initial={reduce ? false : { opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-6 group cursor-default"
            >
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center bg-white transition-all group-hover:border-[#2563EB] ${i === steps.length - 1 ? 'border-[#10B981]' : 'border-[#E5E7EB]'}`}>
                  <step.icon size={18} weight="duotone" className={i === steps.length - 1 ? "text-[#10B981]" : "text-[#2563EB]"} />
                </div>
                {i < steps.length - 1 && <div className="w-0.5 h-8 bg-[#E5E7EB] group-hover:bg-[#2563EB]/30 transition-colors" />}
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
  const reduce = useReducedMotion();
  const cards = [
    { icon: Barricade, title: "Idle Asset Detection", desc: "Automatically surface underutilized assets that can be reallocated." },
    { icon: Wrench, title: "Predictive Maintenance", desc: "AI-driven scheduling that prevents downtime before it happens." },
    { icon: ArrowsLeftRight, title: "Smart Allocation", desc: "Intelligent matching of resources to requests based on availability and fit." },
    { icon: Clock, title: "Conflict Resolution", desc: "Real-time detection and resolution of scheduling and allocation conflicts." },
    { icon: Buildings, title: "Department Insights", desc: "Cross-department utilization patterns and optimization recommendations." },
    { icon: ChartLine, title: "Risk Analysis", desc: "Proactive identification of compliance, maintenance, and lifecycle risks." },
  ];

  return (
    <section id="intelligence" className="py-24 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-[#2563EB] text-[13px] font-medium uppercase tracking-[0.15em] mb-4">Intelligence Layer</p>
          <h2 className="text-[36px] md:text-[48px] font-bold text-[#0B1220] tracking-[-0.03em] leading-[1.1] mb-4">
            More than asset tracking.<br />Enterprise decision intelligence.
          </h2>
          <p className="text-[17px] text-[#475569] max-w-[65ch] mx-auto">Our engines don&apos;t just log data — they surface insights, predict problems, and recommend actions.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {cards.map((card, i) => (
            <motion.div key={card.title} initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB] p-6 md:p-8 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${accent}12` }}>
                <card.icon size={20} weight="duotone" style={{ color: accent }} />
              </div>
              <h3 className="text-[17px] font-semibold text-[#0B1220] mb-2">{card.title}</h3>
              <p className="text-[14px] text-[#64748B] leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Analytics() {
  const reduce = useReducedMotion();
  const depts = [
    { label: "Engineering", pct: 85 },
    { label: "Facilities", pct: 60 },
    { label: "HR", pct: 45 },
    { label: "Operations", pct: 92 },
    { label: "IT", pct: 55 },
    { label: "R&D", pct: 78 },
  ];

  return (
    <section className="py-24 md:py-32 bg-[#F8FAFC]">
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-[#2563EB] text-[13px] font-medium uppercase tracking-[0.15em] mb-4">Analytics</p>
          <h2 className="text-[36px] md:text-[48px] font-bold text-[#0B1220] tracking-[-0.03em] leading-[1.1] mb-4">
            Data that drives decisions.
          </h2>
          <p className="text-[17px] text-[#475569] max-w-[65ch] mx-auto">Understand utilization, identify trends, and optimize your entire asset portfolio.</p>
        </motion.div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 md:p-8 max-w-4xl mx-auto">
          <h3 className="text-[15px] font-semibold text-[#0B1220] mb-6">Utilization by Department</h3>
          <div className="space-y-4">
            {depts.map((d, i) => (
              <motion.div key={d.label} initial={reduce ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <div className="flex justify-between text-[14px] mb-1.5">
                  <span className="text-[#0B1220] font-medium">{d.label}</span>
                  <span className="text-[#475569]">{d.pct}%</span>
                </div>
                <div className="h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <motion.div initial={reduce ? false : { width: 0 }} whileInView={{ width: `${d.pct}%` }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full" style={{ backgroundColor: d.pct > 80 ? "#10B981" : d.pct > 60 ? "#2563EB" : "#F59E0B" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Architecture() {
  const reduce = useReducedMotion();
  const layers = [
    { icon: Users, label: "Employees & Departments", color: "#2563EB", sub: "User management, roles, org hierarchy" },
    { icon: Database, label: "Assets & Categories", color: "#10B981", sub: "Full asset catalog with custom categories" },
    { icon: Cloud, label: "Booking Engine", color: "#F59E0B", sub: "Time-slot management, conflict detection" },
    { icon: ArrowsLeftRight, label: "Workflow Engine", color: "#6366F1", sub: "Approval flows, state machines, automation" },
    { icon: Bell, label: "Notification Engine", color: "#EC4899", sub: "Alerts, activity logs, real-time updates" },
    { icon: ChartLine, label: "Analytics Engine", color: "#14B8A6", sub: "Reporting, KPIs, utilization metrics" },
    { icon: Monitor, label: "Dashboard", color: "#0B1220", sub: "Mission Control, visualizations, exports" },
  ];

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-[#2563EB] text-[13px] font-medium uppercase tracking-[0.15em] mb-4">Architecture</p>
          <h2 className="text-[36px] md:text-[48px] font-bold text-[#0B1220] tracking-[-0.03em] leading-[1.1] mb-4">
            Built for the enterprise.
          </h2>
          <p className="text-[17px] text-[#475569] max-w-[65ch] mx-auto">A modular, engine-based architecture that scales with your organization.</p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-0">
          {layers.map((layer, i) => (
            <motion.div key={layer.label} initial={reduce ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-5 p-5 bg-[#F8FAFC] border border-[#E5E7EB] -mt-px first:rounded-t-2xl last:rounded-b-2xl hover:bg-white transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${layer.color}12` }}>
                <layer.icon size={18} weight="duotone" style={{ color: layer.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-semibold text-[#0B1220]">{layer.label}</div>
                <div className="text-[13px] text-[#64748B]">{layer.sub}</div>
              </div>
              <div className="text-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight size={16} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const reduce = useReducedMotion();
  const items = [
    { role: "Asset Manager", quote: "This reduced allocation conflicts dramatically. We finally have real-time visibility into every asset.", dept: "Operations" },
    { role: "Department Head", quote: "We finally know where every resource is. No more double-bookings or misplaced equipment.", dept: "Engineering" },
    { role: "Operations Team", quote: "Audits became effortless. What used to take days now takes minutes.", dept: "Facilities" },
  ];

  return (
    <section className="py-24 md:py-32 bg-[#F8FAFC]">
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-[36px] md:text-[48px] font-bold text-[#0B1220] tracking-[-0.03em] leading-[1.1] mb-4">
            Trusted by operations teams.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {items.map((item, i) => (
            <motion.div key={item.role} initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-6 md:p-8"
            >
              <svg className="w-7 h-7 text-[#2563EB] mb-4" viewBox="0 0 24 24" fill="currentColor" opacity="0.3"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
              <p className="text-[15px] text-[#475569] leading-relaxed mb-6">&ldquo;{item.quote}&rdquo;</p>
              <div>
                <div className="text-[14px] font-semibold text-[#0B1220]">{item.role}</div>
                <div className="text-[13px] text-[#64748B]">{item.dept}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  const reduce = useReducedMotion();
  return (
    <section className="py-24 md:py-32 bg-[#0B1220] text-white overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#2563EB]/[0.05] blur-3xl" />

      <div className="max-w-[1400px] mx-auto px-6 text-center relative z-10">
        <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-[36px] md:text-[48px] font-bold tracking-[-0.03em] leading-[1.1] mb-6">
            Ready to run your organization like a modern enterprise?
          </h2>
          <p className="text-[17px] text-[#94A3B8] max-w-[65ch] mx-auto mb-10">
            Join organizations that have transformed their resource management with AssetFlow.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/login" className="bg-white text-[#0B1220] text-[15px] font-medium px-8 py-3.5 rounded-xl hover:bg-[#F1F5F9] transition-all inline-flex items-center gap-2">
              Explore AssetFlow <ArrowRight size={18} weight="bold" />
            </a>
            <a href="#architecture" className="border border-[#334155] text-white text-[15px] font-medium px-8 py-3.5 rounded-xl hover:bg-[#1E293B] transition-all">
              View Architecture
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-[#E5E7EB] py-12 md:py-16">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#0B1220] flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <span className="text-[#0B1220] text-lg font-bold tracking-tight">AssetFlow</span>
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
              <h4 className="text-[13px] text-[#64748B] font-medium uppercase tracking-wider mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link}><a href="#" className="text-[14px] text-[#0B1220] hover:text-[#2563EB] transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-[#E5E7EB] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[13px] text-[#94A3B8]">&copy; 2026 AssetFlow. All rights reserved.</p>
          <div className="flex gap-6 text-[13px] text-[#94A3B8]">
            <a href="#" className="hover:text-[#0B1220] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#0B1220] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-[#F8FAFC] text-[#0B1220] font-sans">
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
  );
}
