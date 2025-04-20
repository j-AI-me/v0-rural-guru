import { Resend } from "resend"

// Inicializar Resend con la API key
if (!process.env.RESEND_API_KEY) {
  console.warn("ADVERTENCIA: RESEND_API_KEY no está definida. Los emails no se enviarán correctamente.")
}

const resend = new Resend(process.env.RESEND_API_KEY || "")

// Tipos para las plantillas de email
type BookingEmailProps = {
  guestName: string
  propertyName: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  bookingId: string
  guestEmail?: string // Add guestEmail as optional
}

type HostEmailProps = {
  hostName: string
  guestName: string
  propertyName: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  bookingId: string
}

// Función para enviar email de confirmación al huésped
export async function sendBookingConfirmationEmail({
  guestName,
  propertyName,
  checkIn,
  checkOut,
  guests,
  totalPrice,
  bookingId,
  guestEmail,
}: BookingEmailProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: "RuralGuru <reservas@ruralguru.com>",
      to: [guestEmail || "guest@example.com"], // Usar el email real del huésped si está disponible
      subject: `Confirmación de reserva - ${propertyName}`,
      html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #000; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">RuralGuru</h1>
    </div>
    <div style="padding: 20px; border: 1px solid #e5e5e5; border-top: none;">
      <h2>¡Gracias por tu reserva, ${guestName}!</h2>
      <p>Tu reserva en <strong>${propertyName}</strong> ha sido confirmada.</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Detalles de la reserva:</h3>
        <p><strong>Número de reserva:</strong> ${bookingId}</p>
        <p><strong>Fecha de entrada:</strong> ${checkIn}</p>
        <p><strong>Fecha de salida:</strong> ${checkOut}</p>
        <p><strong>Número de huéspedes:</strong> ${guests}</p>
        <p><strong>Precio total:</strong> ${totalPrice}€</p>
      </div>
      
      <p>Si tienes alguna pregunta sobre tu reserva, no dudes en contactarnos.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center; color: #777; font-size: 12px;">
        <p>Este email ha sido enviado por RuralGuru.</p>
        <p>© ${new Date().getFullYear()} RuralGuru. Todos los derechos reservados.</p>
      </div>
    </div>
  </div>
`,
    })

    if (error) {
      console.error("Error al enviar email de confirmación:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error al enviar email de confirmación:", error)
    return { success: false, error }
  }
}

// Función para enviar notificación al anfitrión
export async function sendHostNotificationEmail({
  hostName,
  guestName,
  propertyName,
  checkIn,
  checkOut,
  guests,
  totalPrice,
  bookingId,
}: HostEmailProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: "RuralGuru <reservas@ruralguru.com>",
      to: ["host@example.com"], // En producción, esto sería el email real del anfitrión
      subject: `Nueva reserva - ${propertyName}`,
      html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #000; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">RuralGuru</h1>
    </div>
    <div style="padding: 20px; border: 1px solid #e5e5e5; border-top: none;">
      <h2>¡Has recibido una nueva reserva, ${hostName}!</h2>
      <p><strong>${guestName}</strong> ha reservado tu propiedad <strong>${propertyName}</strong>.</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Detalles de la reserva:</h3>
        <p><strong>Número de reserva:</strong> ${bookingId}</p>
        <p><strong>Fecha de entrada:</strong> ${checkIn}</p>
        <p><strong>Fecha de salida:</strong> ${checkOut}</p>
        <p><strong>Número de huéspedes:</strong> ${guests}</p>
        <p><strong>Precio total:</strong> ${totalPrice}€</p>
      </div>
      
      <p>Puedes gestionar esta reserva desde tu panel de control.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center; color: #777; font-size: 12px;">
        <p>Este email ha sido enviado por RuralGuru.</p>
        <p>© ${new Date().getFullYear()} RuralGuru. Todos los derechos reservados.</p>
      </div>
    </div>
  </div>
`,
    })

    if (error) {
      console.error("Error al enviar notificación al anfitrión:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error al enviar notificación al anfitrión:", error)
    return { success: false, error }
  }
}

// Función para enviar email de cancelación
export async function sendBookingCancellationEmail({
  guestName,
  propertyName,
  checkIn,
  checkOut,
  bookingId,
}: Omit<BookingEmailProps, "guests" | "totalPrice" | "guestEmail">) {
  try {
    const { data, error } = await resend.emails.send({
      from: "RuralGuru <reservas@ruralguru.com>",
      to: ["guest@example.com"], // En producción, esto sería el email real del huésped
      subject: `Cancelación de reserva - ${propertyName}`,
      html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #000; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">RuralGuru</h1>
    </div>
    <div style="padding: 20px; border: 1px solid #e5e5e5; border-top: none;">
      <h2>Reserva cancelada</h2>
      <p>Hola ${guestName},</p>
      <p>Tu reserva en <strong>${propertyName}</strong> ha sido cancelada.</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Detalles de la reserva cancelada:</h3>
        <p><strong>Número de reserva:</strong> ${bookingId}</p>
        <p><strong>Fecha de entrada:</strong> ${checkIn}</p>
        <p><strong>Fecha de salida:</strong> ${checkOut}</p>
      </div>
      
      <p>Si tienes alguna pregunta sobre esta cancelación, no dudes en contactarnos.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center; color: #777; font-size: 12px;">
        <p>Este email ha sido enviado por RuralGuru.</p>
        <p>© ${new Date().getFullYear()} RuralGuru. Todos los derechos reservados.</p>
      </div>
    </div>
  </div>
`,
    })

    if (error) {
      console.error("Error al enviar email de cancelación:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error al enviar email de cancelación:", error)
    return { success: false, error }
  }
}
