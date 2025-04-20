"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

interface Property {
  id: string
  title: string
  description: string
  long_description: string | null
  location: string
  price: number
  bedrooms: number
  bathrooms: number
  capacity: number
  status: string
  [key: string]: any
}

interface PropertyFormProps {
  property?: Property
}

export function PropertyForm({ property }: PropertyFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: property?.title || "",
    description: property?.description || "",
    long_description: property?.long_description || "",
    location: property?.location || "",
    price: property?.price?.toString() || "",
    bedrooms: property?.bedrooms?.toString() || "",
    bathrooms: property?.bathrooms?.toString() || "",
    capacity: property?.capacity?.toString() || "",
    status: property?.status || "active",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = getSupabaseBrowserClient()

      // Convertir valores numéricos
      const propertyData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        bedrooms: Number.parseInt(formData.bedrooms),
        bathrooms: Number.parseInt(formData.bathrooms),
        capacity: Number.parseInt(formData.capacity),
      }

      if (property?.id) {
        // Actualizar propiedad existente
        const { error } = await supabase.from("properties").update(propertyData).eq("id", property.id)

        if (error) throw error
      } else {
        // Crear nueva propiedad
        const { error } = await supabase.from("properties").insert([
          {
            ...propertyData,
            amenities: ["Wifi gratis", "Cocina completa", "Calefacción"], // Valores por defecto
          },
        ])

        if (error) throw error
      }

      // Redireccionar a la lista de propiedades
      router.push("/dashboard/properties")
      router.refresh()
    } catch (error) {
      console.error("Error saving property:", error)
      alert("Error al guardar la propiedad. Por favor, inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{property ? "Editar propiedad" : "Nueva propiedad"}</CardTitle>
        <CardDescription>
          {property
            ? "Modifica los detalles de tu propiedad."
            : "Introduce los detalles de la nueva propiedad que quieres añadir a tu catálogo."}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              name="title"
              placeholder="Ej: Casa rural en Covadonga"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción corta</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Breve descripción de la propiedad"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="long_description">Descripción detallada</Label>
            <Textarea
              id="long_description"
              name="long_description"
              placeholder="Descripción completa con todos los detalles de la propiedad"
              value={formData.long_description || ""}
              onChange={handleChange}
              className="min-h-[150px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Ubicación</Label>
            <Input
              id="location"
              name="location"
              placeholder="Ej: Covadonga, Asturias"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Precio por noche (€)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="Ej: 120"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="maintenance">Mantenimiento</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Dormitorios</Label>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                min="0"
                placeholder="Ej: 3"
                value={formData.bedrooms}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Baños</Label>
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                min="0"
                placeholder="Ej: 2"
                value={formData.bathrooms}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacidad (personas)</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                placeholder="Ej: 6"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-black hover:bg-gray-800" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : property ? (
              "Actualizar propiedad"
            ) : (
              "Guardar propiedad"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
