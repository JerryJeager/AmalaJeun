"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Map as LeafletMap } from "leaflet";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const MapContainer = dynamic(
  async () => (await import("react-leaflet")).MapContainer,
  { ssr: false }
);
const TileLayer = dynamic(
  async () => (await import("react-leaflet")).TileLayer,
  {
    ssr: false,
  }
);
const Popup = dynamic(async () => (await import("react-leaflet")).Popup, {
  ssr: false,
});
const Marker = dynamic(async () => (await import("react-leaflet")).Marker, {
  ssr: false,
});
import { useMap, useMapEvents } from "react-leaflet";
const MarkerClusterGroup: any = dynamic(
  async () => (await import("react-leaflet-cluster")).default,
  { ssr: false }
);

import L from "leaflet";
import { DUMMY_SPOTS } from "@/data/data";
import { PriceBand, SpotStatus } from "@/types/type";
import AmalaChat from "../chat/AmalaChat";
import { Button } from "../ui/button";

// --- Map helpers

function statusColor(status: SpotStatus) {
  switch (status) {
    case "verified":
      return "#16a34a"; // green
    case "pending":
      return "#eab308"; // amber
    default:
      return "#6b7280"; // gray
  }
}

function makeDivIcon(label: string, status: SpotStatus) {
  const color = statusColor(status);
  return L.divIcon({
    className: "amala-marker",
    html: `
      <div style="display:flex;align-items:center;gap:6px;">
        <div style="width:12px;height:12px;border-radius:9999px;background:${color};box-shadow:0 0 0 2px white;">
        </div>
        <span style="background:white;padding:4px 8px;border-radius:12px;font-size:12px;line-height:1;font-weight:600;box-shadow:0 2px 6px rgba(0,0,0,0.12);">${label}</span>
      </div>
    `,
    iconAnchor: [0, 0],
    popupAnchor: [0, -10],
  });
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const stars = Array.from({ length: 5 }).map((_, i) => {
    if (i < full) return "★";
    if (i === full && half) return "☆"; // simple half placeholder
    return "☆";
  });
  return <span className="ml-1 text-xs opacity-70">{stars.join("")}</span>;
}

function LocateButton() {
  const map = (useMap as any)() as LeafletMap;
  return (
    <button
      onClick={() => {
        map.locate().on("locationfound", (e: any) => {
          map.flyTo(e.latlng, 14, { duration: 0.75 });
        });
      }}
      className="absolute bottom-5 right-5 z-[1000] rounded-2xl bg-white/90 px-3 py-2 text-sm font-semibold shadow-md hover:bg-white"
    >
      Locate me
    </button>
  );
}

export default function AmalaMap() {
  const [query, setQuery] = useState("");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [openNow, setOpenNow] = useState(false);
  const [price, setPrice] = useState<PriceBand | "all">("all");
  const [addingMode, setAddingMode] = useState(false);
  const [pickedPoint, setPickedPoint] = useState<[number, number] | null>(null);
  const [candidate, setCandidate] = useState<L.LatLng | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  const filtered = useMemo(() => {
    return DUMMY_SPOTS.filter((s) => {
      if (onlyVerified && s.status !== "verified") return false;
      if (openNow && !s.openNow) return false;
      if (price !== "all" && s.price !== price) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        (s.neighborhood?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [onlyVerified, openNow, price, query]);

  const center: [number, number] = [6.5244, 3.3792]; // Lagos

  function ClickHandler({ setCandidate }: { setCandidate: any }) {
    useMapEvents({
      click(e) {
        setCandidate(e.latlng);
      },
    });
    return null;
  }

  return (
    <div className="relative h-[calc(100vh-0px)] w-full">
      {/* Floating top bar */}
      <div className="pointer-events-auto absolute left-1/2 top-4 z-[3] w-[92%] max-w-3xl -translate-x-1/2">
        <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white/95 p-2 shadow-lg">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Amala spots, areas…"
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none"
          />
          <label className="flex items-center gap-2 rounded-xl border border-gray-200 px-2 py-1 text-xs">
            <input
              type="checkbox"
              checked={onlyVerified}
              onChange={(e) => setOnlyVerified(e.target.checked)}
            />
            Verified only
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1 text-xs">
            <input
              type="checkbox"
              checked={openNow}
              onChange={(e) => setOpenNow(e.target.checked)}
            />
            Open now
          </label>
          <button
            className="rounded-xl bg-black px-3 py-1 text-xs font-semibold text-white hover:bg-gray-900"
            onClick={() => {
              setAddingMode(true);
              setIsInstructionsOpen(true);
            }}
          >
            + Add via AI
          </button>
        </div>
      </div>
      {/* Legend */}
      <div className="pointer-events-none absolute left-4 top-4 z-[1] hidden w-48 rounded-2xl bg-white/90 p-3 text-xs shadow-md md:block">
        <div className="mb-1 font-semibold">Legend</div>
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ background: "#16a34a" }}
          />{" "}
          Verified
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ background: "#eab308" }}
          />{" "}
          Pending
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ background: "#6b7280" }}
          />{" "}
          Candidate
        </div>
      </div>
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom
        className="h-full w-full leaflet-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {addingMode && <ClickHandler setCandidate={setCandidate} />}

        {candidate && (
          <Marker
            position={candidate}
            draggable={true}
            icon={L.divIcon({
              className: "amala-marker-temp",
              html: `<div style="color:red;font-weight:bold;">📍</div>`,
            })}
            eventHandlers={{
              dragend: (e) => setCandidate(e.target.getLatLng()),
            }}
          >
            <Popup>
              <div>
                <p>Use this location?</p>
                <div className="flex gap-2">
                  <button
                    className="text-red-500"
                    onClick={() => setCandidate(null)}
                  >
                    Cancel
                  </button>
                  <button onClick={() => setIsChatOpen(true)}>Confirm</button>
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* {pickedPoint && (
          <Marker
            position={pickedPoint}
            icon={L.divIcon({
              className: "amala-marker-temp",
              html: `<div style="color:red;font-weight:bold;">📍</div>`,
            })}
          >
            <Popup>New Amala Spot</Popup>
          </Marker>
        )} */}

        <MarkerClusterGroup
          chunkedLoading
          showCoverageOnHover={false}
          spiderfyOnMaxZoom
          maxClusterRadius={50}
        >
          {filtered.map((spot) => (
            <Marker
              key={spot.id}
              position={[spot.lat, spot.lng]}
              icon={makeDivIcon(spot.name, spot.status)}
            >
              <Popup>
                <div className="min-w-[220px]">
                  <div className="mb-1 text-sm font-bold">{spot.name}</div>
                  <div className="mb-2 text-xs text-gray-600">
                    {spot.address}
                  </div>
                  <div className="mb-2 flex items-center gap-2 text-xs">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                      style={{ background: statusColor(spot.status) }}
                    >
                      {spot.status.toUpperCase()}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px]">
                      {spot.price}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px]">
                      {spot.hours}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px]">
                      {spot.openNow ? "Open" : "Closed"}
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    Rating: {spot.rating.toFixed(1)}{" "}
                    <Stars rating={spot.rating} />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      className="rounded-lg bg-black px-3 py-1 text-xs font-semibold text-white"
                      onClick={() => alert("Verify flow – to implement")}
                    >
                      Verify
                    </button>
                    <button
                      className="rounded-lg border px-3 py-1 text-xs font-semibold"
                      onClick={() => alert("Add photo – to implement")}
                    >
                      Add photo
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>

        {/* Locate */}
        {/* @ts-ignore */}
        <LocateButton />
      </MapContainer>
      {/* Chat Modal */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent
          className="sm:max-w-[500px] h-[600px] flex flex-col p-4"
          //   style={{ zIndex: 9999, position: "relative" }}
        >
          <DialogHeader>
            <DialogTitle>Describe the Amala Spot</DialogTitle>
            <DialogDescription>
              Provide details about the Amala spot to help us verify and add it
              to the map.
            </DialogDescription>
          </DialogHeader>
          {candidate && (
            <div className="mt-4">
              <p className="mb-2 text-sm">
                Location: {candidate.lat.toFixed(5)}, {candidate.lng.toFixed(5)}
              </p>
              <div className="h-96">
                {/* @ts-ignore */}
                <AmalaChat
                  lat={candidate.lat.toFixed(5)}
                  lng={candidate.lng.toFixed(5)}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* instructions */}
      <Dialog open={isInstructionsOpen} onOpenChange={setIsInstructionsOpen}>
        <DialogTrigger asChild>
          <Button variant="default">Add Amala Spot</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>How to Add an Amala Location</DialogTitle>
            <DialogDescription>
              Follow these steps to mark and confirm an Amala spot on the map.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-sm text-gray-700">
            <p>1. Tap on the map to select a point. A pin will appear.</p>
            <p>2. Drag the pin around until you are happy with the location.</p>
            <p>3. Click on the pin to confirm your selection.</p>
            <p>
              4. Once confirmed, an AI chat will open where you can provide more
              details about the spot (e.g. name, specialty, opening hours).
            </p>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setIsInstructionsOpen(false)}
              variant="default"
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
