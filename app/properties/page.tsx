"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabase/client"
import { MapPin, Users, Bed, Bath, Filter, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Define property type for better type safety
interface Property {
  id: string
  name: string
  description: string
  location?: string
  price?: number
  max_guests?: number
  bedrooms?: number
  beds?: number
  bathrooms?: number
  status?: string
  mainImage?: string
  image_url?: string
  phone?: string
  email?: string
  type?: string
  amenities?: string[]
  adapted_mobility?: boolean
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [locations, setLocations] = useState<string[]>([])
  const [propertyTypes, setPropertyTypes] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch properties from Supabase
        const { data, error } = await supabase.from("properties").select("*")

        if (error) throw error

        if (data && data.length > 0) {
          setProperties(data as Property[])

          // Extract unique locations and property types for filters
          const uniqueLocations = Array.from(new Set(data.map((p) => p.location).filter(Boolean)))
          setLocations(uniqueLocations as string[])

          const uniqueTypes = Array.from(new Set(data.map((p) => p.type).filter(Boolean)))
          setPropertyTypes(uniqueTypes as string[])
        } else {
          // Fallback to demo properties if no data in Supabase
          const demoProperties = [
            {
              id: "1",
              name: "The Auteiro Crown",
              description: "Casa rural en la montaña con vistas y jardín",
              location: "Asturias",
              price: 95,
              max_guests: 4,
              bedrooms: 2,
              beds: 3,
              bathrooms: 1,
              status: "active",
              mainImage: "/countryside-cottage.png",
              type: "Casa rural",
              amenities: ["Jardín", "Vistas", "Entorno natural"],
              adapted_mobility: false,
            },
            {
              id: "2",
              name: "Maria Manuela Hotel & Spa",
              description: "Hotel moderno con spa en entorno rural",
              location: "Asturias",
              price: 120,
              max_guests: 6,
              bedrooms: 3,
              beds: 4,
              bathrooms: 2,
              status: "active",
              mainImage: "/countryside-retreat.png",
              type: "Hotel & Spa",
              amenities: ["Spa", "Moderno", "Entorno rural"],
              adapted_mobility: false,
            },
            {
              id: "3",
              name: "El Bricial Hotel",
              description: "Hotel en Asturias, cerca de Covadonga",
              location: "Covadonga",
              price: 85,
              max_guests: 3,
              bedrooms: 1,
              beds: 2,
              bathrooms: 1,
              status: "active",
              mainImage: "/covadonga-sanctuary-view.png",
              type: "Hotel",
              amenities: ["Cercano a Covadonga"],
              adapted_mobility: false,
            },
            {
              id: "4",
              name: "Casa Azul",
              description: "Casa rural con cenador privado y barbacoa",
              location: "Asturias",
              price: 110,
              max_guests: 5,
              bedrooms: 2,
              beds: 3,
              bathrooms: 2,
              status: "active",
              mainImage: "/countryside-cookout.png",
              type: "Casa rural",
              amenities: ["Cenador privado", "Barbacoa"],
              adapted_mobility: false,
            },
            {
              id: "5",
              name: "El Pedrueco",
              description: "Casa rural con Wi-Fi, calefacción aerotérmica y placas solares",
              location: "Asturias",
              price: 105,
              max_guests: 4,
              bedrooms: 2,
              beds: 2,
              bathrooms: 1,
              status: "active",
              mainImage: "/sustainable-countryside-home.png",
              type: "Casa rural",
              amenities: ["Wi-Fi", "Calefacción aerotérmica", "Placas solares"],
              adapted_mobility: false,
            },
            {
              id: "6",
              name: "Balcón del Sueve",
              description: "Apartamentos rurales sostenibles, estándar Passivhaus, vistas a la montaña",
              location: "Sueve",
              price: 100,
              max_guests: 4,
              bedrooms: 2,
              beds: 2,
              bathrooms: 1,
              status: "active",
              mainImage: "/mountain-view-balcony.png",
              type: "Apartamentos",
              amenities: ["Sostenibilidad", "Vistas", "Estándar Passivhaus"],
              adapted_mobility: false,
            },
            {
              id: "7",
              name: "Casa Jesusa",
              description: "Casas rurales adaptadas para personas con movilidad reducida, de 6, 5 y 4 plazas",
              location: "Asturias",
              price: 115,
              max_guests: 6,
              bedrooms: 3,
              beds: 4,
              bathrooms: 2,
              status: "active",
              mainImage: "/accessible-rural-home.png",
              type: "Casa rural",
              amenities: ["Adaptado PMR", "Varias capacidades"],
              adapted_mobility: true,
            },
            {
              id: "8",
              name: "Casa la Tenada",
              description: "Casa rural para 4 personas",
              location: "Asturias",
              price: 90,
              max_guests: 4,
              bedrooms: 2,
              beds: 2,
              bathrooms: 1,
              status: "active",
              mainImage: "/rural-cottage-garden.png",
              type: "Casa rural",
              amenities: ["Capacidad para 4 personas"],
              adapted_mobility: false,
            },
            {
              id: "9",
              name: "Hotel Cerro la Niña",
              description: "Hotel rural con vistas",
              location: "Asturias",
              price: 95,
              max_guests: 2,
              bedrooms: 1,
              beds: 1,
              bathrooms: 1,
              status: "active",
              mainImage: "/placeholder.svg?height=300&width=400&query=rural%20hotel%20views",
              type: "Hotel",
              amenities: ["Vistas"],
              adapted_mobility: false,
            },
            {
              id: "10",
              name: "Casas Prieto",
              description: "Casas rurales en Asturias",
              location: "Asturias",
              price: 100,
              max_guests: 5,
              bedrooms: 2,
              beds: 3,
              bathrooms: 1,
              status: "active",
              mainImage: "/placeholder.svg?height=300&width=400&query=asturias%20rural%20houses",
              type: "Casa rural",
              phone: "985 92 35 78",
              email: "info@casasprieto.com",
              adapted_mobility: false,
            },
            {
              id: "11",
              name: "Hoteles La Pasera",
              description: "Hoteles rurales en Asturias",
              location: "Asturias",
              price: 110,
              max_guests: 4,
              bedrooms: 2,
              beds: 2,
              bathrooms: 1,
              status: "active",
              mainImage: "/placeholder.svg?height=300&width=400&query=asturias%20rural%20hotels",
              type: "Hotel",
              phone: "985 84 60 21",
              email: "central@hoteleslapasera.com",
              adapted_mobility: false,
            },
          ]

          setProperties(demoProperties)

          // Extract unique locations and property types for filter
          const uniqueLocations = Array.from(new Set(demoProperties.map((p) => p.location).filter(Boolean)))
          setLocations(uniqueLocations as string[])

          const uniqueTypes = Array.from(new Set(demoProperties.map((p) => p.type).filter(Boolean)))
          setPropertyTypes(uniqueTypes as string[])
        }
      } catch (error) {
        console.error("Error fetching properties:", error)
        setError("No se pudieron cargar las propiedades. Por favor, inténtalo de nuevo más tarde.")

        // Fallback to demo properties if there's an error
        const demoProperties = [
          {
            id: "1",
            name: "The Auteiro Crown",
            description: "Casa rural en la montaña con vistas y jardín",
            location: "Asturias",
            price: 95,
            max_guests: 4,
            bedrooms: 2,
            beds: 3,
            bathrooms: 1,
            status: "active",
            mainImage: "/countryside-cottage.png",
            type: "Casa rural",
            amenities: ["Jardín", "Vistas", "Entorno natural"],
            adapted_mobility: false,
          },
          // ... other properties (same as above)
        ]

        setProperties(demoProperties)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  // Filter properties based on search term, location, and type
  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      searchTerm === "" ||
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (property.description && property.description.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesLocation = locationFilter === "" || property.location === locationFilter
    const matchesType = typeFilter === "" || property.type === typeFilter

    return matchesSearch && matchesLocation && matchesType
  })

  const resetFilters = () => {
    setSearchTerm("")
    setLocationFilter("")
    setTypeFilter("")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-1">
        <div className="bg-muted py-12">
          <div className="container">
            <h1 className="text-4xl font-bold mb-4">Encuentra tu alojamiento rural perfecto</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Descubre casas rurales, cabañas y apartamentos en los mejores destinos
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Buscar por nombre o descripción"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="location">Ubicación</Label>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Todas las ubicaciones" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las ubicaciones</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Tipo de alojamiento</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={resetFilters}
                  disabled={!searchTerm && !locationFilter && !typeFilter}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Limpiar filtros
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
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
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Error</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={() => window.location.reload()}>Reintentar</Button>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">No se encontraron propiedades</h2>
              <p className="text-muted-foreground mb-6">Prueba con otros filtros o términos de búsqueda</p>
              <Button onClick={resetFilters}>Ver todas las propiedades</Button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6">
                {filteredProperties.length}{" "}
                {filteredProperties.length === 1 ? "propiedad encontrada" : "propiedades encontradas"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <Card key={property.id} className="overflow-hidden">
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={
                          property.mainImage ||
                          property.image_url ||
                          `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(property.name) || "/placeholder.svg"}`
                        }
                        alt={property.name}
                        fill
                        className="object-cover"
                      />
                      {property.adapted_mobility && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary">Adaptado PMR</Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold">{property.name}</h3>
                        {property.type && (
                          <Badge variant="outline" className="ml-2">
                            {property.type}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                        <MapPin className="h-3 w-3" />
                        <span>{property.location || "Asturias"}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{property.description}</p>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{property.max_guests || "4"} huéspedes</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Bed className="h-4 w-4 text-muted-foreground" />
                          <span>{property.bedrooms || "2"} habitaciones</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Bath className="h-4 w-4 text-muted-foreground" />
                          <span>{property.bathrooms || "1"} baños</span>
                        </div>
                      </div>
                      {property.amenities && property.amenities.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {property.amenities.slice(0, 3).map((amenity, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {property.amenities.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{property.amenities.length - 3} más
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between items-center">
                      <div className="font-bold">
                        {property.price || "95"}€{" "}
                        <span className="text-sm font-normal text-muted-foreground">noche</span>
                      </div>
                      <Link href={`/properties/${property.id}`}>
                        <Button>Ver detalles</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
