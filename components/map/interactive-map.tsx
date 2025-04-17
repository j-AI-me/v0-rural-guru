"use client"
import { cn } from "@/lib/utils"

// Tipos
interface Coordinates {
  latitude: number
  longitude: number
}

interface MapMarker {
  id: string
  coordinates: Coordinates
  title: string
  price?: number
  image?: string
}

interface MapViewport {
  center: Coordinates
  zoom: number
}

// Estilos para el contenedor del mapa
const mapContainerStyles = "rounded-lg overflow-hidden border border-border"

interface InteractiveMapProps {
  markers: MapMarker[]
  initialViewport?: MapViewport
  height?: string
  className?: string
  onMarkerClick?: (markerId: string) => void
  selectedMarkerId?: string
  showPopups?: boolean
  draggable?: boolean
  onViewportChange?: (viewport: MapViewport) => void
}

export function InteractiveMap({
  markers,
  initialViewport = {
    center: { latitude: 43.3602, longitude: -5.8447 }, // Asturias, España
    zoom: 9,
  },
  height = "500px",
  className,
  onMarkerClick,
  selectedMarkerId,
  showPopups = true,
  draggable = true,
  onViewportChange,
}: InteractiveMapProps) {
  // Simulación de mapa para evitar errores
  return (
    <div id="map" className={cn(mapContainerStyles, className)} style={{ height }}>
      <div className="flex items-center justify-center h-full bg-muted">
        <p className="text-muted-foreground">Mapa no disponible</p>
      </div>
    </div>
  )
}

// Hook simplificado para ubicación actual
export function useCurrentLocation() {
  return {
    coordinates: null,
    loading: false,
    error: null,
    getCurrentLocation: async () => null,
  }
}
