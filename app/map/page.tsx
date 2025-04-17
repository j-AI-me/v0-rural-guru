import Link from "next/link"
import { ArrowLeft, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PropertiesMapWrapper } from "@/components/map/properties-map-wrapper"

export default function MapPage() {
  return (
    <div className="space-y-6 py-6">
      <div className="flex justify-between items-center">
        <Link href="/properties" className="inline-flex items-center gap-1 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Volver a la lista
        </Link>

        <Button variant="outline" size="sm" id="fullscreen-toggle">
          <List className="h-4 w-4 mr-2" />
          <span id="fullscreen-text">Pantalla completa</span>
        </Button>
      </div>

      <h1 className="text-3xl font-bold">Explora propiedades en el mapa</h1>
      <p className="text-muted-foreground">
        Visualiza todas nuestras propiedades en el mapa y encuentra la ubicación perfecta para tu estancia.
      </p>

      <div id="map-container">
        <PropertiesMapWrapper height="70vh" />
      </div>
    </div>
  )
}
