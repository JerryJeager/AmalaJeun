import { clsx, type ClassValue } from "clsx"
import { LatLngTuple } from "leaflet";
import { twMerge } from "tailwind-merge"
import L from "leaflet";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isSpotOpenNow(openingTime: string, closingTime: string): boolean {
  const defaultOpeningTime = openingTime || "09:00";
  const defaultClosingTime = closingTime || "17:00";

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes

  const [openHour, openMin] = defaultOpeningTime.split(":").map(Number);
  const [closeHour, closeMin] = defaultClosingTime.split(":").map(Number);

  const openTimeMinutes = openHour * 60 + openMin;
  const closeTimeMinutes = closeHour * 60 + closeMin;

  // Handle cases where closing time is next day (e.g., 23:00 - 02:00)
  if (closeTimeMinutes < openTimeMinutes) {
    return currentTime >= openTimeMinutes || currentTime <= closeTimeMinutes;
  }

  return currentTime >= openTimeMinutes && currentTime <= closeTimeMinutes;
}


export function GetDistance(pos1: LatLngTuple, pos2: LatLngTuple): number{
  const latLng1 = L.latLng(pos1[0], pos1[1]);
  const latLng2 = L.latLng(pos2[0], pos2[1]);
  return latLng1.distanceTo(latLng2);
}