"use client";

import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 -z-10 bg-gradient-to-b from-violet-950/30 to-[#0a0118]" />
  ),
});

export default function HeroSection() {
  return <HeroScene />;
}
