import { NextResponse } from "next/server"

// This would be replaced with actual database queries in a real application
const bookings = [
  {
    id: 1,
    propertyId: 1,
    propertyName: "Cabaña en Cangas de Onís",
    guestId: 3,
    guestName: "Laura Martínez",
    checkIn: "2023-04-10",
    checkOut: "2023-04-15",
    guests: 2,
    totalPrice: 475,
    status: "confirmed",
    paymentStatus: "paid",
  },
  {
    id: 2,
    propertyId: 3,
    propertyName: "Apartamento en Llanes",
    guestId: 4,
    guestName: "Pedro Sánchez",
    checkIn: "2023-04-12",
    checkOut: "2023-04-14",
    guests: 2,
    totalPrice: 170,
    status: "pending",
    paymentStatus: "pending",
  },
]

export async function GET() {
  return NextResponse.json(bookings)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.propertyId || !body.guestId || !body.checkIn || !body.checkOut || !body.guests) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real application, you would:
    // 1. Check property availability for the requested dates
    // 2. Calculate the total price
    // 3. Create a transaction to lock the dates and create the booking

    const newBooking = {
      id: bookings.length + 1,
      ...body,
      status: "pending",
      paymentStatus: "pending",
    }

    // Add to our mock database
    bookings.push(newBooking)

    return NextResponse.json(newBooking, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
