"use client"

import { useState, useEffect, memo } from "react"
import { Star, MessageSquare, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useAuth } from "@/components/auth/auth-provider"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { ReviewForm } from "./review-form"
import { ReviewResponse } from "./review-response"
import { useMemoizedCallback, useMemoized } from "@/hooks/use-memoized"
import { OptimizedImage } from "@/components/ui/optimized-image"

interface ReviewListProps {
  propertyId: string
}

interface Review {
  id: string
  created_at: string
  rating: number
  comment: string
  response: string | null
  response_date: string | null
  user: {
    id: string
    full_name: string
    avatar_url: string
  }
}

// Componente de revisión individual memoizado
const ReviewItem = memo(({ review }: { review: Review }) => {
  return (
    <div className="space-y-4 pb-6 border-b last:border-0">
      <div className="flex items-center gap-3">
        <OptimizedImage
          src={review.user.avatar_url || "/placeholder.svg"}
          alt={review.user.full_name}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div>
          <div className="font-medium">{review.user.full_name}</div>
          <div className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(review.created_at), {
              addSuffix: true,
              locale: es,
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-yellow-500" : ""}`} />
        ))}
      </div>

      <p className="text-gray-700">{review.comment}</p>

      <div className="flex items-center gap-2 text-gray-500">
        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
          <ThumbsUp className="h-4 w-4 mr-1" />
          <span>Útil</span>
        </Button>
      </div>

      {/* Respuesta del propietario */}
      {review.response && <ReviewResponse response={review.response} responseDate={review.response_date} />}
    </div>
  )
})
ReviewItem.displayName = "ReviewItem"

function ReviewListComponent({ propertyId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [averageRating, setAverageRating] = useState<number | null>(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [userHasReviewed, setUserHasReviewed] = useState(false)
  const { user } = useAuth()

  const supabase = getSupabaseBrowserClient()

  // Memoizar la función de carga de revisiones
  const loadReviews = useMemoizedCallback(async () => {
    try {
      setIsLoading(true)

      // Obtener valoraciones con información del usuario
      const { data: reviewsData, error } = await supabase
        .from("reviews")
        .select(`
          id, 
          created_at, 
          rating, 
          comment, 
          response, 
          response_date,
          user_id,
          profiles:user_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq("property_id", propertyId)
        .eq("status", "published")
        .order("created_at", { ascending: false })

      if (error) throw error

      // Formatear los datos para el componente
      const formattedReviews = reviewsData.map((review) => ({
        id: review.id,
        created_at: review.created_at,
        rating: review.rating,
        comment: review.comment || "",
        response: review.response,
        response_date: review.response_date,
        user: {
          id: review.profiles?.id || "",
          full_name: review.profiles?.full_name || "Usuario anónimo",
          avatar_url: review.profiles?.avatar_url || "/vibrant-street-market.png",
        },
      }))

      setReviews(formattedReviews)

      // Calcular valoración media
      if (formattedReviews.length > 0) {
        const sum = formattedReviews.reduce((acc, review) => acc + review.rating, 0)
        setAverageRating(sum / formattedReviews.length)
      }

      // Verificar si el usuario actual ya ha dejado una valoración
      if (user) {
        const hasReviewed = reviewsData.some((review) => review.user_id === user.id)
        setUserHasReviewed(hasReviewed)
      }
    } catch (error) {
      console.error("Error al cargar las valoraciones:", error)
    } finally {
      setIsLoading(false)
    }
  }, [propertyId, supabase, user])

  // Cargar valoraciones
  useEffect(() => {
    loadReviews()
  }, [loadReviews])

  // Función para añadir una nueva valoración
  const handleAddReview = useMemoizedCallback(
    (newReview: any) => {
      setReviews((prev) => [newReview, ...prev])
      setUserHasReviewed(true)
      setShowReviewForm(false)

      // Recalcular la valoración media
      const sum = [...reviews, newReview].reduce((acc, review) => acc + review.rating, 0)
      setAverageRating(sum / (reviews.length + 1))
    },
    [reviews],
  )

  // Memoizar las revisiones mostradas
  const displayedReviews = useMemoized(() => {
    return showAllReviews ? reviews : reviews.slice(0, 3)
  }, [reviews, showAllReviews])

  // Renderizar un elemento de la lista
  const renderReviewItem = useMemoizedCallback((review: Review) => {
    return <ReviewItem review={review} />
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            <span>
              {averageRating ? averageRating.toFixed(1) : "Sin valoraciones"}
              {reviews.length > 0 && ` · ${reviews.length} ${reviews.length === 1 ? "valoración" : "valoraciones"}`}
            </span>
          </div>
        </h2>

        {user && !userHasReviewed && (
          <Button
            variant="outline"
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="flex items-center gap-2"
          >
            <Star className="h-4 w-4" />
            <span>Valorar</span>
          </Button>
        )}
      </div>

      {showReviewForm && (
        <ReviewForm propertyId={propertyId} onReviewAdded={handleAddReview} onCancel={() => setShowReviewForm(false)} />
      )}

      {isLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200" />
                <div>
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-3 w-24 bg-gray-200 rounded mt-2" />
                </div>
              </div>
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">Sin valoraciones todavía</h3>
          <p className="mt-1 text-gray-500">Sé el primero en valorar esta propiedad.</p>
        </div>
      ) : (
        <>
          <div className="space-y-6 max-h-[600px] overflow-auto">
            {displayedReviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>

          {reviews.length > 3 && !showAllReviews && (
            <Button variant="outline" onClick={() => setShowAllReviews(true)} className="mt-4">
              Mostrar todas las valoraciones ({reviews.length})
            </Button>
          )}
        </>
      )}
    </div>
  )
}

// Exportar el componente memoizado
export const ReviewList = memo(ReviewListComponent)
