"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import Modal from "@/components/Modal";
import { useToast } from "@/components/ToastProvider";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { showToast } = useToast();
  const { login, signup } = useAuth();

  const [email, setEmail] = useState("admin@assetflow.com");
  const [password, setPassword] = useState("password123");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please enter email and password", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      await login(email, password);
      showToast("Signed in successfully!", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Login failed", "error");
    } finally {
      setIsSubmitting(false);
    }
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupForm.name || !signupForm.email || !signupForm.password) {
      showToast("Please fill in all required fields", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      await signup({ email: signupForm.email, password: signupForm.password, name: signupForm.name });
      showToast(`Account created for ${signupForm.name}! Welcome aboard.`, "success");
      setIsSignupModalOpen(false);
      // Auto-login after signup
      await login(signupForm.email, signupForm.password);
      showToast("Signed in successfully!", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Signup failed", "error");
    } finally {
      setIsSubmitting(false);
    }
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
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-surface-tint text-on-primary text-label-md uppercase rounded py-2.5 px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 text-center font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
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
            <label className="block text-label-md mb-1" htmlFor="signup-password">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              placeholder="Min. 6 characters"
              value={signupForm.password}
              onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
              className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-body-md focus:border-primary outline-none"
            />
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
              disabled={isSubmitting}
              className="px-4 py-2 rounded text-label-md bg-primary text-on-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating Account..." : "Complete Registration"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
