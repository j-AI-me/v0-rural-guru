import { createServerClient } from "@/lib/supabase"
import { sendBookingConfirmationEmail, sendHostNotificationEmail, sendBookingCancellationEmail } from "@/lib/email"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Función para obtener los datos necesarios para las notificaciones
async function getBookingNotificationData(bookingId: string) {
  const supabase = createServerClient()

  // Obtener los datos de la reserva, incluyendo la propiedad y los perfiles
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      property:properties(*),
      guest:profiles!bookings_guest_id_fkey(*)
    `,
    )
    .eq("id", bookingId)
    .single()

  if (error || !data) {
    console.error("Error al obtener datos para notificación:", error)
    return null
  }

  // Obtener el perfil del anfitrión
  const { data: hostData, error: hostError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.property.user_id)
    .single()

  if (hostError) {
    console.error("Error al obtener datos del anfitrión:", hostError)
  }

  // Formatear fechas
  const checkIn = format(new Date(data.check_in), "d 'de' MMMM 'de' yyyy", { locale: es })
  const checkOut = format(new Date(data.check_out), "d 'de' MMMM 'de' yyyy", { locale: es })

  return {
    booking: data,
    property: data.property,
    guest: data.guest,
    host: hostData || null,
    formattedDates: {
      checkIn,
      checkOut,
    },
  }
}

// Función para enviar notificaciones de nueva reserva
export async function sendNewBookingNotifications(bookingId: string) {
  const data = await getBookingNotificationData(bookingId)

  if (!data) {
    return { success: false, error: "No se pudieron obtener los datos de la reserva" }
  }

  const { booking, property, guest, host, formattedDates } = data

  // Enviar email al huésped
  const guestEmail = await sendBookingConfirmationEmail({
    guestName: guest.full_name || "Estimado cliente",
    propertyName: property.title,
    checkIn: formattedDates.checkIn,
    checkOut: formattedDates.checkOut,
    guests: booking.guests,
    totalPrice: booking.total_price,
    bookingId: booking.id,
  })

  // Enviar email al anfitrión
  const hostEmail = await sendHostNotificationEmail({
    hostName: host?.full_name || "Estimado anfitrión",
    guestName: guest.full_name || "Un cliente",
    propertyName: property.title,
    checkIn: formattedDates.checkIn,
    checkOut: formattedDates.checkOut,
    guests: booking.guests,
    totalPrice: booking.total_price,
    bookingId: booking.id,
  })

  return {
    success: guestEmail.success || hostEmail.success,
    guestEmail,
    hostEmail,
  }
}

// Función para enviar notificaciones de cancelación
export async function sendCancellationNotifications(bookingId: string) {
  const data = await getBookingNotificationData(bookingId)

  if (!data) {
    return { success: false, error: "No se pudieron obtener los datos de la reserva" }
  }

  const { property, guest, formattedDates } = data

  // Enviar email de cancelación al huésped
  const guestEmail = await sendBookingCancellationEmail({
    guestName: guest.full_name || "Estimado cliente",
    propertyName: property.title,
    checkIn: formattedDates.checkIn,
    checkOut: formattedDates.checkOut,
    bookingId: bookingId,
  })

  return {
    success: guestEmail.success,
    guestEmail,
  }
}
