"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface GuestForm {
  name: string
  surname: string
  documentType: string
  documentNumber: string
  nationality: string
  birthDate: string
}

const emptyGuest: GuestForm = {
  name: "",
  surname: "",
  documentType: "dni",
  documentNumber: "",
  nationality: "ES",
  birthDate: "",
}

export default function CheckInPage({ params }: { params: { id: string } }) {
  const [guests, setGuests] = useState<GuestForm[]>([{ ...emptyGuest }])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const addGuest = () => {
    setGuests([...guests, { ...emptyGuest }])
  }

  const removeGuest = (index: number) => {
    if (guests.length > 1) {
      setGuests(guests.filter((_, i) => i !== index))
    }
  }

  const updateGuest = (index: number, field: keyof GuestForm, value: string) => {
    const updatedGuests = [...guests]
    updatedGuests[index] = { ...updatedGuests[index], [field]: value }
    setGuests(updatedGuests)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulamos el envío de datos a la API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Check-in completado",
        description: "Los datos han sido enviados correctamente a las autoridades.",
      })

      router.push(`/booking/success?id=${params.id}`)
    } catch (error) {
      toast({
        title: "Error en el check-in",
        description: "Ha ocurrido un error al procesar el check-in. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <Link href="/bookings" className="inline-flex items-center gap-1 mb-6 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Volver a mis reservas
      </Link>

      <h1 className="text-3xl font-bold mb-2">Check-in</h1>
      <p className="text-muted-foreground mb-8">
        Por favor, introduce los datos de todos los huéspedes para completar el check-in legal.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Datos de los huéspedes</CardTitle>
          <CardDescription>
            Esta información es obligatoria según la normativa española y será enviada a las autoridades.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {guests.map((guest, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Huésped {index + 1}</h3>
                  {guests.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGuest(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor={`name-${index}`}>Nombre</Label>
                    <Input
                      id={`name-${index}`}
                      value={guest.name}
                      onChange={(e) => updateGuest(index, "name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`surname-${index}`}>Apellidos</Label>
                    <Input
                      id={`surname-${index}`}
                      value={guest.surname}
                      onChange={(e) => updateGuest(index, "surname", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor={`document-type-${index}`}>Tipo de documento</Label>
                    <Select
                      value={guest.documentType}
                      onValueChange={(value) => updateGuest(index, "documentType", value)}
                    >
                      <SelectTrigger id={`document-type-${index}`}>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dni">DNI</SelectItem>
                        <SelectItem value="nie">NIE</SelectItem>
                        <SelectItem value="passport">Pasaporte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`document-number-${index}`}>Número de documento</Label>
                    <Input
                      id={`document-number-${index}`}
                      value={guest.documentNumber}
                      onChange={(e) => updateGuest(index, "documentNumber", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor={`nationality-${index}`}>Nacionalidad</Label>
                    <Select
                      value={guest.nationality}
                      onValueChange={(value) => updateGuest(index, "nationality", value)}
                    >
                      <SelectTrigger id={`nationality-${index}`}>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ES">España</SelectItem>
                        <SelectItem value="FR">Francia</SelectItem>
                        <SelectItem value="DE">Alemania</SelectItem>
                        <SelectItem value="IT">Italia</SelectItem>
                        <SelectItem value="UK">Reino Unido</SelectItem>
                        <SelectItem value="US">Estados Unidos</SelectItem>
                        <SelectItem value="OTHER">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`birth-date-${index}`}>Fecha de nacimiento</Label>
                    <Input
                      id={`birth-date-${index}`}
                      type="date"
                      value={guest.birthDate}
                      onChange={(e) => updateGuest(index, "birthDate", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addGuest} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Añadir otro huésped
            </Button>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Enviando datos..." : "Completar check-in"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
