import { createDynamicComponent } from "@/components/ui/dynamic-import"

// Componentes con carga diferida
export const DynamicPropertyGallery = createDynamicComponent(
  () => import("@/components/property-gallery").then((mod) => ({ default: mod.PropertyGallery })),
  <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg"></div>,
)

export const DynamicBookingSystem = createDynamicComponent(
  () => import("@/components/booking-system").then((mod) => ({ default: mod.BookingSystem })),
  <div className="h-[300px] bg-gray-100 animate-pulse rounded-lg"></div>,
)

export const DynamicReviewList = createDynamicComponent(
  () => import("@/components/reviews/review-list").then((mod) => ({ default: mod.ReviewList })),
  <div className="h-[200px] bg-gray-100 animate-pulse rounded-lg"></div>,
)

export const DynamicAvailabilityCalendar = createDynamicComponent(
  () => import("@/components/availability-calendar").then((mod) => ({ default: mod.AvailabilityCalendar })),
  <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg"></div>,
)

export const DynamicPropertyForm = createDynamicComponent(
  () => import("@/components/property-form").then((mod) => ({ default: mod.PropertyForm })),
  <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg"></div>,
)
