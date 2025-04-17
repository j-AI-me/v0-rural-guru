import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields for check-in
    if (!body.bookingId || !body.guests || !body.guests.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate guest information
    for (const guest of body.guests) {
      if (!guest.name || !guest.documentType || !guest.documentNumber || !guest.nationality || !guest.birthDate) {
        return NextResponse.json({ error: "Missing required guest information" }, { status: 400 })
      }
    }

    // In a real application, you would:
    // 1. Store the guest information securely
    // 2. Send the information to the police/civil guard API (e.g., CheKin or SES.Hospedajes)
    // 3. Update the booking status

    // Mock successful check-in
    return NextResponse.json({
      success: true,
      message: "Check-in completed successfully",
      registrationId: "REG" + Math.floor(Math.random() * 1000000),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process check-in" }, { status: 500 })
  }
}
