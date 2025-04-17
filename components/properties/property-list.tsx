"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { PropertyCard } from "@/components/property-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Search, Filter, Map } from "lucide-react"

export function PropertyList() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState("")
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined)
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined)
  const [guests, setGuests] = useState<number | undefined>(undefined)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async (filters?: any) => {
    setLoading(true)
    try {
      let query = supabase
        .from("properties")
        .select(`
          *,
          property_images!inner(*)
        `)
        .eq("status", "active")
        .eq("property_images.is_main", true)

      // Apply filters if provided
      if (filters?.location) {
        query = query.ilike("location", `%${filters.location}%`)
      }

      if (filters?.minPrice) {
        query = query.gte("price", filters.minPrice)
      }

      if (filters?.maxPrice) {
        query = query.lte("price", filters.maxPrice)
      }

      if (filters?.guests) {
        query = query.gte("max_guests", filters.guests)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      setProperties(data || [])
    } catch (error) {
      console.error("Error fetching properties:", error)
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    const filters = {
      location: location || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      guests: guests || undefined,
    }
    fetchProperties(filters)
  }

  const handleReset = () => {
    setLocation("")
    setMinPrice(undefined)
    setMaxPrice(undefined)
    setGuests(undefined)
    fetchProperties()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por ubicación..."
              className="pl-8"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="md:w-auto w-full">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
        <Link href="/map" passHref>
          <Button variant="outline" className="md:w-auto w-full">
            <Map className="h-4 w-4 mr-2" />
            Ver mapa
          </Button>
        </Link>
        <Button onClick={handleSearch} className="md:w-auto w-full">
          Buscar
        </Button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md">
          <div className="space-y-2">
            <Label htmlFor="min-price">Precio mínimo (€)</Label>
            <Input
              id="min-price"
              type="number"
              min="0"
              value={minPrice || ""}
              onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-price">Precio máximo (€)</Label>
            <Input
              id="max-price"
              type="number"
              min="0"
              value={maxPrice || ""}
              onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guests">Huéspedes</Label>
            <Input
              id="guests"
              type="number"
              min="1"
              value={guests || ""}
              onChange={(e) => setGuests(e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          <Button variant="outline" onClick={handleReset} className="md:col-span-3">
            Restablecer filtros
          </Button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">Cargando propiedades...</div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron propiedades con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={{
                id: property.id,
                name: property.name,
                location: property.location,
                price: property.price,
                rating: 4.8, // Placeholder rating
                reviews: 10, // Placeholder reviews count
                image: property.property_images[0]?.url || "/countryside-cottage.png",
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
