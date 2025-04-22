"use client"

import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import dynamic from "next/dynamic"

// Client-side dynamic import with ssr: false
const ReviewSummary = dynamic(() => import("@/components/reviews/review-summary").then((mod) => mod.ReviewSummary), {
  loading: () => <Skeleton className="h-[200px] w-full" />,
  ssr: false, // This is now in a client component where it's allowed
})

export function ClientReviewSummary({ propertyId }: { propertyId: string }) {
  return (
    <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
      <ReviewSummary propertyId={propertyId} />
    </Suspense>
  )
}
