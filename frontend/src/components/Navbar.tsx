"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { X, Menu } from "lucide-react";

const DASHBOARD_ROUTES = [
  "/dashboard",
  "/organization-setup",
  "/assets",
  "/allocation",
  "/booking",
  "/maintenance",
  "/audit",
  "/reports",
  "/activity",
];

function isDashboardRoute(pathname: string) {
  return DASHBOARD_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export default function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide navbar for authenticated users — the Sidebar handles navigation
  if (user) return null;

  const guestLinks = [
    { label: "Product", href: "/product" },
    { label: "Solutions", href: "/solutions" },
    { label: "Developers", href: "/developers" },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <nav key={pathname} className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="max-w-container-max mx-auto px-margin-desktop flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <Link className="text-headline-card font-headline-card font-bold text-text-primary" href="/">
            AssetFlow
          </Link>
          <div className="hidden xl:flex items-center gap-6">
            {guestLinks.map((link) => {
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

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-text-primary hover:text-primary transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-border bg-surface px-6 py-4 flex flex-col gap-4 animate-fade-in shadow-lg">
          {guestLinks.map((link) => {
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
        </div>
      )}
    </nav>
  );
}
