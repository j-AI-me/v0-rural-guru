import { getSupabaseServerClient } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StarIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

async function getHostReviews() {
  const supabase = getSupabaseServerClient()

  // Verificar autenticación
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Obtener propiedades del anfitrión
  const { data: properties } = await supabase.from("properties").select("id").eq("host_id", session.user.id)

  if (!properties || properties.length === 0) {
    return []
  }

  // Obtener reseñas para todas las propiedades del anfitrión
  const propertyIds = properties.map((property) => property.id)

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
        location
      ),
      users (
        id,
        name,
        avatar_url
      )
    `)
    .in("property_id", propertyIds)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error al obtener reseñas:", error)
    return []
  }

  return reviews
}

export default async function HostReviewsPage() {
  const reviews = await getHostReviews()

  // Calcular la calificación promedio
  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Reseñas de tus propiedades</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total de reseñas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{reviews.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Calificación promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <p className="text-3xl font-bold mr-2">{averageRating.toFixed(1)}</p>
              <StarIcon className="h-6 w-6 text-yellow-500 fill-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">Aún no tienes reseñas</h2>
          <p className="text-muted-foreground mb-4">
            Cuando los huéspedes dejen reseñas en tus propiedades, aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="mr-4">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {review.users?.avatar_url ? (
                          <img
                            src={review.users.avatar_url || "/placeholder.svg"}
                            alt={review.users.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-semibold">{review.users?.name?.charAt(0) || "?"}</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold">{review.users?.name || "Usuario"}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(review.created_at), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </p>
                    </div>
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

                <div className="pt-4 border-t">
                  <Link
                    href={`/properties/${review.property_id}`}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    {review.properties?.title || "Ver propiedad"}
                    {review.properties?.location && (
                      <span className="text-muted-foreground ml-2">({review.properties.location})</span>
                    )}
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
