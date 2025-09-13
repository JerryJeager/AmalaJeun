

export type PriceBand = "$" | "$$" | "$$$";

export type SpotStatus = "verified" | "pending" | "candidate";

export type AmalaSpot = {
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

export type User = {
    id: string 
    email: string 
    name: string 
    avatar_url: string 
    google_id: string
    created_at: string
    last_login_at: string
}