import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PropertyGallery } from "@/components/property-gallery"
import { BookingSystem } from "@/components/booking-system"
import { Bath, Bed, Coffee, Home, Info, MapPin, MessageSquare, Star, Users, Wifi, Wind } from "lucide-react"
import { createServerClient } from "@/lib/supabase"
import { notFound } from "next/navigation"

// Función para obtener una propiedad por ID
async function getProperty(id: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("properties").select("*").eq("id", id).single()

  if (error || !data) {
    return null
  }

  return data
}

// Datos de ejemplo para las reseñas (en una implementación real, vendrían de la base de datos)
const sampleReviews = [
  {
    id: 1,
    author: "Carlos Martínez",
    date: "Octubre 2023",
    rating: 5,
    comment:
      "Una casa preciosa con unas vistas increíbles. El anfitrión es excepcional y nos dio muchas recomendaciones sobre la zona. Volveremos seguro.",
    avatar: "/avatar-carlos.png",
  },
  {
    id: 2,
    author: "Laura Gómez",
    date: "Septiembre 2023",
    rating: 5,
    comment:
      "Pasamos una semana maravillosa en esta casa. Está perfectamente equipada y la ubicación es inmejorable para explorar la región.",
    avatar: "/avatar-laura.png",
  },
  {
    id: 3,
    author: "Javier Rodríguez",
    date: "Agosto 2023",
    rating: 4,
    comment:
      "Casa muy acogedora y bien situada. El jardín es perfecto para relajarse después de un día de excursión. Lo único mejorable sería añadir aire acondicionado para los días más calurosos.",
    avatar: "/avatar-javier.png",
  },
]

export default async function PropertyPage({ params }: { params: { id: string } }) {
  // Obtener la propiedad de la base de datos
  const property = await getProperty(params.id)

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
            <span>
              4.8 · <span className="underline">{sampleReviews.length} reseñas</span>
            </span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{property.location}</span>
          </div>
        </div>
      </div>

      <PropertyGallery images={images} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <div className="border-b pb-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Alojamiento rural entero - Anfitrión: Propietario</h2>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{property.capacity} huéspedes</span>
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
                <Image
                  src="/placeholder-user.jpg"
                  alt="Anfitrión"
                  width={56}
                  height={56}
                  className="rounded-full border"
                />
              </div>
            </div>
          </div>

          <div className="py-6 border-b">
            <h2 className="text-xl font-semibold mb-4">Descripción</h2>
            <div className="space-y-4 text-gray-700">
              {property.long_description ? (
                property.long_description.split("\n\n").map((paragraph, index) => <p key={index}>{paragraph}</p>)
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

          <div className="py-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span>4.8 · {sampleReviews.length} reseñas</span>
                </div>
              </h2>
            </div>

            <div className="space-y-6">
              {sampleReviews.map((review) => (
                <div key={review.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Image
                      src={review.avatar || "/placeholder-user.jpg"}
                      alt={review.author}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-medium">{review.author}</div>
                      <div className="text-sm text-gray-500">{review.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-yellow-500" : ""}`} />
                    ))}
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>

            <Button variant="outline" className="mt-6">
              Mostrar todas las reseñas
            </Button>
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
          <div className="sticky top-8">
            <Card>
              <CardContent className="p-6">
                <BookingSystem
                  propertyId={property.id}
                  propertyName={property.title}
                  basePrice={property.price}
                  maxGuests={property.capacity}
                />
              </CardContent>
            </Card>

            <div className="mt-6 bg-gray-50 rounded-lg p-4">
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

            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">¿Tienes alguna pregunta?</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Contacta con el anfitrión para resolver cualquier duda antes de reservar.
                  </p>
                  <Button variant="outline" className="mt-2 w-full">
                    Contactar con el anfitrión
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
