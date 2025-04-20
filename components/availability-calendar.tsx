"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { addMonths, format, isSameDay, startOfMonth } from "date-fns"
import { es } from "date-fns/locale"
import { Loader2, Save } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface AvailabilityCalendarProps {
  propertyId: string
  initialPrice?: number
}

type AvailabilityDay = {
  date: Date
  isAvailable: boolean
  price: number | null
}

export function AvailabilityCalendar({ propertyId, initialPrice = 0 }: AvailabilityCalendarProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [month, setMonth] = useState<Date>(new Date())
  const [availabilityDays, setAvailabilityDays] = useState<AvailabilityDay[]>([])
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [selectionMode, setSelectionMode] = useState<"available" | "unavailable">("available")
  const [defaultPrice, setDefaultPrice] = useState<number>(initialPrice)

  // Cargar la disponibilidad desde Supabase
  useEffect(() => {
    const fetchAvailability = async () => {
      setIsLoading(true)
      try {
        const supabase = getSupabaseBrowserClient()

        // Calcular el rango de fechas para cargar (mes actual + 3 meses)
        const startDate = startOfMonth(month)
        const endDate = addMonths(startDate, 3)

        // Obtener la disponibilidad de la base de datos
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
          price: item.price,
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
  }, [propertyId, month])

  // Función para manejar la selección de fechas
  const handleDateSelect = (date: Date) => {
    setSelectedDates((prev) => {
      // Verificar si la fecha ya está seleccionada
      const isSelected = prev.some((d) => isSameDay(d, date))

      if (isSelected) {
        // Si ya está seleccionada, la quitamos
        return prev.filter((d) => !isSameDay(d, date))
      } else {
        // Si no está seleccionada, la añadimos
        return [...prev, date]
      }
    })
  }

  // Función para aplicar la disponibilidad a las fechas seleccionadas
  const applyAvailability = async () => {
    if (selectedDates.length === 0) return

    setIsSaving(true)

    try {
      const supabase = getSupabaseBrowserClient()

      // Preparar los datos para actualizar
      const updates = selectedDates.map((date) => ({
        property_id: propertyId,
        date: format(date, "yyyy-MM-dd"),
        is_available: selectionMode === "available",
        price: selectionMode === "available" ? defaultPrice : null,
        updated_at: new Date().toISOString(),
      }))

      // Usar upsert para insertar o actualizar
      const { error } = await supabase.from("availability").upsert(updates, { onConflict: "property_id,date" })

      if (error) throw error

      // Actualizar el estado local de manera más eficiente
      setAvailabilityDays((prev) => {
        // Crear un mapa para búsqueda más rápida
        const dateMap = new Map()
        prev.forEach((item, index) => {
          const dateKey = format(item.date, "yyyy-MM-dd")
          dateMap.set(dateKey, { item, index })
        })

        // Crear una copia del array
        const updated = [...prev]

        // Procesar las fechas seleccionadas
        selectedDates.forEach((date) => {
          const dateKey = format(date, "yyyy-MM-dd")
          const existingEntry = dateMap.get(dateKey)

          const newItem = {
            date,
            isAvailable: selectionMode === "available",
            price: selectionMode === "available" ? defaultPrice : null,
          }

          if (existingEntry) {
            // Actualizar existente
            updated[existingEntry.index] = newItem
          } else {
            // Añadir nuevo
            updated.push(newItem)
          }
        })

        return updated
      })

      // Limpiar selección
      setSelectedDates([])

      toast({
        title: "Disponibilidad actualizada",
        description: `Se ha actualizado la disponibilidad de ${selectedDates.length} días.`,
      })
    } catch (error) {
      console.error("Error al guardar la disponibilidad:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la disponibilidad. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Función para renderizar el día en el calendario
  const renderDay = (day: Date) => {
    // Buscar si tenemos información de disponibilidad para este día
    const availabilityInfo = availabilityDays.find((d) => isSameDay(d.date, day))
    const isSelected = selectedDates.some((d) => isSameDay(d, day))

    // Determinar el estado de disponibilidad
    let isAvailable = true // Por defecto está disponible
    if (availabilityInfo) {
      isAvailable = availabilityInfo.isAvailable
    }

    // Determinar las clases CSS según el estado
    let className = ""
    if (isSelected) {
      className = "bg-black text-white hover:bg-gray-800"
    } else if (availabilityInfo) {
      className = isAvailable
        ? "bg-green-100 text-green-800 hover:bg-green-200"
        : "bg-red-100 text-red-800 hover:bg-red-200"
    }

    return (
      <div
        className={`h-9 w-9 p-0 font-normal aria-selected:opacity-100 flex items-center justify-center rounded-md ${className}`}
      >
        {day.getDate()}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de disponibilidad</CardTitle>
        <CardDescription>
          Selecciona las fechas y marca su disponibilidad. Las fechas disponibles se muestran en verde y las no
          disponibles en rojo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="selection" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="selection">Selección</TabsTrigger>
            <TabsTrigger value="price">Precio base</TabsTrigger>
          </TabsList>

          <TabsContent value="selection" className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={selectionMode === "available" ? "default" : "outline"}
                onClick={() => setSelectionMode("available")}
                className={selectionMode === "available" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                Marcar como disponible
              </Button>
              <Button
                variant={selectionMode === "unavailable" ? "default" : "outline"}
                onClick={() => setSelectionMode("unavailable")}
                className={selectionMode === "unavailable" ? "bg-red-600 hover:bg-red-700" : ""}
              >
                Marcar como no disponible
              </Button>

              {selectedDates.length > 0 && (
                <Button onClick={applyAvailability} disabled={isSaving} className="ml-auto">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Aplicar a {selectedDates.length} {selectedDates.length === 1 ? "día" : "días"}
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                Disponible
              </Badge>
              <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                No disponible
              </Badge>
              <Badge variant="outline" className="bg-black text-white hover:bg-gray-800">
                Seleccionado
              </Badge>
            </div>

            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <Calendar
                mode="multiple"
                selected={selectedDates}
                onSelect={(dates) => setSelectedDates(dates || [])}
                onDayClick={handleDateSelect}
                month={month}
                onMonthChange={setMonth}
                locale={es}
                className="rounded-md border"
                components={{
                  Day: ({ date, ...props }) => <button {...props}>{renderDay(date)}</button>,
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="price" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <label htmlFor="defaultPrice" className="text-sm font-medium">
                  Precio base por noche (€)
                </label>
                <div className="flex gap-2">
                  <input
                    id="defaultPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={defaultPrice}
                    onChange={(e) => setDefaultPrice(Number(e.target.value))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button
                    onClick={() => {
                      toast({
                        title: "Precio actualizado",
                        description: "El precio base se ha actualizado correctamente.",
                      })
                    }}
                  >
                    Actualizar
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Este precio se aplicará a todas las fechas marcadas como disponibles, a menos que se especifique un
                  precio diferente.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">Selecciona múltiples fechas haciendo clic en ellas.</div>
      </CardFooter>
    </Card>
  )
}
