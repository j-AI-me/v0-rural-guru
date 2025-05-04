"use client"

import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import dynamic from "next/dynamic"

// Client-side dynamic import con ssr: false
const ReviewSummary = dynamic(
  () => import("@/components/reviews/review-summary").then((mod) => ({ default: mod.ReviewSummary })),
  {
    loading: () => <Skeleton className="h-[200px] w-full" />,
    ssr: false,
  },
)

export function ClientReviewSummary({ propertyId }: { propertyId: string }) {
  return (
    <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
      <ReviewSummary propertyId={propertyId} />
    </Suspense>
  )
}
