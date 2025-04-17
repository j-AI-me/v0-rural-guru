import Link from "next/link"
import Image from "next/image"
import { MapPin, Star } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PropertyCardProps {
  property: {
    id: number | string
    name: string
    location: string
    price: number
    rating: number
    reviews: number
    image: string
  }
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="relative aspect-[4/3]">
          <Image src={property.image || "/placeholder.svg"} alt={property.name} fill className="object-cover" />
          <Badge className="absolute top-2 right-2">{property.price}€ / noche</Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-1">{property.name}</h3>
          <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
            <MapPin className="h-3 w-3" />
            <span>{property.location}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-medium">{property.rating}</span>
            <span className="text-muted-foreground text-sm">({property.reviews} reseñas)</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
