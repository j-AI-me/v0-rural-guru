"use client"

import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

// Componente simplificado para evitar errores
export function PropertiesMap({ height = "600px", className }) {
  return (
    <div className="relative">
      <div className="w-full rounded-lg bg-muted flex items-center justify-center" style={{ height }}>
        <p className="text-muted-foreground">Mapa no disponible</p>
      </div>

      <Button className="absolute bottom-4 right-4 z-10" size="sm" variant="secondary">
        <MapPin className="h-4 w-4 mr-2" />
        Mi ubicación
      </Button>
    </div>
  )
}
