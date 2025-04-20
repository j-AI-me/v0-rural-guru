"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CalendarIcon, Loader2, Users } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { addDays, differenceInCalendarDays, format, isBefore, isWithinInterval } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "@/components/ui/use-toast"

interface BookingSystemProps {
  propertyId: string
  propertyName: string
  basePrice: number
  maxGuests: number
}

type AvailabilityDay = {
  date: Date
  isAvailable: boolean
  price: number | null
}

export function BookingSystem({ propertyId, propertyName, basePrice, maxGuests }: BookingSystemProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availabilityDays, setAvailabilityDays] = useState<AvailabilityDay[]>([])
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined)
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined)
  const [guests, setGuests] = useState(2)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingId, setBookingId] = useState<string | null>(null)

  // Cargar la disponibilidad desde Supabase
  useEffect(() => {
    const fetchAvailability = async () => {
      setIsLoading(true)
      try {
        const supabase = getSupabaseBrowserClient()

        // Obtener la disponibilidad para los próximos 6 meses
        const startDate = new Date()
        const endDate = addDays(startDate, 180) // 6 meses aproximadamente

        const { data, error } = await supabase
          .from("availability")
          .select("date, is_available, price")
          .eq("property_id", propertyId)
          .gte("date", format(startDate, "yyyy-MM-dd"))
          .lte("date", format(endDate, "yyyy-MM-dd"))

        if (error) throw error

        // Convertir los datos a nuestro formato
        const availabilityData = data.map((item) => ({
          date: new Date(item.date),
          isAvailable: item.is_available,
          price: item.price || basePrice,
        }))

        setAvailabilityDays(availabilityData)
      } catch (error) {
        console.error("Error al cargar la disponibilidad:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar la disponibilidad. Inténtalo de nuevo.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAvailability()
  }, [propertyId, basePrice])

  // Función para verificar si una fecha está disponible
  const isDateAvailable = (date: Date) => {
    // Verificar si tenemos información específica para esta fecha
    const dayInfo = availabilityDays.find(
      (d) =>
        d.date.getFullYear() === date.getFullYear() &&
        d.date.getMonth() === date.getMonth() &&
        d.date.getDate() === date.getDate(),
    )

    // Si tenemos información, usamos esa
    if (dayInfo) {
      return dayInfo.isAvailable
    }

    // Por defecto, asumimos que está disponible
    return true
  }

  // Función para verificar si un rango de fechas está disponible
  const isRangeAvailable = (start: Date, end: Date) => {
    // Crear un array con todas las fechas del rango
    const dates: Date[] = []
    const currentDate = new Date(start)

    while (currentDate <= end) {
      dates.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Verificar si todas las fechas están disponibles
    return dates.every((date) => isDateAvailable(date))
  }

  // Función para calcular el precio total
  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut) return 0

    const nights = differenceInCalendarDays(checkOut, checkIn)
    if (nights <= 0) return 0

    let total = 0
    const currentDate = new Date(checkIn)

    // Sumar el precio de cada noche
    for (let i = 0; i < nights; i++) {
      const dayInfo = availabilityDays.find(
        (d) =>
          d.date.getFullYear() === currentDate.getFullYear() &&
          d.date.getMonth() === currentDate.getMonth() &&
          d.date.getDate() === currentDate.getDate(),
      )

      // Usar el precio específico o el precio base
      const price = dayInfo?.price || basePrice
      total += price

      // Avanzar al siguiente día
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return total
  }

  // Función para manejar la reserva
  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      toast({
        title: "Error",
        description: "Por favor, selecciona las fechas de entrada y salida.",
        variant: "destructive",
      })
      return
    }

    const nights = differenceInCalendarDays(checkOut, checkIn)
    if (nights <= 0) {
      toast({
        title: "Error",
        description: "La fecha de salida debe ser posterior a la fecha de entrada.",
        variant: "destructive",
      })
      return
    }

    // Verificar disponibilidad
    if (!isRangeAvailable(checkIn, checkOut)) {
      toast({
        title: "Error",
        description: "Algunas de las fechas seleccionadas no están disponibles.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = getSupabaseBrowserClient()

      // Obtener la sesión del usuario
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        // Redirigir a inicio de sesión si no hay sesión
        toast({
          title: "Inicia sesión",
          description: "Debes iniciar sesión para realizar una reserva.",
          variant: "destructive",
        })
        // Aquí podrías guardar los datos de la reserva en localStorage y redirigir
        setIsSubmitting(false)
        return
      }

      // Calcular el precio total
      const totalPrice = calculateTotalPrice()

      // Crear la reserva
      const { data, error } = await supabase
        .from("bookings")
        .insert([
          {
            property_id: propertyId,
            guest_id: session.user.id,
            check_in: format(checkIn, "yyyy-MM-dd"),
            check_out: format(checkOut, "yyyy-MM-dd"),
            guests: guests,
            total_price: totalPrice,
            status: "pending", // pending, confirmed, cancelled
            payment_status: "pending", // pending, paid, refunded
          },
        ])
        .select()

      if (error) throw error

      // Guardar el ID de la reserva
      if (data && data.length > 0) {
        setBookingId(data[0].id)

        // Enviar notificaciones por email
        const response = await fetch("/api/notifications/new-booking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId: data[0].id,
          }),
        })

        if (!response.ok) {
          console.error("Error al enviar notificaciones:", await response.text())
        }
      }

      // Mostrar mensaje de éxito
      setBookingSuccess(true)

      // Aquí podrías redirigir a una página de pago o confirmación
    } catch (error) {
      console.error("Error al realizar la reserva:", error)
      toast({
        title: "Error",
        description: "No se pudo realizar la reserva. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Función para renderizar el día en el calendario
  const renderDay = (day: Date) => {
    // No mostrar días pasados
    if (isBefore(day, new Date()) && !isWithinInterval(day, { start: new Date(), end: new Date() })) {
      return <div className="text-gray-300">{day.getDate()}</div>
    }

    // Verificar disponibilidad
    const isAvailable = isDateAvailable(day)

    // Determinar las clases CSS según el estado
    const className = isAvailable ? "hover:bg-gray-100" : "text-gray-300 line-through bg-gray-50 cursor-not-allowed"

    return <div className={className}>{day.getDate()}</div>
  }

  // Si la reserva fue exitosa, mostrar mensaje de confirmación
  if (bookingSuccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>¡Reserva realizada con éxito!</CardTitle>
          <CardDescription>Tu reserva para {propertyName} ha sido registrada correctamente.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-green-50 border-green-200">
            <AlertTitle>Reserva confirmada</AlertTitle>
            <AlertDescription>
              <div className="mt-2 space-y-2">
                <p>
                  <strong>Fechas:</strong>{" "}
                  {checkIn && checkOut
                    ? `${format(checkIn, "d MMM yyyy", { locale: es })} - ${format(checkOut, "d MMM yyyy", { locale: es })}`
                    : ""}
                </p>
                <p>
                  <strong>Huéspedes:</strong> {guests}
                </p>
                <p>
                  <strong>Precio total:</strong> {calculateTotalPrice()}€
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Hemos enviado un email de confirmación con todos los detalles de tu reserva.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button onClick={() => (window.location.href = "/dashboard/bookings")} className="w-full">
            Ver mis reservas
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reservar alojamiento</CardTitle>
        <CardDescription>
          Selecciona las fechas y el número de huéspedes para tu estancia en {propertyName}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="check-in">Fecha de entrada</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button id="check-in" variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkIn ? format(checkIn, "PPP", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={setCheckIn}
                      disabled={(date) =>
                        (isBefore(date, new Date()) &&
                          !isWithinInterval(date, { start: new Date(), end: new Date() })) ||
                        !isDateAvailable(date)
                      }
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="check-out">Fecha de salida</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button id="check-out" variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOut ? format(checkOut, "PPP", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={setCheckOut}
                      disabled={(date) =>
                        (checkIn ? isBefore(date, checkIn) : isBefore(date, new Date())) || !isDateAvailable(date)
                      }
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guests">Número de huéspedes</Label>
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setGuests((prev) => Math.max(1, prev - 1))}
                  disabled={guests <= 1}
                >
                  -
                </Button>
                <div className="w-12 text-center">{guests}</div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setGuests((prev) => Math.min(maxGuests, prev + 1))}
                  disabled={guests >= maxGuests}
                >
                  +
                </Button>
                <div className="ml-4 flex items-center text-sm text-gray-500">
                  <Users className="mr-1 h-4 w-4" />
                  Máximo: {maxGuests} personas
                </div>
              </div>
            </div>

            {checkIn && checkOut && (
              <div className="mt-6 space-y-4 border-t pt-4">
                <div className="flex justify-between">
                  <div>
                    {differenceInCalendarDays(checkOut, checkIn)} noches x {basePrice}€
                  </div>
                  <div>{calculateTotalPrice()}€</div>
                </div>
                <div className="flex justify-between font-bold">
                  <div>Total</div>
                  <div>{calculateTotalPrice()}€</div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleBooking}
          disabled={isLoading || isSubmitting || !checkIn || !checkOut}
          className="w-full bg-black hover:bg-gray-800"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            "Reservar ahora"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
