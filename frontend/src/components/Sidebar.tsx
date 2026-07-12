"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  icon: string;
  href: string;
}

const mainNavItems: NavItem[] = [
  { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { label: "Organization Setup", icon: "corporate_fare", href: "/organization-setup" },
  { label: "Assets", icon: "inventory_2", href: "/assets" },
  { label: "Allocation & Transfer", icon: "swap_horiz", href: "/allocation" },
  { label: "Resource Booking", icon: "event_seat", href: "/booking" },
  { label: "Maintenance", icon: "build", href: "/maintenance" },
  { label: "Audit", icon: "fact_check", href: "/audit" },
  { label: "Reports", icon: "analytics", href: "/reports" },
  { label: "Notifications", icon: "notifications", href: "/activity" },
];

const footerNavItems: NavItem[] = [
  { label: "Settings", icon: "settings", href: "#" },
  { label: "Logout", icon: "logout", href: "/" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop/Tablet Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-sidebar-width bg-surface-container-low border-r border-border-subtle py-standard z-40 transition-all duration-300">
        {/* Brand */}
        <div className="px-container mb-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-on-primary font-bold shadow-sm">
            A
          </div>
          <div>
            <div className="text-headline-md font-bold text-primary">AssetFlow</div>
            <div className="text-label-md text-text-secondary">
              Enterprise Resource Management
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 overflow-y-auto px-2 space-y-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg mx-2 my-1 transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-on-primary translate-x-1"
                    : "text-text-secondary hover:bg-surface-container-high"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    isActive ? "filled" : ""
                  }`}
                >
                  {item.icon}
                </span>
                <span className={`text-label-md ${isActive ? "font-bold" : ""}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Nav */}
        <div className="px-2 mt-auto space-y-1 border-t border-border-subtle pt-4">
          {footerNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 text-text-secondary hover:bg-surface-container-high rounded-lg mx-2 my-1 transition-all duration-200"
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="text-label-md">{item.label}</span>
            </Link>
          ))}
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="md:hidden flex justify-between items-center h-16 px-container w-full bg-surface-container-lowest border-b border-border-subtle sticky top-0 z-50">
        <div className="text-headline-lg font-black text-primary">AssetFlow</div>
        <div className="flex items-center gap-4">
          <button className="text-text-secondary hover:bg-surface-container-low transition-colors p-2 rounded-full">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="text-text-secondary hover:bg-surface-container-low transition-colors p-2 rounded-full">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </header>
    </>
  );
}
