import { getSupabaseBrowserClient } from "@/lib/supabase-client"
import type { Booking } from "@/types/database"

export async function createBooking(booking: Omit<Booking, "id" | "created_at" | "updated_at">) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase.from("bookings").insert([booking]).select()

  if (error) {
    console.error("Error creating booking:", error)
    throw error
  }

  return data[0]
}

export async function getUserBookings(userId: string) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      properties!inner(*),
      property_images!inner(*)
    `)
    .eq("guest_id", userId)
    .eq("property_images.is_main", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user bookings:", error)
    return []
  }

  return data
}

export async function getHostBookings(hostId: string) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      properties!inner(*),
      property_images!inner(*),
      users!inner(*)
    `)
    .eq("properties.host_id", hostId)
    .eq("property_images.is_main", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching host bookings:", error)
    return []
  }

  return data
}

export async function updateBookingStatus(bookingId: string, status: Booking["status"]) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("bookings")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", bookingId)
    .select()

  if (error) {
    console.error("Error updating booking status:", error)
    throw error
  }

  return data[0]
}

export async function updatePaymentStatus(
  bookingId: string,
  paymentStatus: Booking["payment_status"],
  paymentId?: string,
) {
  const supabase = getSupabaseBrowserClient()

  const updateData: any = {
    payment_status: paymentStatus,
    updated_at: new Date().toISOString(),
  }

  if (paymentId) {
    updateData.payment_id = paymentId
  }

  const { data, error } = await supabase.from("bookings").update(updateData).eq("id", bookingId).select()

  if (error) {
    console.error("Error updating payment status:", error)
    throw error
  }

  return data[0]
}
