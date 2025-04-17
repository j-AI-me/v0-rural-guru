import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = getSupabaseServerClient()

    // Check if properties already exist
    const { data: existingProperties, error: checkError } = await supabase.from("properties").select("id")

    if (checkError) {
      throw new Error(`Error checking existing properties: ${checkError.message}`)
    }

    // If properties already exist, don't seed again
    if (existingProperties && existingProperties.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Properties already exist, skipping seed",
        count: existingProperties.length,
      })
    }

    // Seed properties
    const properties = [
      {
        name: "The Auteiro Crown",
        description: "Casa rural en la montaña con vistas y jardín",
        location: "Asturias",
        price: 95,
        max_guests: 4,
        bedrooms: 2,
        beds: 3,
        bathrooms: 1,
        status: "active",
        image_url: "/countryside-cottage.png",
        type: "Casa rural",
        amenities: ["Jardín", "Vistas", "Entorno natural"],
        adapted_mobility: false,
      },
      {
        name: "Maria Manuela Hotel & Spa",
        description: "Hotel moderno con spa en entorno rural",
        location: "Asturias",
        price: 120,
        max_guests: 6,
        bedrooms: 3,
        beds: 4,
        bathrooms: 2,
        status: "active",
        image_url: "/countryside-retreat.png",
        type: "Hotel & Spa",
        amenities: ["Spa", "Moderno", "Entorno rural"],
        adapted_mobility: false,
      },
      {
        name: "El Bricial Hotel",
        description: "Hotel en Asturias, cerca de Covadonga",
        location: "Covadonga",
        price: 85,
        max_guests: 3,
        bedrooms: 1,
        beds: 2,
        bathrooms: 1,
        status: "active",
        image_url: "/covadonga-sanctuary-view.png",
        type: "Hotel",
        amenities: ["Cercano a Covadonga"],
        adapted_mobility: false,
      },
      {
        name: "Casa Azul",
        description: "Casa rural con cenador privado y barbacoa",
        location: "Asturias",
        price: 110,
        max_guests: 5,
        bedrooms: 2,
        beds: 3,
        bathrooms: 2,
        status: "active",
        image_url: "/countryside-cookout.png",
        type: "Casa rural",
        amenities: ["Cenador privado", "Barbacoa"],
        adapted_mobility: false,
      },
      {
        name: "El Pedrueco",
        description: "Casa rural con Wi-Fi, calefacción aerotérmica y placas solares",
        location: "Asturias",
        price: 105,
        max_guests: 4,
        bedrooms: 2,
        beds: 2,
        bathrooms: 1,
        status: "active",
        image_url: "/sustainable-countryside-home.png",
        type: "Casa rural",
        amenities: ["Wi-Fi", "Calefacción aerotérmica", "Placas solares"],
        adapted_mobility: false,
      },
      {
        name: "Balcón del Sueve",
        description: "Apartamentos rurales sostenibles, estándar Passivhaus, vistas a la montaña",
        location: "Sueve",
        price: 100,
        max_guests: 4,
        bedrooms: 2,
        beds: 2,
        bathrooms: 1,
        status: "active",
        image_url: "/mountain-view-balcony.png",
        type: "Apartamentos",
        amenities: ["Sostenibilidad", "Vistas", "Estándar Passivhaus"],
        adapted_mobility: false,
      },
      {
        name: "Casa Jesusa",
        description: "Casas rurales adaptadas para personas con movilidad reducida, de 6, 5 y 4 plazas",
        location: "Asturias",
        price: 115,
        max_guests: 6,
        bedrooms: 3,
        beds: 4,
        bathrooms: 2,
        status: "active",
        image_url: "/accessible-rural-home.png",
        type: "Casa rural",
        amenities: ["Adaptado PMR", "Varias capacidades"],
        adapted_mobility: true,
      },
      {
        name: "Casa la Tenada",
        description: "Casa rural para 4 personas",
        location: "Asturias",
        price: 90,
        max_guests: 4,
        bedrooms: 2,
        beds: 2,
        bathrooms: 1,
        status: "active",
        image_url: "/rural-cottage-garden.png",
        type: "Casa rural",
        amenities: ["Capacidad para 4 personas"],
        adapted_mobility: false,
      },
      {
        name: "Hotel Cerro la Niña",
        description: "Hotel rural con vistas",
        location: "Asturias",
        price: 95,
        max_guests: 2,
        bedrooms: 1,
        beds: 1,
        bathrooms: 1,
        status: "active",
        image_url: "/placeholder.svg?height=300&width=400&query=rural%20hotel%20views",
        type: "Hotel",
        amenities: ["Vistas"],
        adapted_mobility: false,
      },
      {
        name: "Casas Prieto",
        description: "Casas rurales en Asturias",
        location: "Asturias",
        price: 100,
        max_guests: 5,
        bedrooms: 2,
        beds: 3,
        bathrooms: 1,
        status: "active",
        image_url: "/placeholder.svg?height=300&width=400&query=asturias%20rural%20houses",
        type: "Casa rural",
        phone: "985 92 35 78",
        email: "info@casasprieto.com",
        adapted_mobility: false,
      },
      {
        name: "Hoteles La Pasera",
        description: "Hoteles rurales en Asturias",
        location: "Asturias",
        price: 110,
        max_guests: 4,
        bedrooms: 2,
        beds: 2,
        bathrooms: 1,
        status: "active",
        image_url: "/placeholder.svg?height=300&width=400&query=asturias%20rural%20hotels",
        type: "Hotel",
        phone: "985 84 60 21",
        email: "central@hoteleslapasera.com",
        adapted_mobility: false,
      },
    ]

    // Insert properties
    const { data, error } = await supabase.from("properties").insert(properties).select()

    if (error) {
      throw new Error(`Error seeding properties: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      message: "Properties seeded successfully",
      count: data.length,
    })
  } catch (error: any) {
    console.error("Error in seed route:", error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An error occurred while seeding the database",
      },
      { status: 500 },
    )
  }
}
