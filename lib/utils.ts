import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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