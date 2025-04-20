import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createServerClient } from "@/lib/supabase"
import { requireAuth } from "@/lib/auth"
import { format, differenceInCalendarDays } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"
import { ArrowLeft, MapPin, Users } from "lucide-react"
import { notFound } from "next/navigation"
import { CancelBookingButton } from "@/components/cancel-booking-button"

// Función para obtener una reserva por ID
async function getBooking(id: string) {
  const supabase = createServerClient()

  // Obtener la sesión del usuario
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  // Obtener la reserva
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      property:properties(*)
    `)
    .eq("id", id)
    .eq("guest_id", session.user.id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export default async function BookingDetailPage({ params }: { params: { id: string } }) {
  // Verificar que el usuario esté autenticado
  await requireAuth()

  // Obtener la reserva
  const booking = await getBooking(params.id)

  if (!booking) {
    notFound()
  }

  // Calcular noches y precio por noche
  const checkIn = new Date(booking.check_in)
  const checkOut = new Date(booking.check_out)
  const nights = differenceInCalendarDays(checkOut, checkIn)
  const pricePerNight = nights > 0 ? booking.total_price / nights : booking.total_price

  // Formatear fechas
  const formattedCheckIn = format(checkIn, "d 'de' MMMM 'de' yyyy", { locale: es })
  const formattedCheckOut = format(checkOut, "d 'de' MMMM 'de' yyyy", { locale: es })

  // Determinar si la reserva se puede cancelar (ejemplo: solo si faltan más de 7 días para el check-in)
  const today = new Date()
  const daysUntilCheckIn = differenceInCalendarDays(checkIn, today)
  const canCancel = booking.status !== "cancelled" && daysUntilCheckIn > 7

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/dashboard/bookings" className="text-gray-500 hover:text-black">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Detalles de la reserva</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{booking.property.title}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {booking.property.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Fecha de entrada</div>
                  <div className="font-medium">{formattedCheckIn}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Fecha de salida</div>
                  <div className="font-medium">{formattedCheckOut}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Huéspedes</div>
                  <div className="font-medium flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {booking.guests} personas
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Detalles del alojamiento</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Habitaciones: {booking.property.bedrooms}</div>
                  <div>Baños: {booking.property.bathrooms}</div>
                  <div>Capacidad máxima: {booking.property.capacity} personas</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Estado de la reserva</h3>
                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {booking.status === "confirmed"
                    ? "Confirmada"
                    : booking.status === "pending"
                      ? "Pendiente"
                      : "Cancelada"}
                </div>
              </div>

              {booking.status === "cancelled" && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertTitle>Reserva cancelada</AlertTitle>
                  <AlertDescription>
                    Esta reserva ha sido cancelada. Si tienes alguna pregunta, por favor contacta con nosotros.
                  </AlertDescription>
                </Alert>
              )}

              {booking.status === "confirmed" && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertTitle>Reserva confirmada</AlertTitle>
                  <AlertDescription>
                    Tu reserva está confirmada. Te esperamos el {formattedCheckIn}. Recuerda que el check-in es a partir
                    de las 15:00h.
                  </AlertDescription>
                </Alert>
              )}

              {booking.status === "pending" && (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertTitle>Reserva pendiente</AlertTitle>
                  <AlertDescription>
                    Tu reserva está pendiente de confirmación. Te notificaremos por email cuando sea confirmada.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumen de pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <div>
                  {nights} {nights === 1 ? "noche" : "noches"} x {pricePerNight.toFixed(2)}€
                </div>
                <div>{booking.total_price}€</div>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold">
                <div>Total</div>
                <div>{booking.total_price}€</div>
              </div>
              <div
                className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  booking.payment_status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {booking.payment_status === "paid" ? "Pagado" : "Pendiente de pago"}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Link href={`/propiedades/${booking.property.id}`} className="w-full">
                <Button variant="outline" className="w-full">
                  Ver propiedad
                </Button>
              </Link>

              {canCancel && <CancelBookingButton bookingId={booking.id} />}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
