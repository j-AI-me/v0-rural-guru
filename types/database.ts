export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, "created_at" | "updated_at">
        Update: Partial<Omit<User, "id" | "created_at" | "updated_at">>
      }
      properties: {
        Row: Property
        Insert: Omit<Property, "created_at" | "updated_at">
        Update: Partial<Omit<Property, "id" | "created_at" | "updated_at">>
      }
      property_images: {
        Row: PropertyImage
        Insert: Omit<PropertyImage, "created_at">
        Update: Partial<Omit<PropertyImage, "id" | "created_at">>
      }
      property_amenities: {
        Row: PropertyAmenity
        Insert: Omit<PropertyAmenity, "created_at">
        Update: Partial<Omit<PropertyAmenity, "id" | "created_at">>
      }
      bookings: {
        Row: Booking
        Insert: Omit<Booking, "created_at" | "updated_at">
        Update: Partial<Omit<Booking, "id" | "created_at" | "updated_at">>
      }
      check_ins: {
        Row: CheckIn
        Insert: Omit<CheckIn, "created_at" | "updated_at">
        Update: Partial<Omit<CheckIn, "id" | "created_at" | "updated_at">>
      }
      guest_identities: {
        Row: GuestIdentity
        Insert: Omit<GuestIdentity, "created_at">
        Update: Partial<Omit<GuestIdentity, "id" | "created_at">>
      }
      reviews: {
        Row: Review
        Insert: Omit<Review, "created_at" | "updated_at">
        Update: Partial<Omit<Review, "id" | "created_at" | "updated_at">>
      }
      review_images: {
        Row: ReviewImage
        Insert: Omit<ReviewImage, "created_at">
        Update: Partial<Omit<ReviewImage, "id" | "created_at">>
      }
      messages: {
        Row: Message
        Insert: Omit<Message, "created_at">
        Update: Partial<Omit<Message, "id" | "created_at">>
      }
      conversations: {
        Row: Conversation
        Insert: Omit<Conversation, "created_at" | "updated_at">
        Update: Partial<Omit<Conversation, "id" | "created_at" | "updated_at">>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
}

export type PropertyImage = {
  id: string
  property_id: string
  url: string
  is_main: boolean
  created_at: string
}

export type PropertyAmenity = {
  id: string
  property_id: string
  name: string
  created_at: string
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

export type CheckIn = {
  id: string
  booking_id: string
  completed: boolean
  sent_to_authorities: boolean
  registration_id: string | null
  created_at: string
  updated_at: string
}

export type GuestIdentity = {
  id: string
  check_in_id: string
  name: string
  surname: string
  document_type: string
  document_number: string
  nationality: string
  birth_date: string
  created_at: string
}

export type Review = {
  id: string
  property_id: string
  user_id: string
  booking_id: string | null
  rating: number
  comment: string | null
  created_at: string
  updated_at: string
}

export type ReviewImage = {
  id: string
  review_id: string
  image_url: string
  created_at: string
}

export type Message = {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  read: boolean
  created_at: string
}

export type Conversation = {
  id: string
  property_id: string | null
  booking_id: string | null
  host_id: string
  guest_id: string
  created_at: string
  updated_at: string
}
