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
    <div className="bg-surface min-h-screen flex items-center justify-center text-body-md text-text-primary p-4 radial-glow">
      <div className="w-full max-w-md bg-surface-container-lowest border-2 border-text-primary/10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 flex flex-col items-center animate-fade-in">
        {/* Card Header matching wireframe "AssetFlow - login" */}
        <h2 className="text-headline-md font-bold text-text-primary mb-6">
          AssetFlow - {isSignup ? "Sign Up" : "login"}
        </h2>

        {/* Circular Logo 'AF' */}
        <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-6 border-2 border-text-primary/20 shadow-inner">
          <span className="text-headline-md font-bold text-primary">AF</span>
        </div>

        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          {isSignup && (
            <div>
              <label className="block text-label-md font-semibold text-text-secondary mb-1" htmlFor="name">
                Name
              </label>
              <input
                className="w-full bg-surface-container-lowest border border-border-subtle rounded-lg text-body-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
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
          <div>
            <label className="block text-label-md font-semibold text-text-secondary mb-1" htmlFor="email">
              Email
            </label>
            <input
              className="w-full bg-surface-container-lowest border border-border-subtle rounded-lg text-body-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              id="email"
              name="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-label-md font-semibold text-text-secondary" htmlFor="password">
                Password
              </label>
            </div>
            <input
              className="w-full bg-surface-container-lowest border border-border-subtle rounded-lg text-body-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              id="password"
              name="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {!isSignup && (
              <div className="text-right mt-1.5">
                <a href="#" className="text-label-md text-primary hover:underline font-medium">
                  Forgot password
                </a>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container text-body-sm p-3 rounded-lg border border-error/20 font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-surface-tint text-on-primary text-label-md uppercase rounded-lg py-3 px-4 transition-colors font-bold shadow-md hover:shadow-lg disabled:opacity-50 mt-2 cursor-pointer"
          >
            {loading ? "Please wait..." : isSignup ? "Create Account" : "Sign In"}
          </button>

          {!isSignup ? (
            <div className="mt-6 pt-6 border-t border-border-subtle w-full flex flex-col items-center text-center">
              <span className="text-label-md text-text-secondary mb-2 block font-semibold">New here?</span>
              <div className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-3 text-body-sm text-text-secondary mb-4 leading-relaxed">
                Sign up creates an employee account admin roles assigned later
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsSignup(true);
                  setError("");
                }}
                className="w-full border-2 border-primary text-primary hover:bg-primary/5 text-label-md uppercase font-bold rounded-lg py-2.5 px-4 transition-all cursor-pointer"
              >
                Create Account
              </button>
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t border-border-subtle text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignup(false);
                  setError("");
                }}
                className="text-label-md text-primary hover:underline font-semibold"
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
