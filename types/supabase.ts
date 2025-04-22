export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          name: string
          description: string
          location: string
          address: string
          price: number
          max_guests: number
          bedrooms: number
          beds: number
          bathrooms: number
          host_id: string
          status: string
          created_at: string
          updated_at: string
          latitude: number | null
          longitude: number | null
          avg_rating: number | null
        }
        Insert: {
          id?: string
          name: string
          description: string
          location: string
          address?: string
          price: number
          max_guests: number
          bedrooms: number
          beds: number
          bathrooms: number
          host_id: string
          status?: string
          created_at?: string
          updated_at?: string
          latitude?: number | null
          longitude?: number | null
          avg_rating?: number | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          location?: string
          address?: string
          price?: number
          max_guests?: number
          bedrooms?: number
          beds?: number
          bathrooms?: number
          host_id?: string
          status?: string
          created_at?: string
          updated_at?: string
          latitude?: number | null
          longitude?: number | null
          avg_rating?: number | null
        }
      }
      reviews: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          property_id: string
          user_id: string
          rating: number
          comment: string | null
          response: string | null
          response_date: string | null
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          property_id: string
          user_id: string
          rating: number
          comment?: string | null
          response?: string | null
          response_date?: string | null
          status?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          property_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          response?: string | null
          response_date?: string | null
          status?: string
        }
      }
      // Otras tablas existentes...
      bookings: {
        Row: {
          id: string
          property_id: string
          guest_id: string
          check_in: string
          check_out: string
          guests: number
          total_price: number
          status: string
          payment_status: string
          payment_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          guest_id: string
          check_in: string
          check_out: string
          guests: number
          total_price: number
          status?: string
          payment_status?: string
          payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          guest_id?: string
          check_in?: string
          check_out?: string
          guests?: number
          total_price?: number
          status?: string
          payment_status?: string
          payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Otras tablas...
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
