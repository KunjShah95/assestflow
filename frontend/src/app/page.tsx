"use client";

import Link from "next/link";

export default function LoginPage() {
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
        <form className="w-full flex flex-col gap-standard" onSubmit={(e) => e.preventDefault()}>
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
              defaultValue="name@company.com"
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
              defaultValue="**********"
            />
            <div className="flex justify-end mt-1">
              <a
                className="text-label-md text-text-secondary hover:text-primary transition-colors cursor-pointer"
                href="#"
              >
                Forgot password
              </a>
            </div>
          </div>

          {/* Login Button */}
          <Link
            href="/dashboard"
            className="w-full bg-primary hover:bg-surface-tint text-on-primary text-label-md uppercase rounded py-2.5 px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 text-center font-medium"
          >
            Sign In
          </Link>

          {/* Divider & Sign Up */}
          <div className="mt-4 pt-4 border-t border-border-subtle">
            <p className="text-label-md text-text-primary mb-2">New here?</p>
            <div className="bg-surface-container-low p-3 rounded border border-border-subtle mb-4">
              <p className="text-body-sm text-text-secondary">
                Sign up creates an employee account — admin roles assigned later
              </p>
            </div>
            <button
              className="w-full bg-primary hover:bg-surface-tint text-on-primary text-label-md uppercase rounded py-2 px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
              type="button"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
