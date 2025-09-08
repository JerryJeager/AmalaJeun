"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/map/Navbar";

const AmalaMap = dynamic(() => import("@/components/map/AmalaMap"), {
  ssr: false,
});

export default function Map() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AmalaMap />
    </div>
  );
}
