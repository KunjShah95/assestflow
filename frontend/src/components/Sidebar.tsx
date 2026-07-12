'use client';


import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, Package, ArrowRightLeft, CalendarCheck, Wrench,
  Shield, BarChart3, Bell, Settings, ChevronLeft, ChevronRight,
  LogOut
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Organization setup', href: '/organization-setup', icon: Settings },
  { label: 'Assets', href: '/assets', icon: Package },
  { label: 'Allocation & Transfer', href: '/allocation', icon: ArrowRightLeft },
  { label: 'Resource Booking', href: '/booking', icon: CalendarCheck },
  { label: 'Maintenance', href: '/maintenance', icon: Wrench },
  { label: 'Audit', href: '/audit', icon: Shield },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
  { label: 'Notifications', href: '/activity', icon: Bell },
];

export default function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-50 bg-white border-r border-[#E2E8F0] flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[64px]' : 'w-[240px]'
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center h-16 border-b border-[#E2E8F0] px-4 ${collapsed ? 'justify-center' : ''}`}>
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-bold">A</span>
          </div>
          {!collapsed && (
            <span className="text-[#0F172A] text-[16px] font-bold tracking-tight truncate">AssetFlow</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] font-medium transition-colors ${
                collapsed ? 'justify-center' : ''
              } ${
                isActive
                  ? 'bg-[#F1F5F9] text-[#0F172A]'
                  : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={20} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-[#E2E8F0] p-2">
        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span className="truncate">Collapse</span>}
        </button>

        {/* User */}
        {!collapsed && user && (
          <div className="px-3 py-3 mt-1 border-t border-[#E2E8F0]">
            <div className="text-[13px] font-medium text-[#0F172A] truncate">{user.name || user.email?.split('@')[0]}</div>
            <div className="text-[12px] text-[#94A3B8] truncate">{user.email}</div>
          </div>
        )}
        {collapsed && user && (
          <div className="flex justify-center py-3 mt-1" title={user.email}>
            <div className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center">
              <span className="text-[13px] font-medium text-[#0F172A]">
                {(user.name || user.email || 'U')[0].toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#EF4444] transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Sign out"
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span className="truncate">Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
