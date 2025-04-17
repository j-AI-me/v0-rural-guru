"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { PropertyCard } from "@/components/property-card"
import { Skeleton } from "@/components/ui/skeleton"

interface NearbyPropertiesProps {
  propertyId: string
  latitude: number
  longitude: number
  radiusKm?: number
  limit?: number
}

export function NearbyProperties({ propertyId, latitude, longitude, radiusKm = 10, limit = 4 }: NearbyPropertiesProps) {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (latitude && longitude) {
      fetchNearbyProperties()
    }
  }, [latitude, longitude])

  const fetchNearbyProperties = async () => {
    setLoading(true)
    try {
      // Aproximación simple: 1 grado de latitud ≈ 111 km
      const latDegrees = radiusKm / 111
      const longDegrees = radiusKm / (111 * Math.cos((latitude * Math.PI) / 180))

      const { data, error } = await supabase
        .from("properties")
        .select(`
          *,
          property_images!inner(*)
        `)
        .eq("status", "active")
        .eq("property_images.is_main", true)
        .neq("id", propertyId) // Excluir la propiedad actual
        .gte("latitude", latitude - latDegrees)
        .lte("latitude", latitude + latDegrees)
        .gte("longitude", longitude - longDegrees)
        .lte("longitude", longitude + longDegrees)
        .limit(limit + 1) // Obtener uno más para asegurarnos de tener suficientes después de filtrar

      if (error) {
        throw error
      }

      // Calcular la distancia para cada propiedad
      const propertiesWithDistance = data.map((property) => {
        const distance = calculateDistance(latitude, longitude, property.latitude, property.longitude)
        return { ...property, distance }
      })

      // Ordenar por distancia y limitar
      setProperties(propertiesWithDistance.sort((a, b) => a.distance - b.distance).slice(0, limit))
    } catch (error) {
      console.error("Error fetching nearby properties:", error)
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  // Función para calcular la distancia entre dos puntos usando la fórmula haversine
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Radio de la Tierra en km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c // Distancia en km
    return distance
  }

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180)
  }

  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Propiedades cercanas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
        </div>
      </div>
    )
  }

  if (properties.length === 0) {
    return null
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Propiedades cercanas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
    </div>
  )
}
