"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Star, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { ReviewResponse } from "./review-response"
import { ReviewResponseForm } from "./review-response-form"

interface PropertyReviewsListProps {
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

export function PropertyReviewsList({ propertyId }: PropertyReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [respondingTo, setRespondingTo] = useState<string | null>(null)

  const supabase = getSupabaseBrowserClient()

  // Cargar valoraciones
  useEffect(() => {
    async function loadReviews() {
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
      } catch (error) {
        console.error("Error al cargar las valoraciones:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadReviews()
  }, [propertyId, supabase])

  // Función para añadir una respuesta a una valoración
  const handleResponseAdded = (reviewId: string, response: string) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              response,
              response_date: new Date().toISOString(),
            }
          : review,
      ),
    )
    setRespondingTo(null)
  }

  if (isLoading) {
    return <PropertyReviewsListSkeleton />
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-900">Sin valoraciones todavía</h3>
        <p className="mt-1 text-gray-500">Esta propiedad aún no ha recibido valoraciones.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="space-y-4 pb-6 border-b last:border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
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
          </div>

          <p className="text-gray-700">{review.comment}</p>

          {/* Respuesta del propietario */}
          {review.response ? (
            <ReviewResponse response={review.response} responseDate={review.response_date} />
          ) : respondingTo === review.id ? (
            <ReviewResponseForm
              reviewId={review.id}
              onResponseAdded={(response) => handleResponseAdded(review.id, response)}
              onCancel={() => setRespondingTo(null)}
            />
          ) : (
            <Button variant="outline" size="sm" onClick={() => setRespondingTo(review.id)}>
              Responder
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}

function PropertyReviewsListSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-4 pb-6 border-b last:border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-16 w-full" />
        </div>
      ))}
    </div>
  )
}
