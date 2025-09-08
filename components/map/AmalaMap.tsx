"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Map as LeafletMap } from "leaflet";


const MapContainer = dynamic(
  async () => (await import("react-leaflet")).MapContainer,
  { ssr: false }
);
const TileLayer = dynamic(async () => (await import("react-leaflet")).TileLayer, {
  ssr: false,
});
const Popup = dynamic(async () => (await import("react-leaflet")).Popup, {
  ssr: false,
});
const Marker = dynamic(async () => (await import("react-leaflet")).Marker, {
  ssr: false,
});
import { useMap } from "react-leaflet";
const MarkerClusterGroup: any = dynamic(
  async () => (await import("react-leaflet-cluster")).default,
  { ssr: false }
);

import L from "leaflet";

// --- Types

type PriceBand = "$" | "$$" | "$$$";

type SpotStatus = "verified" | "pending" | "candidate";

type AmalaSpot = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  price: PriceBand;
  hours: string; // e.g., "10:00–22:00"
  openNow: boolean;
  rating: number; // 0–5
  status: SpotStatus;
  neighborhood?: string;
};

// --- Dummy Lagos data (hand‑placed clusters around popular areas)
const DUMMY_SPOTS: AmalaSpot[] = [
  {
    id: "1",
    name: "Iya Meta Amala & Gbegiri",
    address: "Akerele Rd, Surulere, Lagos",
    lat: 6.5005,
    lng: 3.3545,
    price: "$",
    hours: "09:00–21:00",
    openNow: true,
    rating: 4.6,
    status: "verified",
    neighborhood: "Surulere",
  },
  {
    id: "2",
    name: "Mama Sade Buka",
    address: "Ojuelegba, Surulere",
    lat: 6.507,
    lng: 3.361,
    price: "$",
    hours: "10:00–20:00",
    openNow: false,
    rating: 4.2,
    status: "pending",
    neighborhood: "Surulere",
  },
  {
    id: "3",
    name: "Amala Heaven Yaba",
    address: "Commercial Ave, Yaba",
    lat: 6.5155,
    lng: 3.378,
    price: "$$",
    hours: "11:00–22:00",
    openNow: true,
    rating: 4.8,
    status: "verified",
    neighborhood: "Yaba",
  },
  {
    id: "4",
    name: "Taste of Oyo",
    address: "Sabo, Yaba",
    lat: 6.5185,
    lng: 3.389,
    price: "$$",
    hours: "09:30–21:00",
    openNow: true,
    rating: 4.4,
    status: "candidate",
    neighborhood: "Yaba",
  },
  {
    id: "5",
    name: "Buka Republic Lekki",
    address: "Admiralty Way, Lekki Phase 1",
    lat: 6.448,
    lng: 3.469,
    price: "$$$",
    hours: "12:00–23:00",
    openNow: true,
    rating: 4.7,
    status: "verified",
    neighborhood: "Lekki",
  },
  {
    id: "6",
    name: "Ìbílẹ̀ Kitchen",
    address: "Lekki Phase 1",
    lat: 6.4415,
    lng: 3.4645,
    price: "$$",
    hours: "10:00–22:00",
    openNow: false,
    rating: 4.1,
    status: "pending",
    neighborhood: "Lekki",
  },
  {
    id: "7",
    name: "Amala Corner Ikeja",
    address: "Awolowo Way, Ikeja",
    lat: 6.603,
    lng: 3.349,
    price: "$",
    hours: "08:00–19:00",
    openNow: true,
    rating: 4.0,
    status: "verified",
    neighborhood: "Ikeja",
  },
  {
    id: "8",
    name: "Oyo Heritage Buka",
    address: "Computer Village, Ikeja",
    lat: 6.5965,
    lng: 3.3535,
    price: "$",
    hours: "09:00–20:00",
    openNow: false,
    rating: 3.9,
    status: "candidate",
    neighborhood: "Ikeja",
  },
  {
    id: "9",
    name: "Gbegiri House",
    address: "Victoria Island",
    lat: 6.428,
    lng: 3.42,
    price: "$$$",
    hours: "12:00–22:30",
    openNow: true,
    rating: 4.9,
    status: "verified",
    neighborhood: "VI",
  },
  {
    id: "10",
    name: "Amala & More",
    address: "Victoria Island",
    lat: 6.4305,
    lng: 3.4145,
    price: "$$",
    hours: "11:00–21:30",
    openNow: true,
    rating: 4.3,
    status: "pending",
    neighborhood: "VI",
  },
  {
    id: "11",
    name: "Iya Bose Joint",
    address: "Iyana Ipaja",
    lat: 6.611,
    lng: 3.289,
    price: "$",
    hours: "08:30–18:00",
    openNow: false,
    rating: 3.8,
    status: "candidate",
    neighborhood: "Iyana Ipaja",
  },
  {
    id: "12",
    name: "Bowl of Oyo",
    address: "Maryland, Ikeja",
    lat: 6.572,
    lng: 3.367,
    price: "$$",
    hours: "10:00–20:30",
    openNow: true,
    rating: 4.5,
    status: "verified",
    neighborhood: "Maryland",
  },
  {
    id: "13",
    name: "Amala Express Yaba",
    address: "Tejuosho, Yaba",
    lat: 6.5125,
    lng: 3.376,
    price: "$",
    hours: "09:00–19:30",
    openNow: true,
    rating: 4.2,
    status: "pending",
    neighborhood: "Yaba",
  },
  {
    id: "14",
    name: "Ewedu & Co",
    address: "Ogudu",
    lat: 6.569,
    lng: 3.392,
    price: "$$",
    hours: "10:00–21:00",
    openNow: true,
    rating: 4.1,
    status: "verified",
    neighborhood: "Ogudu",
  },
  {
    id: "15",
    name: "Buka Lekki Right",
    address: "Lekki",
    lat: 6.4425,
    lng: 3.4775,
    price: "$$$",
    hours: "12:00–23:00",
    openNow: false,
    rating: 4.6,
    status: "candidate",
    neighborhood: "Lekki",
  },
  {
    id: "16",
    name: "Mama Funke Amala",
    address: "Oshodi",
    lat: 6.555,
    lng: 3.339,
    price: "$",
    hours: "08:00–19:00",
    openNow: true,
    rating: 3.7,
    status: "pending",
    neighborhood: "Oshodi",
  },
  {
    id: "17",
    name: "Gidi Amala Spot",
    address: "Obalende, Ikoyi",
    lat: 6.4505,
    lng: 3.4095,
    price: "$$",
    hours: "10:30–21:30",
    openNow: true,
    rating: 4.4,
    status: "verified",
    neighborhood: "Ikoyi",
  },
  {
    id: "18",
    name: "Amala Palace Surulere",
    address: "Adelabu St, Surulere",
    lat: 6.4975,
    lng: 3.354,
    price: "$$",
    hours: "09:30–21:30",
    openNow: true,
    rating: 4.0,
    status: "candidate",
    neighborhood: "Surulere",
  },
];

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

  return (
    <div className="relative h-[calc(100vh-0px)] w-full">
      {/* Floating top bar */}
      <div className="pointer-events-auto absolute left-1/2 top-4 z-[1000] w-[92%] max-w-3xl -translate-x-1/2">
        <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white/95 p-2 shadow-lg">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Amala spots, areas…"
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none"
          />
          {/* <select
            value={price}
            onChange={(e) => setPrice(e.target.value as any)}
            className="rounded-xl border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="all">Price: All</option>
            <option value="$">$</option>
            <option value="$$">$$</option>
            <option value="$$$">$$$</option>
          </select> */}
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
            onClick={() => alert("Open agent chat (to implement)")}
          >
            + Add via AI
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="pointer-events-none absolute left-4 top-4 z-[1000] hidden w-48 rounded-2xl bg-white/90 p-3 text-xs shadow-md md:block">
        <div className="mb-1 font-semibold">Legend</div>
        <div className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full" style={{background:'#16a34a'}} /> Verified</div>
        <div className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full" style={{background:'#eab308'}} /> Pending</div>
        <div className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full" style={{background:'#6b7280'}} /> Candidate</div>
      </div>

      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

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
                  <div className="mb-2 text-xs text-gray-600">{spot.address}</div>
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
                    Rating: {spot.rating.toFixed(1)} <Stars rating={spot.rating} />
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
    </div>
  );
}
