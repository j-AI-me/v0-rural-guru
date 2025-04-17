import { getSupabaseServerClient } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StarIcon, PencilIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

async function getUserReviews() {
  const supabase = getSupabaseServerClient()

  // Verificar autenticación
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Obtener reseñas del usuario
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select(`
      id,
      rating,
      comment,
      created_at,
      property_id,
      properties (
        id,
        title,
        location,
        image_url
      )
    `)
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error al obtener reseñas:", error)
    return []
  }

  return reviews
}

// Obtener reservas completadas sin reseñas
async function getPendingReviews() {
  const supabase = getSupabaseServerClient()

  // Verificar autenticación
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return []
  }

  // Obtener reservas completadas
  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      id,
      property_id,
      check_out,
      properties (
        id,
        title,
        location,
        image_url
      )
    `)
    .eq("guest_id", session.user.id)
    .eq("status", "completed")
    .order("check_out", { ascending: false })

  if (!bookings || bookings.length === 0) {
    return []
  }

  // Obtener reseñas existentes
  const { data: reviews } = await supabase.from("reviews").select("property_id").eq("user_id", session.user.id)

  const reviewedPropertyIds = reviews ? reviews.map((r) => r.property_id) : []

  // Filtrar reservas sin reseñas
  return bookings.filter((booking) => !reviewedPropertyIds.includes(booking.property_id))
}

export default async function GuestReviewsPage() {
  const reviews = await getUserReviews()
  const pendingReviews = await getPendingReviews()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Mis reseñas</h1>

      {pendingReviews.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Propiedades pendientes de reseñar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingReviews.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={booking.properties?.image_url || "/placeholder.svg?height=200&width=400&query=property"}
                    alt={booking.properties?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{booking.properties?.title || "Propiedad"}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {booking.properties?.location || "Ubicación no disponible"}
                  </p>
                  <p className="text-sm mb-4">
                    Te hospedaste aquí hace{" "}
                    {formatDistanceToNow(new Date(booking.check_out), {
                      addSuffix: false,
                      locale: es,
                    })}
                  </p>
                  <Link href={`/properties/${booking.property_id}#review`}>
                    <Button className="w-full">Dejar reseña</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Mis reseñas ({reviews.length})</h2>

      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Aún no has dejado reseñas</h3>
          <p className="text-muted-foreground mb-4">
            Cuando dejes reseñas en las propiedades donde te hospedaste, aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">{review.properties?.title || "Propiedad"}</h3>
                    <p className="text-sm text-muted-foreground">
                      {review.properties?.location || "Ubicación no disponible"}
                    </p>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700">{review.comment}</p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(review.created_at), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </span>
                  <Link href={`/properties/${review.property_id}#review`}>
                    <Button variant="outline" size="sm">
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
