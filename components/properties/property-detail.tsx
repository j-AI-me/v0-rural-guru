"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { MapPin, Star, Calendar, Users, ArrowLeft } from "lucide-react"
import { PropertyLocation } from "@/components/properties/property-location"
import { NearbyProperties } from "@/components/properties/nearby-properties"

export function PropertyDetail({ propertyId }: { propertyId: string }) {
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(1)
  const [totalPrice, setTotalPrice] = useState(0)
  const [isBooking, setIsBooking] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("properties")
          .select(`
            *,
            property_images(*),
            property_amenities(*),
            users!inner(*)
          `)
          .eq("id", propertyId)
          .single()

        if (error) {
          throw error
        }

        setProperty(data)
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

    const fetchCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setCurrentUser(user)
    }

    fetchProperty()
    fetchCurrentUser()
  }, [propertyId, toast])

  useEffect(() => {
    if (property && checkIn && checkOut) {
      const start = new Date(checkIn)
      const end = new Date(checkOut)
      const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

      if (nights > 0) {
        const price = property.price * nights
        const cleaningFee = 30
        const serviceFee = Math.round(price * 0.1)
        setTotalPrice(price + cleaningFee + serviceFee)
      }
    }
  }, [property, checkIn, checkOut])

  const handleBooking = async () => {
    if (!currentUser) {
      toast({
        title: "Inicia sesión para reservar",
        description: "Necesitas iniciar sesión para realizar una reserva.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (!checkIn || !checkOut) {
      toast({
        title: "Fechas requeridas",
        description: "Por favor, selecciona las fechas de llegada y salida.",
        variant: "destructive",
      })
      return
    }

    const start = new Date(checkIn)
    const end = new Date(checkOut)
    if (start >= end) {
      toast({
        title: "Fechas inválidas",
        description: "La fecha de salida debe ser posterior a la fecha de llegada.",
        variant: "destructive",
      })
      return
    }

    setIsBooking(true)
    try {
      const { data, error } = await supabase
        .from("bookings")
        .insert([
          {
            property_id: propertyId,
            guest_id: currentUser.id,
            check_in: checkIn,
            check_out: checkOut,
            guests: guests,
            total_price: totalPrice,
            status: "pending",
            payment_status: "pending",
          },
        ])
        .select()

      if (error) {
        throw error
      }

      toast({
        title: "Reserva creada",
        description: "Tu reserva ha sido creada. Serás redirigido al proceso de pago.",
      })

      router.push(`/booking/${data[0].id}`)
    } catch (error: any) {
      toast({
        title: "Error al crear la reserva",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsBooking(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Cargando propiedad...</div>
  }

  if (!property) {
    return <div className="text-center py-12">Propiedad no encontrada</div>
  }

  return (
    <div className="space-y-8">
      <Link href="/properties" className="inline-flex items-center gap-1 mb-6 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Volver a propiedades
      </Link>

      <div>
        <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-medium">4.8</span>
            <span className="text-muted-foreground">(24 reseñas)</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{property.location}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-8">
        <div className="lg:col-span-2 row-span-2">
          <Image
            src={property.property_images[0]?.url || "/placeholder.svg?height=600&width=800&query=rural house"}
            alt={property.name}
            width={800}
            height={600}
            className="rounded-l-lg h-full object-cover"
          />
        </div>
        {property.property_images.slice(1, 3).map((image: any, index: number) => (
          <div key={index}>
            <Image
              src={image.url || "/placeholder.svg?height=300&width=400&query=rural house interior"}
              alt={`Interior ${index + 1}`}
              width={400}
              height={300}
              className={`${index === 0 ? "rounded-tr-lg" : "rounded-br-lg"} h-full object-cover`}
            />
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-[1fr_350px] gap-8">
        <div>
          <div className="prose max-w-none mb-8">
            <p>{property.description}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Características</h2>
            <div className="grid grid-cols-2 gap-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span>Capacidad: {property.max_guests} personas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{property.bedrooms}</span>
                <span>habitaciones</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{property.beds}</span>
                <span>camas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{property.bathrooms}</span>
                <span>baños</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Servicios</h2>
            <div className="grid grid-cols-2 gap-y-2">
              {property.property_amenities.map((amenity: any) => (
                <div key={amenity.id} className="flex items-center gap-2">
                  <span>{amenity.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Añadir el componente de ubicación */}
          <div className="mt-8">
            <PropertyLocation
              property={{
                id: property.id,
                name: property.name,
                location: property.location,
                latitude: property.latitude,
                longitude: property.longitude,
              }}
            />
          </div>

          {/* Añadir el componente de propiedades cercanas */}
          {property.latitude && property.longitude && (
            <div className="mt-8">
              <NearbyProperties propertyId={property.id} latitude={property.latitude} longitude={property.longitude} />
            </div>
          )}
        </div>

        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="flex items-baseline justify-between">
                <span>{property.price}€</span>
                <span className="text-sm font-normal text-muted-foreground">noche</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Llegada</label>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        type="date"
                        className="h-9"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Salida</label>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        type="date"
                        className="h-9"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Huéspedes</label>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input
                      type="number"
                      min="1"
                      max={property.max_guests}
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="h-9"
                    />
                  </div>
                </div>

                <Button onClick={handleBooking} disabled={isBooking || !checkIn || !checkOut} className="w-full">
                  {isBooking ? "Procesando..." : "Reservar"}
                </Button>
              </div>

              {totalPrice > 0 && (
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {property.price}€ x{" "}
                      {Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))}{" "}
                      noches
                    </span>
                    <span>
                      {property.price *
                        Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))}
                      €
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tarifa de limpieza</span>
                    <span>30€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tarifa de servicio</span>
                    <span>
                      {Math.round(
                        property.price *
                          Math.ceil(
                            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24),
                          ) *
                          0.1,
                      )}
                      €
                    </span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{totalPrice}€</span>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="text-center text-sm text-muted-foreground">No se te cobrará nada todavía</CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
