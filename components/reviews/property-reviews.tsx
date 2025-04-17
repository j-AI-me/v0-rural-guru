"use client"

import { useEffect, useState } from "react"
import { ReviewCard } from "./review-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface PropertyReviewsProps {
  propertyId: string
}

export function PropertyReviews({ propertyId }: PropertyReviewsProps) {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/properties/${propertyId}/reviews`)

        if (!response.ok) {
          throw new Error("Error al cargar las reseñas")
        }

        const data = await response.json()
        setReviews(data)
      } catch (error) {
        setError("No se pudieron cargar las reseñas. Inténtalo de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [propertyId])

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Reseñas</h2>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24 mt-1" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        {error}
        <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="ml-2">
          Reintentar
        </Button>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-2">Reseñas</h2>
        <p className="text-muted-foreground">Esta propiedad aún no tiene reseñas.</p>
      </div>
    )
  }

  return (
    <div className="px-1">
      <h2 className="text-2xl font-bold mb-4">Reseñas ({reviews.length})</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  )
}
