import Link from "next/link"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Bath, Bed, Coffee, Home, Info, MapPin, MessageSquare, Star, Users, Wifi, Wind } from "@/lib/optimized-imports"
import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase"
import { DynamicPropertyGallery, DynamicBookingSystem, DynamicReviewList } from "@/components/dynamic-components"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { ClientReviewSummary } from "./client-components"

export default async function PropertyPage({ params }: { params: { id: string } }) {
  // Obtener la propiedad de la base de datos
  let property = null
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase.from("properties").select("*").eq("id", params.id).single()

    if (!error && data) {
      property = data
    }
  } catch (error) {
    console.error("Error fetching property:", error)
  }

  if (!property) {
    notFound()
  }

  // Preparar las imágenes para la galería
  const images = property.images
    ? property.images.map((img: any) => ({
        src: img.src || "/placeholder.svg",
        alt: img.alt || property.title,
      }))
    : [
        {
          src: "/countryside-cottage.png",
          alt: property.title,
        },
      ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-2 mb-6">
        <Link href="/propiedades" className="text-sm text-gray-500 hover:text-black">
          ← Volver a propiedades
        </Link>
        <h1 className="text-3xl font-bold">{property.title}</h1>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
            <span>{property.avg_rating ? property.avg_rating.toFixed(1) : "Sin valoraciones"}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{property.location}</span>
          </div>
        </div>
      </div>

      <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}>
        <DynamicPropertyGallery images={images} />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <div className="border-b pb-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Alojamiento rural entero - Anfitrión: Propietario</h2>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{property.max_guests} huéspedes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    <span>{property.bedrooms} dormitorios</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    <span>{property.bathrooms} baños</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <OptimizedImage
                  src="/placeholder-user.jpg"
                  alt="Anfitrión"
                  width={56}
                  height={56}
                  className="rounded-full border"
                  lowQualityPlaceholder
                />
              </div>
            </div>
          </div>

          <div className="py-6 border-b">
            <h2 className="text-xl font-semibold mb-4">Descripción</h2>
            <div className="space-y-4 text-gray-700">
              {property.long_description ? (
                property.long_description
                  .split("\n\n")
                  .map((paragraph: string, index: number) => <p key={index}>{paragraph}</p>)
              ) : (
                <p>{property.description}</p>
              )}
            </div>
          </div>

          <div className="py-6 border-b">
            <h2 className="text-xl font-semibold mb-4">Lo que ofrece este alojamiento</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.amenities ? (
                property.amenities.map((amenity: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    {amenity.includes("Wifi") ? (
                      <Wifi className="h-5 w-5 text-gray-600" />
                    ) : amenity.includes("Cocina") ? (
                      <Coffee className="h-5 w-5 text-gray-600" />
                    ) : amenity.includes("Jardín") || amenity.includes("Terraza") ? (
                      <Wind className="h-5 w-5 text-gray-600" />
                    ) : (
                      <Home className="h-5 w-5 text-gray-600" />
                    )}
                    <span>{amenity}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-gray-600" />
                    <span>Wifi gratis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coffee className="h-5 w-5 text-gray-600" />
                    <span>Cocina completa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-gray-600" />
                    <span>Calefacción</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sección de valoraciones */}
          <div className="py-6 border-b">
            <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
              <DynamicReviewList propertyId={params.id} />
            </Suspense>
          </div>

          <div className="py-6">
            <h2 className="text-xl font-semibold mb-4">Ubicación</h2>
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center p-4">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                <p className="text-gray-700">La ubicación exacta se proporciona después de confirmar la reserva.</p>
              </div>
            </div>
            <p className="mt-4 text-gray-700">
              {property.location} - Excelente ubicación con fácil acceso a los principales puntos de interés de la zona.
            </p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            <Card>
              <CardContent className="p-6">
                <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                  <DynamicBookingSystem
                    propertyId={property.id}
                    propertyName={property.name}
                    basePrice={property.price}
                    maxGuests={property.max_guests}
                  />
                </Suspense>
              </CardContent>
            </Card>

            {/* Resumen de valoraciones - Ahora usando el componente cliente */}
            <ClientReviewSummary propertyId={params.id} />

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Política de cancelación</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Cancelación gratuita durante las primeras 48 horas después de la reserva (siempre que la estancia
                    sea dentro de al menos 14 días).
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">¿Tienes alguna pregunta?</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Contacta con el anfitrión para resolver cualquier duda antes de reservar.
                  </p>
                  <button className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                    Contactar con el anfitrión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
