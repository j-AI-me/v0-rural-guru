import { NextResponse } from "next/server"
import { sendNewBookingNotifications } from "@/lib/notifications"

export async function POST(request: Request) {
  try {
    const { bookingId } = await request.json()

    if (!bookingId) {
      return NextResponse.json({ error: "Se requiere el ID de la reserva" }, { status: 400 })
    }

    const result = await sendNewBookingNotifications(bookingId)

    if (!result.success) {
      return NextResponse.json({ error: "Error al enviar las notificaciones", details: result }, { status: 500 })
    }

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Error en la API de notificaciones:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
