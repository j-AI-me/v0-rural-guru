"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Save, Trash, Plus } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [amenities, setAmenities] = useState<string[]>([])
  const [newAmenity, setNewAmenity] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const isNewProperty = params.id === "new"

  useEffect(() => {
    const fetchProperty = async () => {
      if (isNewProperty) {
        setProperty({
          name: "",
          description: "",
          location: "",
          address: "",
          price: 0,
          max_guests: 1,
          bedrooms: 1,
          beds: 1,
          bathrooms: 1,
          status: "pending",
        })
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("properties")
          .select(`
            *,
            property_images(*),
            property_amenities(*)
          `)
          .eq("id", params.id)
          .single()

        if (error) throw error

        setProperty(data)
        setAmenities(data.property_amenities.map((a: any) => a.name))
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

    fetchProperty()
  }, [params.id, isNewProperty, toast])

  const handleSave = async () => {
    setSaving(true)
    try {
      // Obtener el usuario actual
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("No se ha encontrado un usuario autenticado")
      }

      let propertyId = params.id

      // Si es una nueva propiedad, crearla
      if (isNewProperty) {
        const { data, error } = await supabase
          .from("properties")
          .insert({
            ...property,
            host_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()

        if (error) throw error
        propertyId = data[0].id

        // Añadir una imagen por defecto
        await supabase.from("property_images").insert({
          property_id: propertyId,
          url: `/placeholder.svg?height=600&width=800&query=rural house in ${property.location}`,
          is_main: true,
        })
      } else {
        // Actualizar propiedad existente
        const { error } = await supabase
          .from("properties")
          .update({
            ...property,
            updated_at: new Date().toISOString(),
          })
          .eq("id", propertyId)

        if (error) throw error
      }

      // Actualizar amenidades
      if (!isNewProperty) {
        // Eliminar amenidades existentes
        await supabase.from("property_amenities").delete().eq("property_id", propertyId)
      }

      // Añadir nuevas amenidades
      if (amenities.length > 0) {
        const amenityInserts = amenities.map((name) => ({
          property_id: propertyId,
          name,
        }))

        await supabase.from("property_amenities").insert(amenityInserts)
      }

      toast({
        title: isNewProperty ? "Propiedad creada" : "Propiedad actualizada",
        description: "Los cambios se han guardado correctamente",
      })

      if (isNewProperty) {
        router.push(`/host-dashboard/properties/${propertyId}`)
      }
    } catch (error: any) {
      console.error("Error saving property:", error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAddAmenity = () => {
    if (newAmenity && !amenities.includes(newAmenity)) {
      setAmenities([...amenities, newAmenity])
      setNewAmenity("")
    }
  }

  const handleRemoveAmenity = (amenity: string) => {
    setAmenities(amenities.filter((a) => a !== amenity))
  }

  const handleInputChange = (field: string, value: any) => {
    setProperty({
      ...property,
      [field]: value,
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
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid md:grid-cols-[2fr_1fr] gap-8">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-1 container py-8">
        <Link href="/host-dashboard" className="inline-flex items-center gap-1 mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Volver al dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-8">
          {isNewProperty ? "Añadir nueva propiedad" : `Editar: ${property.name}`}
        </h1>

        <div className="grid md:grid-cols-[2fr_1fr] gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Información básica</CardTitle>
              <CardDescription>Detalles principales de tu propiedad</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la propiedad</Label>
                <Input
                  id="name"
                  value={property.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Ej: Cabaña en Cangas de Onís"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={property.description || ""}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe tu propiedad, sus características y entorno..."
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Input
                    id="location"
                    value={property.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Ej: Cangas de Onís"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={property.address || ""}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Dirección completa"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio por noche (€)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={property.price}
                    onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value))}
                    min={0}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_guests">Capacidad máxima</Label>
                  <Input
                    id="max_guests"
                    type="number"
                    value={property.max_guests}
                    onChange={(e) => handleInputChange("max_guests", Number.parseInt(e.target.value))}
                    min={1}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Habitaciones</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={property.bedrooms}
                    onChange={(e) => handleInputChange("bedrooms", Number.parseInt(e.target.value))}
                    min={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="beds">Camas</Label>
                  <Input
                    id="beds"
                    type="number"
                    value={property.beds}
                    onChange={(e) => handleInputChange("beds", Number.parseInt(e.target.value))}
                    min={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Baños</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={property.bathrooms}
                    onChange={(e) => handleInputChange("bathrooms", Number.parseInt(e.target.value))}
                    min={1}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select value={property.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activa</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="inactive">Inactiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Servicios y comodidades</CardTitle>
                <CardDescription>¿Qué ofrece tu propiedad?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="Añadir servicio..."
                  />
                  <Button type="button" onClick={handleAddAmenity} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                      <span>{amenity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveAmenity(amenity)}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {amenities.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-2">No hay servicios añadidos</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {!isNewProperty && property.property_images && (
              <Card>
                <CardHeader>
                  <CardTitle>Imágenes</CardTitle>
                  <CardDescription>Fotos de tu propiedad</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {property.property_images.map((image: any) => (
                      <div key={image.id} className="relative aspect-square rounded-md overflow-hidden">
                        <Image
                          src={image.url || "/placeholder.svg"}
                          alt="Imagen de la propiedad"
                          fill
                          className="object-cover"
                        />
                        {image.is_main && (
                          <div className="absolute top-1 left-1 bg-primary text-white text-xs px-2 py-1 rounded">
                            Principal
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" onClick={handleSave} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Guardando..." : "Guardar cambios"}
                </Button>

                {!isNewProperty && (
                  <Button variant="destructive" className="w-full">
                    <Trash className="mr-2 h-4 w-4" />
                    Eliminar propi edad
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
