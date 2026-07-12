"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center bg-[#F8FAFC]">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FEF2F2]">
        <AlertCircle className="h-7 w-7 text-[#EF4444]" />
      </div>
      <div>
        <h1 className="text-xl font-semibold text-[#0F172A]">Something went wrong</h1>
        <p className="mt-2 max-w-md text-sm text-[#64748B]">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
      </div>
      <button
        onClick={reset}
        className="rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1D4ED8] transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
