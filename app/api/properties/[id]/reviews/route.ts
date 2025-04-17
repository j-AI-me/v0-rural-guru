import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const propertyId = params.id

  if (!propertyId) {
    return NextResponse.json({ error: "ID de propiedad no proporcionado" }, { status: 400 })
  }

  const supabase = getSupabaseServerClient()

  try {
    // Obtener reseñas con información del usuario
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select(`
        id,
        rating,
        comment,
        created_at,
        updated_at,
        user_id,
        users (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq("property_id", propertyId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error al obtener reseñas:", error)
      return NextResponse.json({ error: "Error al obtener reseñas" }, { status: 500 })
    }

    // Obtener imágenes para cada reseña
    const reviewIds = reviews.map((review) => review.id)

    let reviewImages = []
    if (reviewIds.length > 0) {
      const { data: images, error: imagesError } = await supabase
        .from("review_images")
        .select("review_id, image_url")
        .in("review_id", reviewIds)

      if (!imagesError) {
        reviewImages = images
      }
    }

    // Formatear los datos para el cliente
    const formattedReviews = reviews.map((review) => {
      // Filtrar imágenes para esta reseña
      const images = reviewImages.filter((img) => img.review_id === review.id).map((img) => img.image_url)

      return {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        created_at: review.created_at,
        updated_at: review.updated_at,
        images: images,
        user: {
          id: review.users?.id,
          name: review.users?.full_name || "Usuario", // Cambiado de name a full_name
          avatar_url: review.users?.avatar_url,
        },
      }
    })

    return NextResponse.json(formattedReviews)
  } catch (error) {
    console.error("Error en la ruta de reseñas:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
