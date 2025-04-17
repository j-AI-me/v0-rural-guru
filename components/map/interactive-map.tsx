"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import type { MapMarker, MapViewport, Coordinates } from "@/types/map"

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
  const mapRef = useRef<any>(null)
  const markersLayerRef = useRef<any>(null)
  const [isMapInitialized, setIsMapInitialized] = useState(false)
  const [leaflet, setLeaflet] = useState<any>(null)

  // Dynamically import Leaflet only on client side
  useEffect(() => {
    const importLeaflet = async () => {
      try {
        const L = (await import('leaflet')).default
        // Import CSS
        await import('leaflet/dist/leaflet.css')
        setLeaflet(L)
      } catch (error) {
        console.error("Error loading Leaflet:", error)
      }
    }
    
    importLeaflet()
  }, [])

  // Corregir el problema de los iconos de Leaflet en Next.js
  const fixLeafletIcons = (L: any) => {
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    })
  }

  // Crear un icono personalizado para los marcadores
  const createCustomIcon = (L: any, price?: number, selected = false) => {
    return L.divIcon({
      className: "custom-marker-icon",
      html: `<div class="${
        selected ? "bg-primary text-white" : "bg-white text-primary"
      } font-semibold px-2 py-1 rounded-full border-2 ${
        selected ? "border-white" : "border-primary"
      } shadow-md">${price ? `${price}€` : ""}</div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    })
  }

  // Inicializar el mapa
  useEffect(() => {
    if (!leaflet || mapRef.current) return
    
    fixLeafletIcons(leaflet)

    const map = leaflet.map("map", {
      center: [initialViewport.center.latitude, initialViewport.center.longitude],
      zoom: initialViewport.zoom,
      zoomControl: true,
      attributionControl: true,
      dragging: draggable,
    })

    // Añadir capa de mapa base (OpenStreetMap)
    leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    // Crear capa para los marcadores
    markersLayerRef.current = leaflet.layerGroup().addTo(map)
    mapRef.current = map

    // Evento para detectar cambios en la vista del mapa
    if (onViewportChange) {
      map.on("moveend", () => {
        const center = map.getCenter()
        onViewportChange({
          center: { latitude: center.lat, longitude: center.lng },
          zoom: map.getZoom(),
        })
      })
    }

    setIsMapInitialized(true)

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markersLayerRef.current = null
      }
    }
  }, [leaflet, initialViewport, draggable, onViewportChange])

  // Actualizar marcadores cuando cambian
  useEffect(() => {
    if (!leaflet || !isMapInitialized || !mapRef.current || !markersLayerRef.current) return
    
    // Limpiar marcadores existentes
    markersLayerRef.current.clearLayers()

    // Añadir nuevos marcadores
    markers.forEach((marker) => {
      const isSelected = marker.id === selectedMarkerId
      const icon = createCustomIcon(leaflet, marker.price, isSelected)

      const leafletMarker = leaflet.marker([marker.coordinates.latitude, marker.coordinates.longitude], {
        icon,
        riseOnHover: true,
        zIndexOffset: isSelected ? 1000 : 0,
      }).addTo(markersLayerRef.current)

      // Añadir popup si está habilitado
      if (showPopups) {
        const popupContent = `
          <div class="map-popup">
            <div class="font-semibold">${marker.title}</div>
            ${marker.price ? `<div>${marker.price}€ / noche</div>` : ""}
            ${
              marker.image
                ? `<img src="${marker.image}" alt="${marker.title}" class="w-full h-20 object-cover mt-2 rounded" />`
                : ""
            }
          </div>
        `
        leafletMarker.bindPopup(popupContent)
      }

      // Añadir evento de clic
      if (onMarkerClick) {
        leafletMarker.on("click", () => {
          onMarkerClick(marker.id)
        })
      }
    })

    // Ajustar la vista para mostrar todos los marcadores si hay más de uno
    if (markers.length > 1) {
      const markerPositions = markers.map((m) => [m.coordinates.latitude, m.coordinates.longitude])
      const bounds = leaflet.latLngBounds(markerPositions as [number, number][])
      mapRef.current.fitBounds(bounds, { padding: [50, 50] })
    } else if (markers.length === 1) {
      // Si solo hay un marcador, centrar en él
      mapRef.current.setView(
        [markers[0].coordinates.latitude, markers[0].coordinates.longitude],
        initialViewport.zoom,
      )
    }
  }, [markers, isMapInitialized, selectedMarkerId, showPopups, onMarkerClick, initialViewport.zoom, leaflet])

  // Actualizar la vista cuando cambia el viewport inicial
  useEffect(() => {
    if (leaflet && isMapInitialized && mapRef.current) {
      mapRef.current.setView([initialViewport.center.latitude, initialViewport.center.longitude], initialViewport.zoom)
    }
  }, [initialViewport, isMapInitialized, leaflet])

  return <div id="map" className={cn(mapContainerStyles, className)} style={{ height }} />
}

// Hook para obtener la ubicación actual del usuario
export function useCurrentLocation(): {
  coordinates: Coordinates | null
  loading: boolean
  error: string | null
  getCurrentLocation: () => Promise<Coordinates | null>
} {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getCurrentLocation = async (): Promise<Coordinates | null> => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setError("La geolocalización no está soportada por tu navegador")
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        })
      })

      const newCoordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }

      setCoordinates(newCoordinates)
      setLoading(false)
      return newCoordinates
    } catch (err: any) {
      setError(
        err.code === 1
          ? "Permiso de ubicación denegado"
          : err.code === 2
            ? "Ubicación no disponible"
            : err.code === 3
              ? "Tiempo de espera agotado"
              : "Error desconocido al obtener la ubicación",
      )
      setLoading(false)
      return null
    }
  }

  return { coordinates, loading, error, getCurrentLocation }
}
