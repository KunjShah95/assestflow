"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { setToken } from "@/lib/api-client";

export default function LoginPage() {
  const router = useRouter();
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
    try {
      if (isSignup) {
        await authService.signup({ email, password, name });
        setIsSignup(false);
        setError("Account created. Login after admin promotes you.");
      } else {
        const res = await authService.login(email, password);
        setToken(res.token);
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-surface min-h-screen flex items-center justify-center text-body-md text-text-primary p-4">
      <div className="w-full max-w-md bg-surface-container-lowest border border-border-subtle rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-container flex flex-col items-center animate-fade-in">
        <div className="mb-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-4 border border-border-subtle">
            <span className="text-headline-md text-text-primary">AF</span>
          </div>
          <h1 className="text-headline-lg font-black text-primary">AssetFlow</h1>
        </div>

        <form className="w-full flex flex-col gap-standard" onSubmit={handleSubmit}>
          {isSignup && (
            <div>
              <label className="block text-label-md text-text-primary mb-1" htmlFor="name">Name</label>
              <input className="w-full bg-surface-container-lowest border border-border-subtle rounded text-body-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow" id="name" name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          <div>
            <label className="block text-label-md text-text-primary mb-1" htmlFor="email">Email</label>
            <input className="w-full bg-surface-container-lowest border border-border-subtle rounded text-body-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow" id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-label-md text-text-primary mb-1" htmlFor="password">Password</label>
            <input className="w-full bg-surface-container-lowest border border-border-subtle rounded text-body-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow" id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <div className="bg-error-container text-on-error-container text-body-sm p-3 rounded">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-surface-tint text-on-primary text-label-md uppercase rounded py-2.5 px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 text-center font-medium disabled:opacity-50">
            {loading ? "Please wait..." : isSignup ? "Create Account" : "Sign In"}
          </button>
          <div className="mt-4 pt-4 border-t border-border-subtle text-center">
            <button type="button" onClick={() => { setIsSignup(!isSignup); setError(""); }} className="text-label-md text-primary hover:underline">
              {isSignup ? "Already have an account? Sign In" : "New here? Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
