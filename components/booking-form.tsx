"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Users } from "lucide-react"
import { format, differenceInCalendarDays } from "date-fns"
import { es } from "date-fns/locale"

interface BookingFormProps {
  property: {
    price: number
    capacity: number
  }
}

export function BookingForm({ property }: BookingFormProps) {
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined)
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined)
  const [guests, setGuests] = useState(2)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!checkIn || !checkOut) {
      alert("Por favor, selecciona las fechas de entrada y salida.")
      return
    }

    setIsSubmitting(true)

    // Simulación de envío de formulario
    await new Promise((resolve) => setTimeout(resolve, 1500))

    alert(
      `Reserva enviada con éxito para ${format(checkIn, "dd/MM/yyyy")} - ${format(checkOut, "dd/MM/yyyy")} con ${guests} huéspedes.`,
    )
    setIsSubmitting(false)
  }

  // Calcular número de noches y precio total
  const nights = checkIn && checkOut ? differenceInCalendarDays(checkOut, checkIn) : 0
  const subtotal = nights * property.price
  const serviceFee = subtotal * 0.1 // 10% de tarifa de servicio
  const total = subtotal + serviceFee

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-2xl font-bold">{property.price}€</span>
          <span className="text-gray-500"> / noche</span>
        </div>
        <div className="flex items-center">
          <span className="text-sm font-semibold flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 text-yellow-500 mr-1"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
            4.8 · 24 reseñas
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="col-span-2 border rounded-t-lg">
          <div className="grid grid-cols-2 divide-x">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="justify-start text-left font-normal rounded-none h-14">
                  <div className="grid gap-1 w-full">
                    <div className="text-xs font-semibold">ENTRADA</div>
                    <div className="text-sm">
                      {checkIn ? format(checkIn, "d MMM yyyy", { locale: es }) : "Añadir fecha"}
                    </div>
                  </div>
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkIn}
                  onSelect={setCheckIn}
                  disabled={(date) => date < new Date() || (checkOut ? date >= checkOut : false)}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="justify-start text-left font-normal rounded-none h-14">
                  <div className="grid gap-1 w-full">
                    <div className="text-xs font-semibold">SALIDA</div>
                    <div className="text-sm">
                      {checkOut ? format(checkOut, "d MMM yyyy", { locale: es }) : "Añadir fecha"}
                    </div>
                  </div>
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  disabled={(date) => date <= (checkIn || new Date())}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="col-span-2 border-x border-b rounded-b-lg">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="justify-start text-left font-normal rounded-none h-14 w-full">
                <div className="grid gap-1 w-full">
                  <div className="text-xs font-semibold">HUÉSPEDES</div>
                  <div className="text-sm">{guests} huéspedes</div>
                </div>
                <Users className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-4 p-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Adultos</div>
                    <div className="text-sm text-gray-500">13+ años</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      disabled={guests <= 1}
                    >
                      -
                    </Button>
                    <span className="w-6 text-center">{guests}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => setGuests(Math.min(property.capacity, guests + 1))}
                      disabled={guests >= property.capacity}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Este alojamiento tiene una capacidad máxima de {property.capacity} huéspedes. No se permiten mascotas.
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-black hover:bg-gray-800"
        disabled={!checkIn || !checkOut || isSubmitting}
      >
        {isSubmitting ? "Procesando..." : "Reservar"}
      </Button>

      <div className="mt-4 text-center text-sm text-gray-500">No se te cobrará todavía</div>

      {checkIn && checkOut && nights > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex justify-between">
            <div className="underline">
              {property.price}€ x {nights} noches
            </div>
            <div>{subtotal}€</div>
          </div>
          <div className="flex justify-between">
            <div className="underline">Tarifa de servicio</div>
            <div>{serviceFee}€</div>
          </div>
          <div className="flex justify-between pt-4 border-t font-semibold">
            <div>Total</div>
            <div>{total}€</div>
          </div>
        </div>
      )}
    </form>
  )
}
