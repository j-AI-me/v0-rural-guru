import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MapPinIcon, Search, Filter } from "lucide-react"
import { createServerClient } from "@/lib/supabase"

// Función para obtener propiedades desde Supabase
async function getProperties() {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching properties:", error)
    return []
  }

  return data || []
}

export default async function PropiedadesPage() {
  const properties = await getProperties()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Propiedades en Asturias</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input placeholder="Buscar por ubicación, tipo de propiedad..." className="pl-10" />
        </div>
        <Button variant="outline" className="flex gap-2">
          <Filter className="h-5 w-5" />
          Filtros
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.length > 0
          ? properties.map((property) => (
              <Card key={property.id} className="overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={
                      property.images?.[0]?.src || "/placeholder.svg?height=400&width=600&query=rural+house+in+asturias"
                    }
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
                        <div className="flex items-center">
                          <span className="font-bold text-black">{property.price}€</span>
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
                    <Link href={`/propiedades/${property.id}`}>
                      <Button variant="outline" className="w-full bg-black text-white hover:bg-gray-800">
                        Ver detalles
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          : // Propiedades de ejemplo si no hay datos en Supabase
            [
              {
                id: 1,
                title: "Casa rural en Covadonga",
                location: "Covadonga, Asturias",
                price: 120,
                description:
                  "Encantadora casa rural con vistas a los Picos de Europa, cerca del Santuario de Covadonga. Ideal para familias y amantes de la naturaleza.",
                image: "/asturian-countryside-home.png",
                bedrooms: 3,
                bathrooms: 2,
                capacity: 6,
              },
              {
                id: 2,
                title: "Apartamento en Llanes",
                location: "Llanes, Asturias",
                price: 85,
                description:
                  "Moderno apartamento en el centro de Llanes, a pocos minutos de las playas más bonitas de Asturias. Perfecto para parejas.",
                image: "/llanes-apartment-balcony-view.png",
                bedrooms: 1,
                bathrooms: 1,
                capacity: 4,
              },
              {
                id: 3,
                title: "Cabaña en Cangas de Onís",
                location: "Cangas de Onís, Asturias",
                price: 95,
                description:
                  "Hermosa cabaña de madera situada en un entorno natural privilegiado cerca de Cangas de Onís. Disfruta de la tranquilidad y la naturaleza.",
                image: "/asturian-cabin-retreat.png",
                bedrooms: 2,
                bathrooms: 1,
                capacity: 5,
              },
              {
                id: 4,
                title: "Casa de piedra en Ribadesella",
                location: "Ribadesella, Asturias",
                price: 110,
                description:
                  "Tradicional casa de piedra completamente restaurada en Ribadesella. A 10 minutos de la playa y con vistas al mar Cantábrico.",
                image: "/ribadesella-stone-house.png",
                bedrooms: 3,
                bathrooms: 2,
                capacity: 6,
              },
              {
                id: 5,
                title: "Apartamento rural en Gijón",
                location: "Gijón, Asturias",
                price: 75,
                description:
                  "Acogedor apartamento rural en las afueras de Gijón. Combina la tranquilidad del campo con la cercanía a la ciudad.",
                image: "/asturian-countryside-apartment.png",
                bedrooms: 1,
                bathrooms: 1,
                capacity: 3,
              },
              {
                id: 6,
                title: "Villa con piscina en Villaviciosa",
                location: "Villaviciosa, Asturias",
                price: 150,
                description:
                  "Espectacular villa con piscina privada en Villaviciosa. Ideal para grupos grandes y celebraciones familiares.",
                image: "/asturian-villa-retreat.png",
                bedrooms: 4,
                bathrooms: 3,
                capacity: 8,
              },
            ].map((property) => (
              <Card key={property.id} className="overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={property.image || "/placeholder.svg"}
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
                        <div className="flex items-center">
                          <span className="font-bold text-black">{property.price}€</span>
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
                    <Button variant="outline" className="w-full bg-black text-white hover:bg-gray-800">
                      Ver detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  )
}
