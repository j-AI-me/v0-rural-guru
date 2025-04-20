import { NextResponse } from "next/server"
import { sendNewBookingNotifications } from "@/lib/notifications"

export async function POST(request: Request) {
  try {
    // Validar que el cuerpo de la solicitud sea JSON válido
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json({ error: "Formato de solicitud inválido" }, { status: 400 })
    }

    const { bookingId } = body

    // Validar el ID de la reserva
    if (!bookingId || typeof bookingId !== "string") {
      return NextResponse.json({ error: "Se requiere un ID de reserva válido" }, { status: 400 })
    }

    // Enviar notificaciones
    const result = await sendNewBookingNotifications(bookingId)

    if (!result.success) {
      console.error("Error al enviar notificaciones:", result)
      return NextResponse.json(
        {
          error: "Error al enviar las notificaciones",
          details: result,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Error en la API de notificaciones:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
