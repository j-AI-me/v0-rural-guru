"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { getSupabaseBrowserClient } from "@/lib/supabase"

interface ReviewSummaryProps {
  propertyId: string
}

interface RatingSummary {
  average: number
  total: number
  distribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export function ReviewSummary({ propertyId }: ReviewSummaryProps) {
  const [summary, setSummary] = useState<RatingSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    async function loadReviewSummary() {
      try {
        setIsLoading(true)

        // Obtener todas las valoraciones de la propiedad
        const { data: reviews, error } = await supabase
          .from("reviews")
          .select("rating")
          .eq("property_id", propertyId)
          .eq("status", "published")

        if (error) throw error

        if (!reviews || reviews.length === 0) {
          setSummary(null)
          return
        }

        // Calcular el resumen de valoraciones
        const total = reviews.length
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
        const average = sum / total

        // Calcular la distribución de valoraciones
        const distribution = {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        }

        reviews.forEach((review) => {
          distribution[review.rating as keyof typeof distribution]++
        })

        setSummary({
          average,
          total,
          distribution,
        })
      } catch (error) {
        console.error("Error al cargar el resumen de valoraciones:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadReviewSummary()
  }, [propertyId, supabase])

  if (isLoading) {
    return <ReviewSummarySkeleton />
  }

  if (!summary) {
    return null
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-medium mb-4">Valoraciones</h3>

      <div className="flex items-center gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold">{summary.average.toFixed(1)}</div>
          <div className="flex justify-center mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 text-yellow-500 ${i < Math.round(summary.average) ? "fill-yellow-500" : ""}`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-500 mt-1">{summary.total} valoraciones</div>
        </div>

        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = summary.distribution[rating as keyof typeof summary.distribution]
            const percentage = (count / summary.total) * 100

            return (
              <div key={rating} className="flex items-center gap-2">
                <div className="w-8 text-sm text-right">{rating}</div>
                <Progress value={percentage} className="h-2 flex-1" />
                <div className="w-8 text-sm text-gray-500">{count}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ReviewSummarySkeleton() {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <Skeleton className="h-6 w-24 mb-4" />

      <div className="flex items-center gap-4 mb-6">
        <div className="text-center">
          <Skeleton className="h-8 w-12 mx-auto" />
          <Skeleton className="h-4 w-20 mx-auto mt-1" />
          <Skeleton className="h-4 w-16 mx-auto mt-1" />
        </div>

        <div className="flex-1 space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-2 flex-1" />
              <Skeleton className="h-4 w-8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
