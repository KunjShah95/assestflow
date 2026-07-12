'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/Sidebar";
import { ToastProvider } from "@/components/ToastProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/');
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-[#475569] animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#F8FAFC]">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main
          className={`transition-all duration-300 ease-in-out min-h-screen ${
            sidebarCollapsed ? 'ml-[64px]' : 'ml-[240px]'
          }`}
        >
          <div className="px-8 py-8 max-w-[1320px]">
            {children}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
