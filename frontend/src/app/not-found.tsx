import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center bg-[#F8FAFC]">
      <p className="text-6xl font-bold text-[#CBD5E1]">404</p>
      <div>
        <h1 className="text-xl font-semibold text-[#0F172A]">Page not found</h1>
        <p className="mt-2 text-sm text-[#64748B]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1D4ED8] transition-colors"
      >
        Go home
      </Link>
    </div>
  );
}
