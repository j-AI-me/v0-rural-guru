// This is a mock implementation of email service
// In a real application, you would use SendGrid or similar

interface EmailOptions {
  to: string
  subject: string
  text?: string
  html?: string
}

export async function sendEmail(options: EmailOptions) {
  // Mock implementation
  console.log(`Sending email to ${options.to} with subject: ${options.subject}`)

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    success: true,
    messageId: `msg_${Math.random().toString(36).substring(2, 15)}`,
  }
}

export async function sendBookingConfirmation(
  email: string,
  bookingId: string,
  propertyName: string,
  checkIn: Date,
  checkOut: Date,
) {
  return sendEmail({
    to: email,
    subject: `Confirmación de reserva: ${propertyName}`,
    html: `
      <h1>¡Reserva confirmada!</h1>
      <p>Tu reserva para ${propertyName} ha sido confirmada.</p>
      <p><strong>Fechas:</strong> ${checkIn.toLocaleDateString()} - ${checkOut.toLocaleDateString()}</p>
      <p><strong>Código de reserva:</strong> ${bookingId}</p>
    `,
  })
}

export async function sendHostNotification(
  email: string,
  guestName: string,
  propertyName: string,
  checkIn: Date,
  checkOut: Date,
) {
  return sendEmail({
    to: email,
    subject: `Nueva reserva para ${propertyName}`,
    html: `
      <h1>¡Nueva reserva!</h1>
      <p>${guestName} ha reservado ${propertyName}.</p>
      <p><strong>Fechas:</strong> ${checkIn.toLocaleDateString()} - ${checkOut.toLocaleDateString()}</p>
    `,
  })
}
