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
import type { PriceBand, SpotStatus } from "@/types/type";
import AmalaChat from "../chat/AmalaChat";
import GoogleAuth from "../home/GoogleAuth";
import { getCookie } from "@/actions/handleCookies";
import useUserStore from "@/store/useUserStore";
import InstructionDialog from "./InstructionDialog";

interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface PlaceDetails {
  location: {
    lat: () => number;
    lng: () => number;
  };

  formatted_address: string;
  name: string;
}

function useGooglePlaces() {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initializeServices = () => {
      console.log("Google Maps loaded, ready to use new APIs");
    };

    if (window.google) {
      initializeServices();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.onload = initializeServices;
      document.head.appendChild(script);
    }
  }, []);

  const searchPlaces = async (input: string) => {
    if (
      !window.google ||
      !window.google.maps ||
      !window.google.maps.places ||
      input.length < 2
    ) {
      setPredictions([]);
      return;
    }

    setIsLoading(true);
    try {
      const request = {
        input,
        locationBias: {
          north: 6.6,
          south: 6.4,
          east: 3.4,
          west: 3.3,
        },
        includedPrimaryTypes: ["establishment", "geocode"],
      };

      const { suggestions } =
        await window.google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
          request
        );

      if (suggestions) {
        const convertedPredictions = suggestions.map((suggestion: any) => ({
          place_id:
            suggestion.placePrediction?.placeId ||
            suggestion.queryPrediction?.placeId ||
            "",
          description:
            suggestion.placePrediction?.text?.text ||
            suggestion.queryPrediction?.text?.text ||
            "",
          structured_formatting: {
            main_text:
              suggestion.placePrediction?.structuredFormat?.mainText?.text ||
              suggestion.queryPrediction?.text?.text ||
              "",
            secondary_text:
              suggestion.placePrediction?.structuredFormat?.secondaryText
                ?.text || "",
          },
        }));
        console.log(convertedPredictions);
        setPredictions(convertedPredictions);
      } else {
        setPredictions([]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching place predictions:", error);
      setPredictions([]);
      setIsLoading(false);
    }
  };

  const getPlaceDetails = async (
    placeId: string
  ): Promise<PlaceDetails | null> => {
    if (!window.google || !placeId) return null;

    try {
      const place = new window.google.maps.places.Place({
        id: placeId,
        requestedLanguage: "en",
      });

      await place.fetchFields({
        fields: ["location", "formattedAddress", "displayName"],
      });

      if (place.location) {
        return {
          location: {
            lat: () => place.location!.lat(),
            lng: () => place.location!.lng(),
          },

          formatted_address: place.formattedAddress || "",
          name: place.displayName || "",
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching place details:", error);
      return null;
    }
  };

  return { predictions, isLoading, searchPlaces, getPlaceDetails };
}

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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useUserStore();
  const [accessToken, setAccessToken] = useState("");

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const { predictions, isLoading, searchPlaces, getPlaceDetails } =
    useGooglePlaces();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

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
    const getToken = async () => {
      const token = await getCookie("amalajeun_token");
      if (token?.value) {
        setAccessToken(token?.value);
      }
    };
    getToken();
  }, []);

  return (
    <div className="relative h-[calc(100vh-0px)] w-full">
      <div className="pointer-events-auto absolute left-1/2 top-4 z-[3] w-[92%] max-w-3xl -translate-x-1/2">
        <div className="flex relative flex-wrap items-center gap-2 rounded-2xl bg-white/95 p-2 shadow-lg">
          {showSuggestions && (predictions.length > 0 || isLoading) && (
            <div className="absolute top-full w-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto z-50">
              {isLoading ? (
                <div className="p-3 text-sm text-gray-500">Searching...</div>
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
              handleAddViaAI();
            }}
          >
            + Add via AI
          </button>
        </div>
      </div>
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
                  <button onClick={() => setIsChatOpen(true)}>Confirm</button>
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
        <LocateButton />
      </MapContainer>
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-4">
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
    </div>
  );
}
