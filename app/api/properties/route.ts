import { NextResponse } from "next/server"

// This would be replaced with actual database queries in a real application
const properties = [
  {
    id: 1,
    name: "Cabaña en Cangas de Onís",
    description: "Hermosa cabaña de madera situada en un entorno natural privilegiado cerca de Cangas de Onís.",
    location: "Cangas de Onís",
    price: 95,
    rating: 4.8,
    reviews: 124,
    images: ["/placeholder.svg?height=600&width=800&query=wooden cabin exterior in Asturias"],
    host: {
      id: 1,
      name: "María García",
    },
    status: "active",
  },
  {
    id: 2,
    name: "Casa rural en Covadonga",
    description: "Encantadora casa rural con vistas a los Picos de Europa, cerca del Santuario de Covadonga.",
    location: "Covadonga",
    price: 120,
    rating: 4.9,
    reviews: 87,
    images: ["/covadonga-countryside-home.png"],
    host: {
      id: 2,
      name: "Juan Pérez",
    },
    status: "active",
  },
]

export async function GET() {
  return NextResponse.json(properties)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.location || !body.price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real application, you would save to a database here
    const newProperty = {
      id: properties.length + 1,
      ...body,
      status: "pending", // New properties start as pending for admin approval
      rating: 0,
      reviews: 0,
    }

    // Add to our mock database
    properties.push(newProperty)

    return NextResponse.json(newProperty, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 })
  }
}
