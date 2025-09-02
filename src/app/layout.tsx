// File: src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Drone Survey Management",
  description: "Plan, manage, and monitor drone surveys.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* We can add a simple header back later if needed */}
        <Header/>
        
        <main className="container mx-auto py-8">{children}</main>
        <Toaster richColors />
      </body>
    </html>
  );
}