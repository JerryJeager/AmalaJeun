"use client"
import AmalaMap from "@/components/map/AmalaMap";
import Navbar from "@/components/map/Navbar";

const Map = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />

      <AmalaMap />
    </div>
  );
};

export default Map;
