import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"
import { createReviewSchema, updateReviewSchema } from "@/lib/api/schemas/review"

export async function POST(request: Request) {
  const supabase = getSupabaseServerClient()

  // Verificar autenticación
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
  }

  try {
    const body = await request.json()

    // Validar datos
    try {
      createReviewSchema.parse(body)
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          error: "Datos inválidos",
          details: error.errors,
        },
        { status: 400 },
      )
    }

    const { propertyId, bookingId, rating, comment, images = [] } = body

    // Verificar si el usuario tiene rol de huésped
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ success: false, error: "Error al verificar el usuario" }, { status: 500 })
    }

    if (userData.role !== "guest") {
      return NextResponse.json({ success: false, error: "Solo los huéspedes pueden dejar reseñas" }, { status: 403 })
    }

    // Verificar si el usuario ha reservado esta propiedad (opcional)
    if (bookingId) {
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .select("id, property_id, guest_id, status")
        .eq("id", bookingId)
        .eq("property_id", propertyId)
        .eq("guest_id", session.user.id)
        .single()

      if (bookingError || !booking) {
        return NextResponse.json(
          { success: false, error: "No se encontró la reserva o no tienes permiso" },
          { status: 403 },
        )
      }

      if (booking.status !== "completed") {
        return NextResponse.json(
          { success: false, error: "Solo puedes dejar reseñas para reservas completadas" },
          { status: 400 },
        )
      }
    }

    // Verificar si el usuario ya ha dejado una reseña para esta propiedad
    const { data: existingReview } = await supabase
      .from("reviews")
      .select("id")
      .eq("property_id", propertyId)
      .eq("user_id", session.user.id)
      .maybeSingle()

    let reviewId: string

    if (existingReview) {
      // Actualizar reseña existente
      const { data, error } = await supabase
        .from("reviews")
        .update({
          rating,
          comment,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingReview.id)
        .select()

      if (error) {
        console.error("Error al actualizar la reseña:", error)
        return NextResponse.json({ success: false, error: "Error al actualizar la reseña" }, { status: 500 })
      }

      reviewId = existingReview.id

      // Eliminar imágenes existentes si hay nuevas
      if (images.length > 0) {
        await supabase.from("review_images").delete().eq("review_id", reviewId)
      }
    } else {
      // Crear nueva reseña
      const { data, error } = await supabase
        .from("reviews")
        .insert({
          property_id: propertyId,
          user_id: session.user.id,
          booking_id: bookingId || null,
          rating,
          comment,
        })
        .select()

      if (error) {
        console.error("Error al crear la reseña:", error)
        return NextResponse.json({ success: false, error: "Error al crear la reseña" }, { status: 500 })
      }

      reviewId = data[0].id
    }

    // Guardar imágenes si existen
    if (images.length > 0) {
      const imageRecords = images.map((image_url) => ({
        review_id: reviewId,
        image_url,
      }))

      const { error: imagesError } = await supabase.from("review_images").insert(imageRecords)

      if (imagesError) {
        console.error("Error al guardar las imágenes:", imagesError)
        // No fallamos toda la operación, solo registramos el error
      }
    }

    // Actualizar la calificación promedio de la propiedad
    await updatePropertyRating(supabase, propertyId)

    return NextResponse.json({ success: true, reviewId })
  } catch (error) {
    console.error("Error en la ruta de reseñas:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const supabase = getSupabaseServerClient()

  // Verificar autenticación
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
  }

  try {
    const body = await request.json()

    // Validar datos
    try {
      updateReviewSchema.parse(body)
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          error: "Datos inválidos",
          details: error.errors,
        },
        { status: 400 },
      )
    }

    const { reviewId, rating, comment, images } = body

    // Verificar que la reseña pertenece al usuario
    const { data: review, error: reviewError } = await supabase
      .from("reviews")
      .select("id, property_id")
      .eq("id", reviewId)
      .eq("user_id", session.user.id)
      .single()

    if (reviewError || !review) {
      return NextResponse.json(
        { success: false, error: "No se encontró la reseña o no tienes permiso para editarla" },
        { status: 403 },
      )
    }

    // Actualizar la reseña
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (rating !== undefined) updateData.rating = rating
    if (comment !== undefined) updateData.comment = comment

    const { error: updateError } = await supabase.from("reviews").update(updateData).eq("id", reviewId)

    if (updateError) {
      return NextResponse.json({ success: false, error: "Error al actualizar la reseña" }, { status: 500 })
    }

    // Actualizar imágenes si se proporcionaron
    if (images !== undefined) {
      // Eliminar imágenes existentes
      await supabase.from("review_images").delete().eq("review_id", reviewId)

      // Añadir nuevas imágenes
      if (images.length > 0) {
        const imageRecords = images.map((image_url: string) => ({
          review_id: reviewId,
          image_url,
        }))

        await supabase.from("review_images").insert(imageRecords)
      }
    }

    // Actualizar la calificación promedio de la propiedad
    await updatePropertyRating(supabase, review.property_id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error en la ruta de actualización de reseñas:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url)
  const reviewId = url.searchParams.get("id")

  if (!reviewId) {
    return NextResponse.json({ success: false, error: "ID de reseña no proporcionado" }, { status: 400 })
  }

  const supabase = getSupabaseServerClient()

  // Verificar autenticación
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
  }

  try {
    // Verificar que la reseña pertenece al usuario o el usuario es admin
    const { data: userData } = await supabase.from("users").select("role").eq("id", session.user.id).single()

    const isAdmin = userData?.role === "admin"

    let propertyIdForUpdate: string | undefined

    if (!isAdmin) {
      const { data: review, error: reviewError } = await supabase
        .from("reviews")
        .select("id, property_id")
        .eq("id", reviewId)
        .eq("user_id", session.user.id)
        .single()

      if (reviewError || !review) {
        return NextResponse.json(
          { success: false, error: "No se encontró la reseña o no tienes permiso para eliminarla" },
          { status: 403 },
        )
      }

      // Guardar property_id para actualizar la calificación después
      propertyIdForUpdate = review.property_id
    } else {
      // Si es admin, solo necesitamos el property_id
      const { data: review } = await supabase.from("reviews").select("property_id").eq("id", reviewId).single()

      if (review) {
        propertyIdForUpdate = review.property_id
      }
    }

    // Eliminar imágenes de la reseña
    await supabase.from("review_images").delete().eq("review_id", reviewId)

    // Eliminar la reseña
    const { error: deleteError } = await supabase.from("reviews").delete().eq("id", reviewId)

    if (deleteError) {
      return NextResponse.json({ success: false, error: "Error al eliminar la reseña" }, { status: 500 })
    }

    // Actualizar la calificación promedio de la propiedad
    if (propertyIdForUpdate) {
      await updatePropertyRating(supabase, propertyIdForUpdate)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error en la ruta de eliminación de reseñas:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}

// Función auxiliar para actualizar la calificación promedio de una propiedad
async function updatePropertyRating(supabase: any, propertyId: string) {
  try {
    // Obtener todas las reseñas de la propiedad
    const { data: reviews, error } = await supabase.from("reviews").select("rating").eq("property_id", propertyId)

    if (error) throw error

    if (reviews && reviews.length > 0) {
      // Calcular la calificación promedio
      const totalRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0)
      const averageRating = totalRating / reviews.length

      // Actualizar la propiedad
      await supabase
        .from("properties")
        .update({
          average_rating: averageRating,
          review_count: reviews.length,
          updated_at: new Date().toISOString(),
        })
        .eq("id", propertyId)
    } else {
      // Si no hay reseñas, establecer valores predeterminados
      await supabase
        .from("properties")
        .update({
          average_rating: null,
          review_count: 0,
          updated_at: new Date().toISOString(),
        })
        .eq("id", propertyId)
    }
  } catch (error) {
    console.error("Error al actualizar la calificación de la propiedad:", error)
  }
}
