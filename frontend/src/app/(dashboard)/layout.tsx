import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-sidebar-width flex flex-col h-full bg-surface overflow-hidden">
        {children}
      </main>
    </div>
  );
}
