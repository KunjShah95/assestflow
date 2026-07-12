"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF2F2]">
        <AlertCircle className="h-6 w-6 text-[#EF4444]" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-[#0F172A]">Dashboard error</h2>
        <p className="mt-1 text-sm text-[#64748B]">
          {error.message || "Something went wrong loading this page."}
        </p>
      </div>
      <button
        onClick={reset}
        className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1D4ED8] transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
