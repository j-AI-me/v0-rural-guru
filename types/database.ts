// Definición simplificada para evitar errores de tipo
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      [key: string]: {
        Row: any
        Insert: any
        Update: any
      }
    }
    Views: {
      [key: string]: {
        Row: any
      }
    }
    Functions: {
      [key: string]: any
    }
    Enums: {
      user_role: "admin" | "host" | "guest"
      property_status: "pending" | "active" | "inactive" | "rejected"
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      payment_status: "pending" | "paid" | "refunded" | "failed"
    }
  }
}

export type User = {
  id: string
  email: string
  full_name: string | null
  role: Database["public"]["Enums"]["user_role"]
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type Property = {
  id: string
  name: string
  description: string | null
  location: string
  address: string | null
  price: number
  max_guests: number
  bedrooms: number
  beds: number
  bathrooms: number
  latitude: number | null
  longitude: number | null
  host_id: string
  status: Database["public"]["Enums"]["property_status"]
  average_rating: number | null
  review_count: number
  created_at: string
  updated_at: string
  type: string | null
  amenities: string[] | null
  adapted_mobility: boolean | null
  phone: string | null
  email: string | null
  [key: string]: any
}

export type Booking = {
  id: string
  property_id: string
  guest_id: string
  check_in: string
  check_out: string
  guests: number
  total_price: number
  status: Database["public"]["Enums"]["booking_status"]
  payment_status: Database["public"]["Enums"]["payment_status"]
  payment_id: string | null
  created_at: string
  updated_at: string
}
