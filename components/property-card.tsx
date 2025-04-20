import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPinIcon } from "lucide-react"

interface PropertyCardProps {
  property: {
    id: string | number
    title: string
    location: string
    price: number
    description: string
    image?: string
    images?: Array<{ src: string; alt: string }>
    bedrooms: number
    bathrooms: number
    capacity: number
  }
}

export function PropertyCard({ property }: PropertyCardProps) {
  // Determinar la imagen a mostrar
  const imageSrc =
    property.images?.[0]?.src ||
    property.image ||
    `/placeholder.svg?height=400&width=600&query=rural+house+in+${encodeURIComponent(property.location)}`

  return (
    <Card className="overflow-hidden group h-full">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <div className="mb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold line-clamp-1">{property.title}</h3>
              <div className="flex items-baseline">
                <span className="font-bold text-black text-lg">{property.price}€</span>
                <span className="text-sm text-gray-500 ml-1">/noche</span>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="truncate">{property.location}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">{property.description}</p>
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-4">
              <span>{property.bedrooms} hab.</span>
              <span>{property.bathrooms} baños</span>
              <span>{property.capacity} huésp.</span>
            </div>
          </div>
          <Link href={`/propiedades/${property.id}`} className="block w-full">
            <Button variant="outline" className="w-full bg-black text-white hover:bg-gray-800">
              Ver detalles
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
