"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Map as LeafletMap } from "leaflet";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

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
import { BASE_URL } from "@/data/data";
import type {
  AmalaSpotNew,
  PlacePrediction,
  PriceBand,
  SpotStatus,
} from "@/types/type";
import AmalaChat from "../chat/AmalaChat";
import GoogleAuth from "../home/GoogleAuth";
import { getCookie } from "@/actions/handleCookies";
import useUserStore from "@/store/useUserStore";
import InstructionDialog from "./InstructionDialog";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { useGooglePlaces } from "@/hooks/use-google-places";
import { Loader2, Filter } from "lucide-react";

function MapController({
  center,
  zoom,
}: {
  center: [number, number] | null;
  zoom?: number;
}) {
  const map = useMap() as LeafletMap;

  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 14, { duration: 1 });
    }
  }, [center, zoom, map]);

  return null;
}

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
  const map = useMap() as LeafletMap;
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

function isSpotOpenNow(openingTime: string, closingTime: string): boolean {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes

  const [openHour, openMin] = openingTime.split(":").map(Number);
  const [closeHour, closeMin] = closingTime.split(":").map(Number);

  const openTimeMinutes = openHour * 60 + openMin;
  const closeTimeMinutes = closeHour * 60 + closeMin;

  // Handle cases where closing time is next day (e.g., 23:00 - 02:00)
  if (closeTimeMinutes < openTimeMinutes) {
    return currentTime >= openTimeMinutes || currentTime <= closeTimeMinutes;
  }

  return currentTime >= openTimeMinutes && currentTime <= closeTimeMinutes;
}

export default function AmalaMap() {
  const [query, setQuery] = useState("");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [openNow, setOpenNow] = useState(false);
  const [dineIn, setDineIn] = useState(false);
  const [priceRange, setPriceRange] = useState([1000, 10000]);
  const [price, setPrice] = useState<PriceBand | "all">("all");
  const [addingMode, setAddingMode] = useState(false);
  const [pickedPoint, setPickedPoint] = useState<[number, number] | null>(null);
  const [candidate, setCandidate] = useState<L.LatLng | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useUserStore();
  const [accessToken, setAccessToken] = useState("");
  const [amalaSpots, setAmalaSpots] = useState<AmalaSpotNew[]>([]);
  const [isAmalaSpotsLoading, setIsAmalaSpotsLoading] = useState(false);
  const router = useRouter();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const { predictions, isLoading, searchPlaces, getPlaceDetails } =
    useGooglePlaces();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const center: [number, number] = [6.5244, 3.3792]; // Lagos

  const handleSearchChange = (value: string) => {
    setQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setShowSuggestions(value.length > 0);

    if (value.length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        searchPlaces(value);
      }, 300);
    } else {
      setShowSuggestions(false);
    }
  };

  const handlePlaceSelect = async (prediction: PlacePrediction) => {
    const placeDetails = await getPlaceDetails(prediction.place_id);
    if (placeDetails) {
      const lat = placeDetails.location.lat();
      const lng = placeDetails.location.lng();

      setQuery(prediction.description);
      setShowSuggestions(false);

      setMapCenter([lat, lng]);
    }
  };

  function ClickHandler({ setCandidate }: { setCandidate: any }) {
    useMapEvents({
      click(e) {
        setCandidate(e.latlng);
      },
    });
    return null;
  }

  const handleAddViaAI = async () => {
    const token = await getCookie("amalajeun_token");
    if (token?.value) {
      setAddingMode(true);
      setIsInstructionsOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  useEffect(() => {
    const getMapData = async () => {
      try {
        setIsAmalaSpotsLoading(true);
        const [token, spots]: [token: any, amalaSpots: any] = await Promise.all(
          [
            await getCookie("amalajeun_token"),
            await axios.get(`${BASE_URL()}/api/v1/spots`),
          ]
        );
        if (token?.value) {
          setAccessToken(token?.value);
        }
        if (spots.status == 200) {
          // console.log(spots?.data.data)
          setAmalaSpots(spots?.data.data || []);
        }
      } catch (err) {
        toast.error("Failed to load Amala spots. Please try again.");
      } finally {
        setIsAmalaSpotsLoading(false);
      }
    };
    getMapData();
  }, []);

  const filteredSpots = useMemo(() => {
    return amalaSpots.filter((spot) => {
      // Search query filter
      if (
        query &&
        !spot.name.toLowerCase().includes(query.toLowerCase()) &&
        !spot.address.toLowerCase().includes(query.toLowerCase())
      ) {
        return false;
      }

      // Verified filter
      if (onlyVerified && !spot.verified) {
        return false;
      }

      // Open now filter
      if (openNow && !isSpotOpenNow(spot.opening_time, spot.closing_time)) {
        return false;
      }

      // Dine-in filter
      if (dineIn && !spot.dine_in) {
        return false;
      }

      // Price range filter
      if (spot.price < priceRange[0] || spot.price > priceRange[1]) {
        return false;
      }

      return true;
    });
  }, [amalaSpots, query, onlyVerified, openNow, dineIn, priceRange]);

  const clearAllFilters = () => {
    setOnlyVerified(false);
    setOpenNow(false);
    setDineIn(false);
    setPriceRange([1000, 10000]);
    setQuery("");
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (onlyVerified) count++;
    if (openNow) count++;
    if (dineIn) count++;
    if (priceRange[0] > 1000 || priceRange[1] < 10000) count++;
    return count;
  }, [onlyVerified, openNow, dineIn, priceRange]);

  return (
    <div className="relative h-[calc(100vh-0px)] w-full">
      {!isAmalaSpotsLoading && (
        <>
          <div className="pointer-events-auto absolute left-1/2 top-4 z-[3] w-[92%] max-w-3xl -translate-x-1/2">
            <div className="flex relative flex-wrap items-center gap-2 rounded-2xl bg-white/95 p-2 shadow-lg">
              {showSuggestions && (predictions.length > 0 || isLoading) && (
                <div className="absolute top-full w-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto z-50">
                  {isLoading ? (
                    <div className="p-3 text-sm text-gray-500">
                      Searching...
                    </div>
                  ) : (
                    <div className="py-1">
                      {predictions.map((prediction) => (
                        <button
                          key={prediction.place_id}
                          onClick={() => handlePlaceSelect(prediction)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-none"
                        >
                          <div className="text-sm font-medium text-gray-900">
                            {prediction.structured_formatting.main_text ||
                              prediction.description}
                          </div>
                          <div className="text-xs text-gray-500">
                            {prediction.structured_formatting.secondary_text}
                          </div>
                        </button>
                      ))}
                      {predictions.length === 0 && query.length >= 2 && (
                        <div className="p-3 text-sm text-gray-500">
                          No places found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {showFilters && (
                <div className="absolute top-full right-0 mt-1 w-full mx-auto lg:w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">Filters</h4>
                      {activeFiltersCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearAllFilters}
                          className="text-xs h-auto p-1 hover:bg-gray-100"
                        >
                          Clear all
                        </Button>
                      )}
                    </div>

                    <Separator />

                    {/* Price Range Filter */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium">
                        Price Range: ₦{priceRange[0].toLocaleString()} - ₦
                        {priceRange[1].toLocaleString()}
                      </label>
                      <Slider
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value)}
                        max={10000}
                        min={1000}
                        step={500}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>₦1,000</span>
                        <span>₦10,000+</span>
                      </div>
                    </div>

                    <Separator />

                    {/* Checkbox Filters */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={onlyVerified}
                          onChange={(e) => setOnlyVerified(e.target.checked)}
                          className="rounded"
                        />
                        Verified spots only
                      </label>

                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={openNow}
                          onChange={(e) => setOpenNow(e.target.checked)}
                          className="rounded"
                        />
                        Open now
                      </label>

                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={dineIn}
                          onChange={(e) => setDineIn(e.target.checked)}
                          className="rounded"
                        />
                        Eat-in available
                      </label>
                    </div>

                    <div className="pt-2 text-xs text-gray-500">
                      Showing {filteredSpots.length} of {amalaSpots.length}{" "}
                      spots
                    </div>
                  </div>
                </div>
              )}
              <div className="flex-1 relative">
                <input
                  value={query}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setShowSuggestions(query.length > 0)}
                  onBlur={() => {
                    // Delay hiding suggestions to allow clicks
                    setTimeout(() => setShowSuggestions(false), 150);
                  }}
                  placeholder="Search Amala spots, areas…"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="relative rounded-xl border-gray-200 px-3 py-1 text-xs bg-transparent hover:bg-gray-50 cursor-pointer"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-3 w-3 mr-1" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </div>

              <button
                className="rounded-xl bg-primary px-3 py-1 text-xs font-semibold text-white hover:bg-gray-900"
                onClick={() => {
                  handleAddViaAI();
                }}
              >
                + Add via AI
              </button>
            </div>
          </div>

          {showFilters && (
            <div
              className="fixed inset-0 z-[2]"
              onClick={() => setShowFilters(false)}
            />
          )}

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
            <MapController center={mapCenter} />
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
                      <button onClick={() => setIsChatOpen(true)}>
                        Confirm
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}
            <MarkerClusterGroup
              chunkedLoading
              showCoverageOnHover={false}
              spiderfyOnMaxZoom
              maxClusterRadius={50}
            >
              {filteredSpots?.length > 0 &&
                filteredSpots.map((spot) => {
                  const isOpen = isSpotOpenNow(
                    spot.opening_time,
                    spot.closing_time
                  );
                  return (
                    <Marker
                      key={spot.id}
                      position={[spot.latitude, spot.longitude]}
                      icon={makeDivIcon(
                        spot.name,
                        spot.verified ? "verified" : "pending"
                      )}
                    >
                      <Popup>
                        <div className="min-w-[220px]">
                          <div className="mb-1 text-sm font-bold">
                            {spot.name}
                          </div>
                          <div className="mb-2 text-xs text-gray-600">
                            {spot.address}
                          </div>
                          <div className="mb-2 flex items-center gap-2 text-xs flex-wrap">
                            <span
                              className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                              style={{
                                background: statusColor(
                                  spot.verified ? "verified" : "pending"
                                ),
                              }}
                            >
                              {spot.verified ? "Verified" : "Pending"}
                            </span>
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px]">
                              ₦{spot.price.toLocaleString()}
                            </span>
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px]">
                              {spot.opening_time} - {spot.closing_time}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                isOpen
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {isOpen ? "Open" : "Closed"}
                            </span>
                            {spot.dine_in && (
                              <span className="rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-[10px]">
                                Eat-in
                              </span>
                            )}
                          </div>
                          <div className="mt-3 flex gap-2">
                            <button
                              className="rounded-lg bg-black px-3 py-1 text-xs font-semibold text-white"
                              onClick={() =>
                                alert("Verify flow – to implement")
                              }
                            >
                              Verify
                            </button>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
            </MarkerClusterGroup>
            <LocateButton />
          </MapContainer>

          <Dialog
            open={isChatOpen}
            onOpenChange={(open) => {
              setIsChatOpen(open);
              if (!open) {
                // dialog just closed
                if (window) window.location.reload()
              }
            }}
          >
            <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-4">
              <DialogHeader>
                <DialogTitle>Describe the Amala Spot</DialogTitle>
                <DialogDescription>
                  Provide details about the Amala spot to help us verify and add
                  it to the map.
                </DialogDescription>
              </DialogHeader>
              {candidate && (
                <div className="mt-4">
                  <p className="mb-2 text-sm">
                    Location: {candidate.lat.toFixed(5)},{" "}
                    {candidate.lng.toFixed(5)}
                  </p>
                  <div className="h-96">
                    {user && accessToken && (
                      <AmalaChat
                        lat={candidate.lat.toFixed(5)}
                        lng={candidate.lng.toFixed(5)}
                        accessToken={accessToken}
                        user={user}
                      />
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
          <InstructionDialog
            isInstructionsOpen={isInstructionsOpen}
            setIsInstructionsOpen={setIsInstructionsOpen}
          />
          <GoogleAuth
            isAuthModalOpen={isAuthModalOpen}
            setIsAuthModalOpen={setIsAuthModalOpen}
          />
        </>
      )}
      {isAmalaSpotsLoading && (
        <div className="flex h-full items-center justify-center">
          <div className="space-y-4 w-full max-w-lg">
            <Loader2 className="mx-auto animate-spin" />
          </div>
        </div>
      )}
    </div>
  );
}
