export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          long_description: string | null
          location: string
          price: number
          bedrooms: number
          bathrooms: number
          capacity: number
          amenities: string[] | null
          images: Json[] | null
          status: string
          user_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          long_description?: string | null
          location: string
          price: number
          bedrooms: number
          bathrooms: number
          capacity: number
          amenities?: string[] | null
          images?: Json[] | null
          status?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          long_description?: string | null
          location?: string
          price?: number
          bedrooms?: number
          bathrooms?: number
          capacity?: number
          amenities?: string[] | null
          images?: Json[] | null
          status?: string
          user_id?: string | null
        }
      }
      bookings: {
        Row: {
          id: string
          created_at: string
          property_id: string
          user_id: string
          check_in: string
          check_out: string
          guests: number
          total_price: number
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          property_id: string
          user_id: string
          check_in: string
          check_out: string
          guests: number
          total_price: number
          status?: string
        }
        Update: {
          id?: string
          created_at?: string
          property_id?: string
          user_id?: string
          check_in?: string
          check_out?: string
          guests?: number
          total_price?: number
          status?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          full_name: string | null
          avatar_url: string | null
          email: string | null
          phone: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          email?: string | null
          phone?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          email?: string | null
          phone?: string | null
        }
      }
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
