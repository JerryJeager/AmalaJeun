"use client"

import { PlaceDetails, PlacePrediction } from "@/types/type";
import { useEffect, useState } from "react";


export function useGooglePlaces() {
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