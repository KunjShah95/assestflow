import type { Metadata } from "next";
<<<<<<< HEAD
import { ToastProvider } from "@/components/ToastProvider";
=======
import { Inter } from "next/font/google";
>>>>>>> 0c3e4cf95e6e6e4335d56146084439ad368addef
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AssetFlow | Enterprise Resource Intelligence",
  description:
    "AssetFlow is the operating system for enterprise resource management — unifying assets, people, bookings, maintenance, audits, and operational intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<<<<<<< HEAD
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ToastProvider>{children}</ToastProvider>
=======
    <html lang="en" className={`${inter.variable} scroll-smooth h-full antialiased`}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
      </head>
      <body className="min-h-full flex flex-col bg-surface text-text-primary font-body-md overflow-x-hidden">
        <AuthProvider>{children}</AuthProvider>
>>>>>>> 0c3e4cf95e6e6e4335d56146084439ad368addef
      </body>
    </html>
  );
}
