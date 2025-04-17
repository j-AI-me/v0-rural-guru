"use client"

import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, MapPin, Users, Bed, Bath, Home, Check, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { PropertyReviews } from "@/components/reviews/property-reviews"
import { ReviewForm } from "@/components/reviews/review-form"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"

// Componente para cargar las reseñas con Suspense
function ReviewsSection({ propertyId }: { propertyId: string }) {
  return (
    <Suspense fallback={<ReviewsSkeleton />}>
      <PropertyReviews propertyId={propertyId} />
    </Suspense>
  )
}

// Esqueleto para las reseñas durante la carga
function ReviewsSkeleton() {
  return (
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
  )
}

// Datos de demostración para propiedades
const demoProperties = [
  {
    id: "1",
    name: "Cabaña en Cangas de Onís",
    description:
      "Hermosa cabaña de madera situada en un entorno natural privilegiado cerca de Cangas de Onís. Disfruta de impresionantes vistas a los Picos de Europa y de la tranquilidad del campo asturiano.",
    location: "Cangas de Onís",
    address: "Calle Principal 123, Cangas de Onís, Asturias",
    price: 95,
    max_guests: 4,
    bedrooms: 2,
    beds: 3,
    bathrooms: 1,
    status: "active",
    host: {
      id: "host-1",
      full_name: "María García",
      email: "maria@example.com",
    },
  },
  {
    id: "2",
    name: "Casa rural en Covadonga",
    description:
      "Encantadora casa rural con vistas a los Picos de Europa, cerca del Santuario de Covadonga. Ideal para familias y grupos de amigos que quieran disfrutar de la naturaleza.",
    location: "Covadonga",
    address: "Camino de Covadonga 45, Cangas de Onís, Asturias",
    price: 120,
    max_guests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 2,
    status: "active",
    host: {
      id: "host-2",
      full_name: "Juan Pérez",
      email: "juan@example.com",
    },
  },
  {
    id: "3",
    name: "Apartamento en Llanes",
    description:
      "Moderno apartamento en el centro de Llanes, a pocos minutos de las playas más bonitas de Asturias. Perfecto para parejas o pequeñas familias.",
    location: "Llanes",
    address: "Avenida del Mar 78, Llanes, Asturias",
    price: 85,
    max_guests: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    status: "active",
    host: {
      id: "host-3",
      full_name: "Carlos Rodríguez",
      email: "carlos@example.com",
    },
  },
  {
    id: "4",
    name: "Cabaña en los Picos de Europa",
    description:
      "Acogedora cabaña de montaña ubicada en pleno corazón de los Picos de Europa. Perfecta para amantes del senderismo y la naturaleza. Disfruta de impresionantes vistas y desconecta del mundo.",
    location: "Potes",
    address: "Camino de la Montaña 15, Potes, Cantabria",
    price: 110,
    max_guests: 4,
    bedrooms: 2,
    beds: 3,
    bathrooms: 1,
    status: "active",
    host: {
      id: "host-4",
      full_name: "Ana Martínez",
      email: "ana@example.com",
    },
  },
  {
    id: "5",
    name: "Casa tradicional asturiana",
    description:
      "Auténtica casa asturiana restaurada con materiales tradicionales. Conserva todo el encanto rural con las comodidades modernas. Ideal para familias que buscan una experiencia auténtica.",
    location: "Ribadesella",
    address: "Camino del Río 34, Ribadesella, Asturias",
    price: 130,
    max_guests: 8,
    bedrooms: 4,
    beds: 6,
    bathrooms: 2,
    status: "active",
    host: {
      id: "host-5",
      full_name: "Pedro Sánchez",
      email: "pedro@example.com",
    },
  },
]

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<any>(null)
  const [images, setImages] = useState<any[]>([])
  const [amenities, setAmenities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [canReview, setCanReview] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(false)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const propertyId = params.id

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = getSupabaseBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from("users").select("*").eq("id", user.id).single()

        if (data) {
          setUser({ ...user, ...data })

          // Verificar si el usuario puede dejar una reseña
          const { data: bookings } = await supabase
            .from("bookings")
            .select("id")
            .eq("property_id", propertyId)
            .eq("guest_id", user.id)
            .eq("status", "completed")
            .limit(1)

          const { data: existingReview } = await supabase
            .from("reviews")
            .select("id")
            .eq("property_id", propertyId)
            .eq("user_id", user.id)
            .limit(1)

          setCanReview(bookings && bookings.length > 0)
          setHasReviewed(existingReview && existingReview.length > 0)
          setBookingId(bookings && bookings.length > 0 ? bookings[0].id : null)
        }
      }
    }

    fetchUser()
  }, [propertyId])

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true)
      try {
        // Para propósitos de demostración, usaremos datos estáticos para IDs numéricos
        if (!isNaN(Number(params.id))) {
          // Si el ID es numérico, buscamos en los datos de demostración
          const demoProperty = demoProperties.find((p) => p.id === params.id)

          if (demoProperty) {
            setProperty(demoProperty)

            // Imágenes de demostración
            const demoImages = [
              {
                id: `img-${params.id}-1`,
                url:
                  params.id === "1"
                    ? "/mountain-retreat.png"
                    : params.id === "2"
                      ? "/countryside-cottage.png"
                      : params.id === "3"
                        ? "/coastal-modern-living.png"
                        : `/placeholder.svg?height=400&width=600&query=rural house in ${demoProperty.location}`,
                is_main: true,
              },
              {
                id: `img-${params.id}-2`,
                url: `/placeholder.svg?height=400&width=600&query=interior of ${demoProperty.name}`,
                is_main: false,
              },
              {
                id: `img-${params.id}-3`,
                url: `/placeholder.svg?height=400&width=600&query=bedroom of ${demoProperty.name}`,
                is_main: false,
              },
              {
                id: `img-${params.id}-4`,
                url: `/placeholder.svg?height=400&width=600&query=bathroom of ${demoProperty.name}`,
                is_main: false,
              },
            ]

            setImages(demoImages)

            // Amenidades de demostración
            const demoAmenities = [
              { id: `amenity-${params.id}-1`, name: "WiFi" },
              { id: `amenity-${params.id}-2`, name: "Cocina equipada" },
              { id: `amenity-${params.id}-3`, name: "Calefacción" },
              { id: `amenity-${params.id}-4`, name: "Aparcamiento gratuito" },
              { id: `amenity-${params.id}-5`, name: "Terraza" },
              { id: `amenity-${params.id}-6`, name: "TV" },
            ]

            setAmenities(demoAmenities)
          } else {
            throw new Error("Propiedad no encontrada")
          }
        } else {
          // Si el ID parece ser un UUID, intentamos obtenerlo de Supabase
          const supabase = getSupabaseBrowserClient()

          // Obtener la propiedad
          const { data: propertyData, error: propertyError } = await supabase
            .from("properties")
            .select("*, host:host_id(id, full_name, email)")
            .eq("id", params.id)
            .single()

          if (propertyError) throw propertyError

          if (!propertyData) {
            throw new Error("Propiedad no encontrada")
          }

          setProperty(propertyData)

          // Obtener imágenes
          const { data: imagesData, error: imagesError } = await supabase
            .from("property_images")
            .select("*")
            .eq("property_id", params.id)
            .order("is_main", { ascending: false })

          if (imagesError) throw imagesError
          setImages(imagesData || [])

          // Obtener amenidades
          const { data: amenitiesData, error: amenitiesError } = await supabase
            .from("property_amenities")
            .select("*")
            .eq("property_id", params.id)

          if (amenitiesError) throw amenitiesError
          setAmenities(amenitiesData || [])
        }
      } catch (error) {
        console.error("Error fetching property:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar la propiedad",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProperty()
    }
  }, [params.id, toast])

  const handleReviewSuccess = () => {
    setHasReviewed(true)
    toast({
      title: "Reseña enviada",
      description: "Gracias por compartir tu experiencia",
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <MainNav />
        <main className="flex-1 container py-8">
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-full max-w-md mb-8" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Skeleton className="h-[300px] md:col-span-2" />
            <div className="space-y-4">
              <Skeleton className="h-[140px]" />
              <Skeleton className="h-[140px]" />
            </div>
          </div>

          <div className="grid md:grid-cols-[2fr_1fr] gap-8">
            <div className="space-y-8">
              <Skeleton className="h-[200px]" />
              <Skeleton className="h-[300px]" />
            </div>
            <Skeleton className="h-[400px]" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="flex flex-col min-h-screen">
        <MainNav />
        <main className="flex-1 container py-8">
          <Link href="/properties" className="inline-flex items-center gap-1 mb-6 hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Volver a propiedades
          </Link>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Propiedad no encontrada</h1>
            <p className="text-muted-foreground mb-6">La propiedad que buscas no existe o ha sido eliminada.</p>
            <Button onClick={() => router.push("/properties")}>Ver otras propiedades</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-1">
        <div className="container py-8 px-4 md:px-6 lg:px-8">
          <Link href="/properties" className="inline-flex items-center gap-1 mb-6 hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Volver a propiedades
          </Link>

          <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
          <div className="flex items-center gap-2 mb-8">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{property.location}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {images.length > 0 ? (
              <>
                <div className="md:col-span-2 aspect-video relative rounded-lg overflow-hidden">
                  <Image
                    src={images[0]?.url || "/placeholder.svg?height=600&width=800&query=rural house"}
                    alt={property.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {images.slice(1, 5).map((image, index) => (
                    <div key={image.id} className="aspect-square relative rounded-lg overflow-hidden">
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={`${property.name} - Imagen ${index + 2}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {Array.from({ length: Math.max(0, 4 - images.slice(1).length) }).map((_, index) => (
                    <div
                      key={`placeholder-${index}`}
                      className="aspect-square relative rounded-lg overflow-hidden bg-muted"
                    >
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <Home className="h-8 w-8" />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="md:col-span-3 aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src={"/placeholder.svg?height=600&width=800&query=rural house in mountains"}
                  alt={property.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-[2fr_1fr] gap-8">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Acerca de este alojamiento</CardTitle>
                </CardHeader>
                <CardContent className="px-5">
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span>{property.max_guests} huéspedes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-muted-foreground" />
                      <span>{property.bedrooms} habitaciones</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bed className="h-5 w-5 text-muted-foreground" />
                      <span>{property.beds} camas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="h-5 w-5 text-muted-foreground" />
                      <span>{property.bathrooms} baños</span>
                    </div>
                  </div>

                  <p className="whitespace-pre-line">{property.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lo que ofrece este alojamiento</CardTitle>
                </CardHeader>
                <CardContent className="px-5">
                  <div className="grid grid-cols-2 gap-4">
                    {amenities.map((amenity) => (
                      <div key={amenity.id} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span>{amenity.name}</span>
                      </div>
                    ))}
                    {amenities.length === 0 && (
                      <p className="text-muted-foreground col-span-2">
                        No hay información disponible sobre los servicios de este alojamiento.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div id="reviews" className="pt-6 px-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Reseñas</CardTitle>
                  </CardHeader>
                  <CardContent className="px-5">
                    <ReviewsSection propertyId={propertyId} />

                    {user && user.role === "guest" && canReview && (
                      <div className="mt-8 pt-8 border-t" id="review">
                        <h3 className="text-xl font-semibold mb-4">
                          {hasReviewed ? "Editar tu reseña" : "Deja tu reseña"}
                        </h3>
                        <ReviewForm
                          propertyId={propertyId}
                          bookingId={bookingId || undefined}
                          onSuccess={handleReviewSuccess}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>{property.price}€ / noche</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Llegada</label>
                        <div className="border rounded-md p-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Seleccionar</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Salida</label>
                        <div className="border rounded-md p-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Seleccionar</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Huéspedes</label>
                      <div className="border rounded-md p-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>1 huésped</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mt-6">Reservar</Button>

                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{property.price}€ x 5 noches</span>
                      <span>{(property.price * 5).toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tarifa de limpieza</span>
                      <span>30.00€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tarifa de servicio</span>
                      <span>{(property.price * 5 * 0.1).toFixed(2)}€</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{(property.price * 5 + 30 + property.price * 5 * 0.1).toFixed(2)}€</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <p className="text-sm text-muted-foreground">No se te cobrará todavía</p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
