

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

export type AmalaSpotNew = {
  id: number
  name: string 
  address: string
  latitude: number 
  longitude: number 
  user_id: string
  added_by: string 
  opening_time: string
  closing_time: string
  price: number
  dine_in: boolean 
  source: string
  status: string
  verified: boolean 
  images: string[]
  created_at: string
  updated_at: string
}

export type User = {
    id: string 
    email: string 
    name: string 
    avatar_url: string 
    google_id: string
    created_at: string
    last_login_at: string
}

export interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface PlaceDetails {
  location: {
    lat: () => number;
    lng: () => number;
  };

  formatted_address: string;
  name: string;
}

export type Review =  {
  id: number
  spot_id: number
  user_name: string
  rating: number 
  comment: string
  created_at: string
  updated_at: string
}