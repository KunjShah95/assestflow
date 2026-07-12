"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useApiError } from "@/hooks/useApiError";

export default function LoginPage() {
  const { handleError, handleSuccess, handleInfo } = useApiError();
  const { login, signup } = useAuth();

  const [email, setEmail] = useState("admin@assetflow.com");
  const [password, setPassword] = useState("password123");
  const [name, setName] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    handleInfo("Authenticating...");

    try {
      if (isSignup) {
        await signup({ email, password, name });
        setIsSignup(false);
        setError("Account created. Login after admin promotes you.");
      } else {
        await login(email, password);
        handleSuccess("Signed in successfully!");
      }
    } catch (err: unknown) {
      const message = handleError(err, isSignup ? "Signup failed" : "Login failed");
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-[16px] shadow-sm p-8 flex flex-col items-center animate-fade-in">

        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 border border-[#E2E8F0] shadow-sm">
          <span className="text-[18px] font-bold text-[#0F172A]">AF</span>
        </div>

        <h2 className="text-[24px] font-bold text-[#0052CC] mb-8">
          AssetFlow
        </h2>

        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          {isSignup && (
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-bold text-[#475569]" htmlFor="name">
                Name
              </label>
              <input
                className="w-full bg-white border border-[#CBD5E1] rounded-[6px] px-3 py-2 text-[14px] text-[#0F172A] focus:outline-none focus:border-[#0052CC] transition-colors"
                id="name"
                name="name"
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-bold text-[#475569]" htmlFor="email">
              Email
            </label>
            <input
              className="w-full bg-white border border-[#CBD5E1] rounded-[6px] px-3 py-2 text-[14px] text-[#0F172A] focus:outline-none focus:border-[#0052CC] transition-colors"
              id="email"
              name="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-bold text-[#475569]" htmlFor="password">
              Password
            </label>
            <input
              className="w-full bg-white border border-[#CBD5E1] rounded-[6px] px-3 py-2 text-[14px] text-[#0F172A] focus:outline-none focus:border-[#0052CC] tracking-[0.2em] transition-colors"
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {!isSignup && (
               <div className="text-right mt-0.5">
                 <a href="#" className="text-[12px] text-[#64748B] hover:text-[#0052CC] font-semibold transition-colors">
                   Forgot password
                 </a>
               </div>
            )}
          </div>

          {error && (
            <div className="bg-[#FEF2F2] text-[#DC2626] text-[13px] p-3 rounded-[6px] border border-[#FCA5A5] font-medium mt-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0052CC] hover:bg-[#0047B3] text-white text-[13px] uppercase tracking-wide rounded-[6px] py-3 mt-1 transition-colors font-bold shadow-sm disabled:opacity-70 cursor-pointer"
          >
            {loading ? "Please wait..." : isSignup ? "CREATE ACCOUNT" : "SIGN IN"}
          </button>

          {!isSignup ? (
            <div className="mt-4 pt-4 border-t border-[#E2E8F0] w-full flex flex-col text-left">
              <span className="text-[13px] text-[#0F172A] mb-2 font-bold">New here?</span>
              <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[6px] px-3 py-2.5 text-[13px] text-[#475569] mb-4">
                Sign up creates an employee account — admin roles assigned later
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsSignup(true);
                  setError("");
                }}
                className="w-full bg-[#0052CC] hover:bg-[#0047B3] text-white text-[13px] uppercase tracking-wide rounded-[6px] py-3 transition-colors font-bold shadow-sm cursor-pointer"
              >
                CREATE ACCOUNT
              </button>
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t border-[#E2E8F0] text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignup(false);
                  setError("");
                }}
                className="text-[13px] text-[#0052CC] hover:underline font-bold cursor-pointer"
              >
                Already have an account? Sign In
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
