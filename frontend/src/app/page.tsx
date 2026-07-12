"use client";

<<<<<<< HEAD
import React, { useState } from "react";
=======
import { useEffect } from "react";
>>>>>>> 0c3e4cf95e6e6e4335d56146084439ad368addef
import Link from "next/link";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import { useToast } from "@/components/ToastProvider";

<<<<<<< HEAD
export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [email, setEmail] = useState("name@company.com");
  const [password, setPassword] = useState("**********");
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    department: "Engineering",
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Signing in to AssetFlow Enterprise...", "info");
    router.push("/dashboard");
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      showToast("Please enter your email address", "error");
      return;
    }
    showToast(`Password reset link sent to ${resetEmail}`, "success");
    setIsForgotModalOpen(false);
    setResetEmail("");
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupForm.name || !signupForm.email) {
      showToast("Please fill in all required fields", "error");
      return;
    }
    showToast(`Account created for ${signupForm.name}! Welcome aboard.`, "success");
    setIsSignupModalOpen(false);
    router.push("/dashboard");
  };

  return (
    <div className="bg-surface min-h-screen flex items-center justify-center text-body-md text-text-primary p-4">
      <div className="w-full max-w-md bg-surface-container-lowest border border-border-subtle rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-container flex flex-col items-center animate-fade-in">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-4 border border-border-subtle">
            <span className="text-headline-md text-text-primary">AF</span>
          </div>
          <h1 className="text-headline-lg font-black text-primary">AssetFlow</h1>
        </div>

        {/* Form */}
        <form className="w-full flex flex-col gap-standard" onSubmit={handleLogin}>
          {/* Email */}
          <div>
            <label
              className="block text-label-md text-text-primary mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full bg-surface-container-lowest border border-border-subtle rounded text-body-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow"
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-label-md text-text-primary mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full bg-surface-container-lowest border border-border-subtle rounded text-body-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow"
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-end mt-1">
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-label-md text-text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                Forgot password
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-primary hover:bg-surface-tint text-on-primary text-label-md uppercase rounded py-2.5 px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 text-center font-medium shadow-sm"
          >
            Sign In
          </button>

          {/* Divider & Sign Up */}
          <div className="mt-4 pt-4 border-t border-border-subtle">
            <p className="text-label-md text-text-primary mb-2">New here?</p>
            <div className="bg-surface-container-low p-3 rounded border border-border-subtle mb-4">
              <p className="text-body-sm text-text-secondary">
                Sign up creates an employee account — admin roles assigned later
              </p>
            </div>
            <button
              onClick={() => setIsSignupModalOpen(true)}
              className="w-full bg-primary hover:bg-surface-tint text-on-primary text-label-md uppercase rounded py-2 px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
              type="button"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Reset Account Password"
      >
        <form onSubmit={handleResetPassword} className="space-y-4">
          <p className="text-body-sm text-text-secondary">
            Enter your company email address below. We will send a secure password reset link to your inbox.
          </p>
          <div>
            <label className="block text-label-md mb-1" htmlFor="reset-email">
              Company Email
            </label>
            <input
              id="reset-email"
              type="email"
              placeholder="employee@company.com"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md focus:border-primary outline-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(false)}
              className="px-4 py-2 rounded text-label-md border border-border-subtle hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded text-label-md bg-primary text-on-primary hover:bg-primary/90"
            >
              Send Reset Link
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Account Modal */}
      <Modal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        title="Employee Account Registration"
      >
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-label-md mb-1" htmlFor="signup-name">
              Full Name
            </label>
            <input
              id="signup-name"
              type="text"
              placeholder="e.g. Priya Shah"
              value={signupForm.name}
              onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
              className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-label-md mb-1" htmlFor="signup-email">
              Corporate Email
            </label>
            <input
              id="signup-email"
              type="email"
              placeholder="priya.shah@company.com"
              value={signupForm.email}
              onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
              className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-label-md mb-1" htmlFor="signup-dept">
              Department
            </label>
            <select
              id="signup-dept"
              value={signupForm.department}
              onChange={(e) => setSignupForm({ ...signupForm, department: e.target.value })}
              className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md focus:border-primary outline-none"
            >
              <option value="Engineering">Engineering</option>
              <option value="Facilities">Facilities</option>
              <option value="Field Ops">Field Ops</option>
              <option value="HR">Human Resources</option>
              <option value="IT">IT Infrastructure</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsSignupModalOpen(false)}
              className="px-4 py-2 rounded text-label-md border border-border-subtle hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded text-label-md bg-primary text-on-primary hover:bg-primary/90"
            >
              Complete Registration
            </button>
          </div>
        </form>
      </Modal>
=======
export default function Home() {
  useEffect(() => {
    // Simple Intersection Observer for scroll animations
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

    const revealElements = document.querySelectorAll(".animate-reveal");
    revealElements.forEach((el) => observer.observe(el));

    // Micro-interaction for the timeline
    const steps = document.querySelectorAll(".timeline-step");
    const handleMouseEnter = (e: Event) => {
      const step = e.currentTarget as HTMLElement;
      const icon = step.querySelector(".material-symbols-outlined") as HTMLElement;
      if (icon) {
        icon.style.fontVariationSettings = "'FILL' 1";
      }
    };
    const handleMouseLeave = (e: Event) => {
      const step = e.currentTarget as HTMLElement;
      const icon = step.querySelector(".material-symbols-outlined") as HTMLElement;
      if (icon) {
        icon.style.fontVariationSettings = "'FILL' 0";
      }
    };

    steps.forEach((step) => {
      step.addEventListener("mouseenter", handleMouseEnter);
      step.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      observer.disconnect();
      steps.forEach((step) => {
        step.removeEventListener("mouseenter", handleMouseEnter);
        step.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return (
    <div className="bg-surface text-text-primary font-body-md overflow-x-hidden min-h-screen">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="max-w-container-max mx-auto px-margin-desktop flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link className="text-headline-card font-headline-card font-bold text-text-primary" href="/">
              AssetFlow
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link className="text-primary font-semibold font-body-md hover:text-primary transition-colors duration-200" href="#">
                Product
              </Link>
              <Link className="text-text-secondary font-body-md hover:text-primary transition-colors duration-200" href="#">
                Solutions
              </Link>
              <Link className="text-text-secondary font-body-md hover:text-primary transition-colors duration-200" href="#">
                Developers
              </Link>
              <Link className="text-text-secondary font-body-md hover:text-primary transition-colors duration-200" href="#">
                Pricing
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block text-text-secondary font-button text-button px-4 py-2 hover:text-primary transition-colors">
              Log In
            </Link>
            <button className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-button text-button hover:bg-accent-hover transition-all shadow-sm">
              Book Demo
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-section-padding grid-pattern overflow-hidden">
        <div className="absolute inset-0 radial-glow pointer-events-none"></div>
        <div className="max-w-container-max mx-auto px-margin-desktop text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary font-label-sm text-label-sm mb-8 animate-reveal active">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Now optimizing $4B+ in enterprise assets
          </div>
          <h1 className="font-display-hero text-display-hero max-w-4xl mx-auto mb-6 animate-reveal active">
            The Operating System for Enterprise Resources
          </h1>
          <p className="font-subheading-hero text-subheading-hero text-text-secondary max-w-2xl mx-auto mb-10 animate-reveal active transition-delay-100">
            Unify asset intelligence across global operations. AssetFlow provides a single source of truth for every machine, license, and capital asset.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-reveal active transition-delay-200">
            <button className="w-full sm:w-auto bg-text-primary text-white px-8 py-4 rounded-full font-button text-button hover:bg-black transition-all">
              Start Your Implementation
            </button>
            <button className="w-full sm:w-auto bg-white border border-border text-text-primary px-8 py-4 rounded-full font-button text-button hover:border-text-primary transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">play_circle</span>
              Watch System Overview
            </button>
          </div>
          <div className="relative max-w-5xl mx-auto animate-reveal active transition-delay-400">
            <div className="rounded-2xl border border-border shadow-2xl bg-white overflow-hidden p-2">
              <img
                className="w-full h-auto rounded-xl"
                alt="A clean, minimalist enterprise software dashboard with white backgrounds and deep blue accents. It shows high-level resource metrics including global asset health, utilization percentages, and a sleek map interface for tracking moving assets. The UI is professional, with thin dividers and precise sans-serif typography, mimicking a high-end SaaS application."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGfLY6jJh5JEjs8bztg96N-Sz5S0z3k7qrJDq29qDRjXebqo_2Yi1PlashB97ayNF0AtGh-0kJE5Bjmsu9KaalspuiV-FCQF64UByySH2N055BX8MtdhFpugk5QituEljF-XOvv6fzdtdAPFmF2jlR4RMGiXOvp8pNDSSy_Xy3lpRhyGdOOZJEeQ-9yqEGZuHY2urdJrqfQrgwPjvKX453MGAbunqZKDypYUPLloNR0MxQweYyUtqdZ4WjGRH6zyWxCecOAP5CoTG6"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden lg:block w-64 p-4 bg-white border border-border shadow-xl rounded-xl text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-label-sm font-label-sm text-text-muted uppercase">Real-time Drift</span>
                <span className="text-success text-label-sm font-bold">0.02%</span>
              </div>
              <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
                <div className="h-full bg-success w-[98%]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-12 border-y border-border bg-white">
        <div className="max-w-container-max mx-auto px-margin-desktop">
          <p className="text-center text-text-muted font-label-sm text-label-sm uppercase tracking-widest mb-8">
            Infrastructure powered by AssetFlow
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="font-bold text-2xl text-text-primary">VERTEX</span>
            <span className="font-bold text-2xl text-text-primary">SYNAPSE</span>
            <span className="font-bold text-2xl text-text-primary">CORE-X</span>
            <span className="font-bold text-2xl text-text-primary">ORBITAL</span>
            <span className="font-bold text-2xl text-text-primary">LUMINA</span>
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="py-section-padding bg-surface">
        <div className="max-w-container-max mx-auto px-margin-desktop">
          <div className="grid lg:grid-cols-2 gap-gutter items-center">
            <div className="animate-reveal">
              <h2 className="font-headline-section text-headline-section mb-6">Stop managing assets with ghosts and guesses.</h2>
              <p className="text-body-lg font-body-lg text-text-secondary mb-10">
                Legacy ERPs weren&apos;t built for the velocity of modern enterprise. Data fragmentation leads to multi-million dollar leakages annually.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4 items-start text-left">
                  <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-error/10 text-error">
                    <span className="material-symbols-outlined">warning</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary">Information Silos</h4>
                    <p className="text-text-secondary">Procurement, operations, and IT speak different languages, creating conflict.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start text-left">
                  <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">bolt</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary">AssetFlow Intelligence</h4>
                    <p className="text-text-secondary">A unified protocol that synchronizes every state change across the stack instantly.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative animate-reveal text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-border shadow-sm mt-12">
                  <span className="text-3xl font-bold text-error mb-2 block">12%</span>
                  <p className="text-label-sm font-label-sm text-text-muted">Ghost Asset Rate in Legacy Systems</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                  <span className="text-3xl font-bold text-success mb-2 block">&lt;0.01%</span>
                  <p className="text-label-sm font-label-sm text-text-muted">Variance with AssetFlow</p>
                </div>
                <div className="col-span-2 bg-primary p-8 rounded-2xl text-white shadow-xl">
                  <h3 className="text-headline-card font-headline-card mb-4">The Result?</h3>
                  <p className="opacity-90 mb-6">One aerospace client recovered $14.2M in &quot;lost&quot; tooling within 90 days of implementation.</p>
                  <Link className="text-white font-bold inline-flex items-center gap-2 group" href="#">
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
      <section className="py-section-padding bg-text-primary text-white overflow-hidden relative">
        <div className="max-w-container-max mx-auto px-margin-desktop relative z-10 text-left">
          <div className="mb-16">
            <span className="text-primary font-bold tracking-widest uppercase text-label-sm">Command Center</span>
            <h2 className="font-headline-section text-headline-section mt-4 mb-4">Total Resource Visibility</h2>
            <p className="text-text-muted text-body-lg max-w-2xl">
              A purpose-built interface for executive decision making. Know exactly what requires your attention and what assets are at risk before they fail.
            </p>
          </div>
          <div className="grid lg:grid-cols-4 gap-8 mb-12">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <p className="text-text-muted text-label-sm mb-2">Requires Attention</p>
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold">14</span>
                <span className="px-2 py-1 bg-warning/20 text-warning text-xs rounded">Priority</span>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <p className="text-text-muted text-label-sm mb-2">At Critical Risk</p>
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold">03</span>
                <span className="px-2 py-1 bg-error/20 text-error text-xs rounded">Critical</span>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <p className="text-text-muted text-label-sm mb-2">Efficiency Rating</p>
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold">94%</span>
                <span className="px-2 py-1 bg-success/20 text-success text-xs rounded">+2.4%</span>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <p className="text-text-muted text-label-sm mb-2">Active Transfers</p>
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold">1,029</span>
                <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded">Live</span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black shadow-2xl overflow-hidden p-1">
            <img
              className="w-full h-auto opacity-90 rounded-xl"
              alt="A dark-themed, high-resolution analytics dashboard. It features intricate charts and global maps with data points representing asset locations. The interface is high-contrast black and deep navy blue with vibrant neon blue and cyan accents for data highlights. Small icons indicate 'at risk' statuses and 'efficiency' scores in a sophisticated, enterprise-grade UI."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8Yqf_B7QXhuHOrYU8-aSzgYsDNzLqxtopT7vvA44mZ7vasybUePZ2R6MTXKct00mbKVz3xhjrmP87nKvJX8N34O7fiAlyzdcIMiQAUDKVSY3-n0HwC6dqu0uO471PAle0An0ziWtSsAOWQNLCnZuTozomVSfZm_BW8QnT2SbJlPb8NaYlZuZ4NyWHKS_yAXy3lzlI6_EKeeenXSvCQUW99FFDe6_n01Bk6n52phrQM5YZQ143hxXlJMGFMkYsT1Es_0nr4a43b8G8"
            />
          </div>
        </div>
      </section>

      {/* Core Modules */}
      <section className="py-section-padding bg-surface">
        <div className="max-w-container-max mx-auto px-margin-desktop">
          <div className="text-center mb-20">
            <h2 className="font-headline-section text-headline-section mb-6">Designed for operational precision.</h2>
            <p className="text-text-secondary text-body-lg max-w-2xl mx-auto">
              AssetFlow modular architecture allows you to deploy exactly the intelligence your enterprise needs.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-gutter text-left">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-[20px] border border-border shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="w-14 h-14 bg-surface rounded-xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
                <span className="material-symbols-outlined text-primary group-hover:text-white" style={{ fontSize: "32px" }}>
                  verified_user
                </span>
              </div>
              <h3 className="font-headline-card text-headline-card mb-3">Prevent Allocation Conflicts</h3>
              <p className="text-text-secondary mb-8">Ensure every asset has a single verified owner across the entire global directory.</p>
              <div className="pt-6 border-t border-divider">
                <span className="text-primary font-bold text-2xl">0%</span>
                <span className="text-text-muted text-label-sm ml-2">Conflict Rate</span>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-white p-8 rounded-[20px] border border-border shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="w-14 h-14 bg-surface rounded-xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
                <span className="material-symbols-outlined text-primary group-hover:text-white" style={{ fontSize: "32px" }}>
                  precision_manufacturing
                </span>
              </div>
              <h3 className="font-headline-card text-headline-card mb-3">Predictive Maintenance</h3>
              <p className="text-text-secondary mb-8">Leverage machine learning to identify failing components before they halt production lines.</p>
              <div className="pt-6 border-t border-divider">
                <span className="text-primary font-bold text-2xl">30%</span>
                <span className="text-text-muted text-label-sm ml-2">Uptime Increase</span>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-white p-8 rounded-[20px] border border-border shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="w-14 h-14 bg-surface rounded-xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
                <span className="material-symbols-outlined text-primary group-hover:text-white" style={{ fontSize: "32px" }}>
                  receipt_long
                </span>
              </div>
              <h3 className="font-headline-card text-headline-card mb-3">Automated Compliance</h3>
              <p className="text-text-secondary mb-8">Generate audit-ready reports for ISO and SOC2 compliance with a single click.</p>
              <div className="pt-6 border-t border-divider">
                <span className="text-primary font-bold text-2xl">1,200h</span>
                <span className="text-text-muted text-label-sm ml-2">Saved / Year</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Timeline */}
      <section className="py-section-padding bg-white border-y border-border">
        <div className="max-w-container-max mx-auto px-margin-desktop">
          <h2 className="font-headline-section text-headline-section text-center mb-20">The Unified Asset Lifecycle</h2>
          <div className="relative">
            {/* Horizontal Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 hidden md:block"></div>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-8 relative">
              {/* Step 1 */}
              <div className="timeline-step flex flex-col items-center text-center group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-primary flex items-center justify-center z-10 mb-4 transition-all group-hover:scale-110">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: "18px" }}>
                    add_box
                  </span>
                </div>
                <h4 className="font-bold text-text-primary text-sm mb-2">Register</h4>
                <p className="text-xs text-text-muted px-2">Instant onboarding via IoT or Batch</p>
              </div>
              {/* Step 2 */}
              <div className="timeline-step flex flex-col items-center text-center group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-border flex items-center justify-center z-10 mb-4 transition-all group-hover:border-primary group-hover:scale-110">
                  <span className="material-symbols-outlined text-text-muted group-hover:text-primary" style={{ fontSize: "18px" }}>
                    assignment_ind
                  </span>
                </div>
                <h4 className="font-bold text-text-primary text-sm mb-2">Allocate</h4>
                <p className="text-xs text-text-muted px-2">Owner assignment with proof-of-custody</p>
              </div>
              {/* Step 3 */}
              <div className="timeline-step flex flex-col items-center text-center group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-border flex items-center justify-center z-10 mb-4 transition-all group-hover:border-primary group-hover:scale-110">
                  <span className="material-symbols-outlined text-text-muted group-hover:text-primary" style={{ fontSize: "18px" }}>
                    move_down
                  </span>
                </div>
                <h4 className="font-bold text-text-primary text-sm mb-2">Transfer</h4>
                <p className="text-xs text-text-muted px-2">Chain-of-custody logging</p>
              </div>
              {/* Step 4 */}
              <div className="timeline-step flex flex-col items-center text-center group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-border flex items-center justify-center z-10 mb-4 transition-all group-hover:border-primary group-hover:scale-110">
                  <span className="material-symbols-outlined text-text-muted group-hover:text-primary" style={{ fontSize: "18px" }}>
                    event_available
                  </span>
                </div>
                <h4 className="font-bold text-text-primary text-sm mb-2">Book</h4>
                <p className="text-xs text-text-muted px-2">Reservation and scheduling logic</p>
              </div>
              {/* Step 5 */}
              <div className="timeline-step flex flex-col items-center text-center group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-border flex items-center justify-center z-10 mb-4 transition-all group-hover:border-primary group-hover:scale-110">
                  <span className="material-symbols-outlined text-text-muted group-hover:text-primary" style={{ fontSize: "18px" }}>
                    build
                  </span>
                </div>
                <h4 className="font-bold text-text-primary text-sm mb-2">Maintain</h4>
                <p className="text-xs text-text-muted px-2">ML-driven service workflows</p>
              </div>
              {/* Step 6 */}
              <div className="timeline-step flex flex-col items-center text-center group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-border flex items-center justify-center z-10 mb-4 transition-all group-hover:border-primary group-hover:scale-110">
                  <span className="material-symbols-outlined text-text-muted group-hover:text-primary" style={{ fontSize: "18px" }}>
                    fact_check
                  </span>
                </div>
                <h4 className="font-bold text-text-primary text-sm mb-2">Audit</h4>
                <p className="text-xs text-text-muted px-2">Automated verification cycles</p>
              </div>
              {/* Step 7 */}
              <div className="timeline-step flex flex-col items-center text-center group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-border flex items-center justify-center z-10 mb-4 transition-all group-hover:border-primary group-hover:scale-110">
                  <span className="material-symbols-outlined text-text-muted group-hover:text-primary" style={{ fontSize: "18px" }}>
                    inventory
                  </span>
                </div>
                <h4 className="font-bold text-text-primary text-sm mb-2">Retain</h4>
                <p className="text-xs text-text-muted px-2">Depreciation and disposal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics & Security */}
      <section className="py-section-padding bg-surface overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-desktop">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative text-left">
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="bg-white border border-border p-8 rounded-2xl shadow-xl relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-text-primary">Capital Utilization (Annual)</h3>
                  <span className="material-symbols-outlined text-text-muted">more_horiz</span>
                </div>
                {/* Mock Area Chart */}
                <div className="h-48 flex items-end gap-1 mb-4">
                  <div className="flex-1 bg-primary/10 rounded-t-sm h-[30%]"></div>
                  <div className="flex-1 bg-primary/20 rounded-t-sm h-[45%]"></div>
                  <div className="flex-1 bg-primary/30 rounded-t-sm h-[40%]"></div>
                  <div className="flex-1 bg-primary/40 rounded-t-sm h-[60%]"></div>
                  <div className="flex-1 bg-primary/50 rounded-t-sm h-[55%]"></div>
                  <div className="flex-1 bg-primary/60 rounded-t-sm h-[80%]"></div>
                  <div className="flex-1 bg-primary/70 rounded-t-sm h-[75%]"></div>
                  <div className="flex-1 bg-primary/80 rounded-t-sm h-[95%]"></div>
                  <div className="flex-1 bg-primary rounded-t-sm h-[90%]"></div>
                </div>
                <div className="flex justify-between text-xs text-text-muted uppercase tracking-tighter">
                  <span>Q1</span>
                  <span>Q2</span>
                  <span>Q3</span>
                  <span>Q4</span>
                </div>
              </div>
              <div className="mt-8 bg-text-primary text-white p-8 rounded-2xl shadow-xl ml-12 relative z-20">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-success">security</span>
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
              <h2 className="font-headline-section text-headline-section mb-6">Built for scale, secured by design.</h2>
              <p className="text-body-lg text-text-secondary mb-10">
                AssetFlow is designed to handle millions of records per second with 99.99% uptime. Our architecture ensures that your resource data is never at risk.
              </p>
              <ul className="space-y-6">
                <li className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-success">check_circle</span>
                  <span className="font-body-md">Military-grade data encryption at rest and in transit</span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-success">check_circle</span>
                  <span className="font-body-md">Granular RBAC (Role-Based Access Control)</span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-success">check_circle</span>
                  <span className="font-body-md">Real-time immutable audit logs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials & CTA */}
      <section className="py-section-padding bg-white relative">
        <div className="max-w-container-max mx-auto px-margin-desktop text-center">
          <div className="mb-20">
            <div className="flex justify-center gap-1 mb-6 text-warning">
              <span className="material-symbols-outlined filled">star</span>
              <span className="material-symbols-outlined filled">star</span>
              <span className="material-symbols-outlined filled">star</span>
              <span className="material-symbols-outlined filled">star</span>
              <span className="material-symbols-outlined filled">star</span>
            </div>
            <blockquote className="text-headline-section text-headline-section max-w-4xl mx-auto mb-8 font-medium leading-tight">
              &quot;AssetFlow is the first tool that actually bridges the gap between our physical reality and our digital ledger. It&apos;s transformed how we manage capital.&quot;
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-surface">
                <img
                  className="w-full h-full object-cover"
                  alt="A professional headshot of a middle-aged female executive with a confident smile, wearing a dark navy blazer. The lighting is soft and corporate, set against a clean, out-of-focus modern office background. The overall tone is professional, trustworthy, and high-status, matching a Chief Operations Officer persona."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCROH1xTUcvOrPIL6FQQXrUK8wJe9XygKVbKrv8zpRJcwFIAm48sR6i6JOEL3QI7KlXhyfDT4EkhA0m3eBciQWE4jSWvdL5yFelZRMA1qZ-9J6sycg1wE9p-BcvlRzhMyX_VkMXezT_qtIYNCDnfHA3U-QCG39S1f27uAcDHBHgK4gMl6pXZdKaX2z698TKvVM11xCAOL4tSJ3hxPC0FPBm4_Kc8NRefpA3-scF1iqDDGzusiBv9TC8Pf2gmg566ItaIWkfF3mtDy6E"
                />
              </div>
              <div className="text-left">
                <p className="font-bold text-text-primary">Sarah Jenkins</p>
                <p className="text-text-muted text-label-sm">COO, Vertex Global</p>
              </div>
            </div>
          </div>
          <div className="bg-primary rounded-[32px] p-12 md:p-20 text-white relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-headline-section text-headline-section mb-6">Ready to optimize your enterprise?</h2>
              <p className="text-xl opacity-90 mb-10">Join 400+ world-class organizations using AssetFlow to achieve resource intelligence.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="bg-white text-primary px-10 py-5 rounded-full font-bold text-button shadow-xl hover:scale-105 transition-transform">
                  Book Strategy Demo
                </button>
                <button className="text-white border border-white/30 px-10 py-5 rounded-full font-bold text-button hover:bg-white/10 transition-all">
                  Download OS Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface border-t border-border">
        <div className="max-w-container-max mx-auto px-margin-desktop py-section-padding text-left">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-gutter">
            <div className="col-span-2 lg:col-span-1">
              <Link className="text-headline-card font-headline-card font-bold text-text-primary mb-6 block" href="/">
                AssetFlow
              </Link>
              <p className="text-text-muted text-sm mb-6 max-w-xs">Operating System for Enterprise Resources. Intelligence at every node.</p>
              <div className="flex gap-4">
                <Link className="text-text-muted hover:text-primary transition-colors" href="#">
                  <span className="material-symbols-outlined">public</span>
                </Link>
                <Link className="text-text-muted hover:text-primary transition-colors" href="#">
                  <span className="material-symbols-outlined">alternate_email</span>
                </Link>
              </div>
            </div>
            <div>
              <h5 className="font-bold text-text-primary mb-6">Product</h5>
              <ul className="space-y-4">
                <li>
                  <Link className="text-text-muted hover:text-primary transition-all" href="#">
                    Command Center
                  </Link>
                </li>
                <li>
                  <Link className="text-text-muted hover:text-primary transition-all" href="#">
                    Core Intelligence
                  </Link>
                </li>
                <li>
                  <Link className="text-text-muted hover:text-primary transition-all" href="#">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link className="text-text-muted hover:text-primary transition-all" href="#">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-text-primary mb-6">Company</h5>
              <ul className="space-y-4">
                <li>
                  <Link className="text-text-muted hover:text-primary transition-all" href="#">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link className="text-text-muted hover:text-primary transition-all" href="#">
                    Our Mission
                  </Link>
                </li>
                <li>
                  <Link className="text-text-muted hover:text-primary transition-all" href="#">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link className="text-text-muted hover:text-primary transition-all" href="#">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-text-primary mb-6">Resources</h5>
              <ul className="space-y-4">
                <li>
                  <Link className="text-text-muted hover:text-primary transition-all" href="#">
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link className="text-text-muted hover:text-primary transition-all" href="#">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link className="text-text-muted hover:text-primary transition-all" href="#">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link className="text-text-muted hover:text-primary transition-all" href="#">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-text-primary mb-6">Legal</h5>
              <ul className="space-y-4">
                <li>
                  <Link className="text-text-muted hover:text-primary transition-all" href="#">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link className="text-text-muted hover:text-primary transition-all" href="#">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link className="text-text-muted hover:text-primary transition-all" href="#">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-section-padding pt-8 border-t border-divider flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-text-muted text-sm">© 2024 AssetFlow OS. Enterprise Resource Intelligence.</p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-xs text-success">
                <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                All Systems Operational
              </span>
              <span className="text-text-muted text-xs">v4.1.2-alpha</span>
            </div>
          </div>
        </div>
      </footer>
>>>>>>> 0c3e4cf95e6e6e4335d56146084439ad368addef
    </div>
  );
}
