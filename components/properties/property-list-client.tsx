"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorDisplay } from "@/components/ui/error-display"
import { getBrowserDatabaseOperations } from "@/lib/supabase/browser"

// Componente de carga para propiedades
function PropertySkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-[200px] rounded-none" />
      <CardContent className="p-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-4 mt-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </Card>
  )
}

export function PropertyListClient() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Datos de demostración para fallback
  const demoProperties = [
    {
      id: "1",
      name: "The Auteiro Crown",
      description: "Casa rural en la montaña con vistas y jardín",
      location: "Asturias",
      price: 95,
      image_url: "/countryside-cottage.png",
    },
    {
      id: "2",
      name: "Maria Manuela Hotel & Spa",
      description: "Hotel moderno con spa en entorno rural",
      location: "Asturias",
      price: 120,
      image_url: "/countryside-retreat.png",
    },
    {
      id: "3",
      name: "El Bricial Hotel",
      description: "Hotel en Asturias, cerca de Covadonga",
      location: "Covadonga",
      price: 85,
      image_url: "/covadonga-sanctuary-view.png",
    },
  ]

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true)
      setError(null)

      try {
        const db = getBrowserDatabaseOperations()
        const { data, error } = await db.getProperties(10)

        if (error) throw error

        if (data && data.length > 0) {
          setProperties(data)
        } else {
          // Usar datos de demostración si no hay datos
          setProperties(demoProperties)
        }
      } catch (err: any) {
        console.error("Error fetching properties:", err)
        setError(err)
        // Usar datos de demostración en caso de error
        setProperties(demoProperties)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  // Filtrar propiedades según el término de búsqueda
  const filteredProperties = properties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Función para reintentar la carga
  const handleRetry = () => {
    setLoading(true)
    setError(null)
    // Reiniciar el efecto
    setProperties([])
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar propiedades..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
        <Link href="/map">
          <Button>Ver mapa</Button>
        </Link>
      </div>

      {error && <ErrorDisplay title="Error al cargar propiedades" message={error.message} retry={handleRetry} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Mostrar esqueletos durante la carga
          Array.from({ length: 6 }).map((_, index) => <PropertySkeleton key={index} />)
        ) : filteredProperties.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No se encontraron propiedades</p>
          </div>
        ) : (
          // Mostrar propiedades
          filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={
                    property.image_url ||
                    `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(property.name)}`
                  }
                  alt={property.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{property.name}</h3>
                  <span className="font-bold">{property.price}€/noche</span>
                </div>
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.location}</span>
                </div>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{property.description}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link href={`/properties/${property.id}`} className="w-full">
                  <Button className="w-full">Ver detalles</Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
