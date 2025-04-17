"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { MapMarker } from "@/types/map"

// Dynamically import the map component with no SSR
const DynamicInteractiveMap = dynamic(
  () => import("@/components/map/interactive-map").then((mod) => mod.InteractiveMap),
  { ssr: false },
)

interface PropertyLocationProps {
  property: {
    id: string
    name: string
    location: string
    latitude?: number
    longitude?: number
  }
  height?: string
}

export function PropertyLocation({ property, height = "300px" }: PropertyLocationProps) {
  const [marker, setMarker] = useState<MapMarker | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    if (property.latitude && property.longitude) {
      setMarker({
        id: property.id,
        coordinates: {
          latitude: property.latitude,
          longitude: property.longitude,
        },
        title: property.name,
      })
    }
  }, [property])

  const openDirections = () => {
    if (typeof window !== "undefined" && property.latitude && property.longitude) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`,
        "_blank",
      )
    }
  }

  if (!property.latitude || !property.longitude) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Ubicación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{property.location}</p>
          <p className="text-sm text-muted-foreground mt-2">Ubicación exacta no disponible en el mapa</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Ubicación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{property.location}</p>

        {isMounted && marker && (
          <div className="rounded-md overflow-hidden">
            <DynamicInteractiveMap
              markers={[marker]}
              initialViewport={{
                center: marker.coordinates,
                zoom: 14,
              }}
              height={height}
              draggable={false}
            />
          </div>
        )}

        <Button onClick={openDirections} variant="outline" className="w-full gap-2">
          <Navigation className="h-4 w-4" />
          Cómo llegar
        </Button>
      </CardContent>
    </Card>
  )
}
