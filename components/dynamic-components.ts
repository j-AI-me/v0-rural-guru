import dynamic from "next/dynamic"

// Componentes con carga diferida simplificados
export const DynamicPropertyGallery = dynamic(
  () => import("@/components/property-gallery").then((mod) => ({ default: mod.PropertyGallery })),
  { ssr: true, loading: () => <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg"></div> },
)

export const DynamicBookingSystem = dynamic(
  () => import("@/components/booking-system").then((mod) => ({ default: mod.BookingSystem })),
  { ssr: true, loading: () => <div className="h-[300px] bg-gray-100 animate-pulse rounded-lg"></div> },
)

export const DynamicReviewList = dynamic(
  () => import("@/components/reviews/review-list").then((mod) => ({ default: mod.ReviewList })),
  { ssr: true, loading: () => <div className="h-[200px] bg-gray-100 animate-pulse rounded-lg"></div> },
)

export const DynamicAvailabilityCalendar = dynamic(
  () => import("@/components/availability-calendar").then((mod) => ({ default: mod.AvailabilityCalendar })),
  { ssr: true, loading: () => <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg"></div> },
)

export const DynamicPropertyForm = dynamic(
  () => import("@/components/property-form").then((mod) => ({ default: mod.PropertyForm })),
  { ssr: true, loading: () => <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg"></div> },
)
