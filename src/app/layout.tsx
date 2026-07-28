import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sheela — Ventes groupées mode & beauté",
  description:
    "Plateforme pour créatrices de ventes groupées : vêtements, accessoires, parfums, chaussures, ongles. Organisez vos commandes Shein-style facilement.",
  keywords: ["ventes groupées", "shein", "mode", "beauté", "commandes groupées"],
  verification: {
    google: "VDo9p9lO_voD9Kw_B2QqHO5_rjbO1cno5--WGxBSWWo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-[#0a0118] text-zinc-100">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}