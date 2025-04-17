"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { InteractiveMap, useCurrentLocation } from "./interactive-map"
import type { MapMarker, MapViewport } from "@/types/map"
import { Button } from "@/components/ui/button"
import { MapPin, Loader2 } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

interface PropertiesMapProps {
  initialProperties?: any[]
  height?: string
  showLocationButton?: boolean
  className?: string
}

export function PropertiesMap({
  initialProperties,
  height = "600px",
  showLocationButton = true,
  className,
}: PropertiesMapProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [properties, setProperties] = useState<any[]>(initialProperties || [])
  const [markers, setMarkers] = useState<MapMarker[]>([])
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | undefined>(undefined)
  const [viewport, setViewport] = useState<MapViewport>({
    center: { latitude: 43.3602, longitude: -5.8447 }, // Asturias, España
    zoom: 9,
  })
  const { coordinates, loading, error, getCurrentLocation } = useCurrentLocation()
  const [isMounted, setIsMounted] = useState(false)

  // Check if component is mounted (client-side)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Cargar propiedades si no se proporcionan inicialmente
  useEffect(() => {
    if (isMounted && !initialProperties) {
      fetchProperties()
    }
  }, [initialProperties, isMounted])

  // Convertir propiedades a marcadores
  useEffect(() => {
    if (isMounted && properties.length > 0) {
      const newMarkers = properties
        .filter((property) => property.latitude && property.longitude)
        .map((property) => ({
          id: property.id,
          coordinates: {
            latitude: property.latitude,
            longitude: property.longitude,
          },
          title: property.name,
          price: property.price,
          image: property.property_images?.[0]?.url,
        }))

      setMarkers(newMarkers)
    }
  }, [properties, isMounted])

  // Manejar errores de geolocalización
  useEffect(() => {
    if (isMounted && error) {
      toast({
        title: "Error de ubicación",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast, isMounted])

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select(
          `
          id, 
          name, 
          price, 
          latitude, 
          longitude,
          property_images(url, is_main)
        `,
        )
        .eq("status", "active")
        .eq("property_images.is_main", true)

      if (error) {
        throw error
      }

      setProperties(data || [])
    } catch (error) {
      console.error("Error fetching properties for map:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las propiedades para el mapa",
        variant: "destructive",
      })
    }
  }

  const handleMarkerClick = (markerId: string) => {
    setSelectedMarkerId(markerId)
    router.push(`/properties/${markerId}`)
  }

  const handleLocateMe = async () => {
    const location = await getCurrentLocation()
    if (location) {
      setViewport({
        center: location,
        zoom: 13,
      })
    }
  }

  if (!isMounted) {
    return (
      <div className="bg-muted rounded-lg flex items-center justify-center" style={{ height }}>
        <p>Cargando mapa...</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <InteractiveMap
        markers={markers}
        initialViewport={viewport}
        height={height}
        className={className}
        onMarkerClick={handleMarkerClick}
        selectedMarkerId={selectedMarkerId}
        onViewportChange={setViewport}
      />

      {showLocationButton && (
        <Button
          onClick={handleLocateMe}
          disabled={loading}
          className="absolute bottom-4 right-4 z-10"
          size="sm"
          variant="secondary"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <MapPin className="h-4 w-4 mr-2" />}
          Mi ubicación
        </Button>
      )}
    </div>
  )
}
