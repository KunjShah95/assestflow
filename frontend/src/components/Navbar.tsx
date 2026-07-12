"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const guestLinks = [
    { label: "Product", href: "/product" },
    { label: "Solutions", href: "/solutions" },
    { label: "Developers", href: "/developers" },
    { label: "Pricing", href: "/pricing" },
  ];

  const authLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Org Setup", href: "/organization-setup" },
    { label: "Assets", href: "/assets" },
    { label: "Allocation", href: "/allocation" },
    { label: "Booking", href: "/booking" },
    { label: "Maintain", href: "/maintenance" },
    { label: "Audit", href: "/audit" },
    { label: "Reports", href: "/reports" },
  ];

  const activeLinks = user ? authLinks : guestLinks;

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="max-w-container-max mx-auto px-margin-desktop flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <Link className="text-headline-card font-headline-card font-bold text-text-primary" href="/">
            AssetFlow
          </Link>
          <div className="hidden xl:flex items-center gap-6">
            {activeLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  className={`font-body-md transition-colors duration-200 ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-text-secondary hover:text-primary"
                  }`}
                  href={link.href}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <span className="text-text-secondary font-body-md">
                Welcome, <span className="font-semibold text-text-primary">{user.name}</span>
              </span>
              <button
                onClick={logout}
                className="bg-white border border-border text-text-primary px-5 py-2.5 rounded-full font-button text-button hover:border-text-primary transition-all shadow-sm flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Log Out
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-text-secondary font-button text-button px-4 py-2 hover:text-primary transition-colors">
                Log In
              </Link>
              <Link
                href="/contact"
                className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-button text-button hover:bg-accent-hover transition-all shadow-sm"
              >
                Book Demo
              </Link>
            </div>
          )}

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-text-primary hover:text-primary transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-border bg-surface px-6 py-4 flex flex-col gap-4 animate-fade-in shadow-lg">
          {activeLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`font-body-md py-1 transition-colors duration-200 ${
                  isActive ? "text-primary font-semibold" : "text-text-secondary hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {user ? (
            <div className="flex flex-col gap-3 pt-3 border-t border-border">
              <span className="text-text-secondary text-sm">
                Welcome, <span className="font-semibold text-text-primary">{user.name}</span>
              </span>
              <button
                onClick={logout}
                className="w-full bg-white border border-border text-text-primary px-4 py-2 rounded-full font-button text-button hover:border-text-primary transition-all text-center flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 pt-3 border-t border-border">
              <Link href="/login" className="text-text-secondary text-center py-2 hover:text-primary transition-colors">
                Log In
              </Link>
              <Link
                href="/contact"
                className="w-full bg-primary text-on-primary py-2.5 rounded-full font-button text-button hover:bg-accent-hover transition-all text-center block"
              >
                Book Demo
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
