import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

// Componentes con carga perezosa
export const PropertyDetailLazy = dynamic(
  () => import("@/components/properties/property-detail").then((mod) => ({ default: mod.PropertyDetail })),
  {
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-6 w-full max-w-md mb-8" />
        <Skeleton className="h-[300px] mb-6" />
        <Skeleton className="h-[200px]" />
      </div>
    ),
  },
)

export const ReviewsLazy = dynamic(
  () => import("@/components/reviews/property-reviews").then((mod) => ({ default: mod.PropertyReviews })),
  {
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
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
    ),
  },
)
