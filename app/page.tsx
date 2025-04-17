import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Users, Calendar } from "lucide-react"

// Propiedades de demostración estáticas
const demoProperties = [
  {
    id: "1",
    name: "The Auteiro Crown",
    description: "Casa rural en la montaña con vistas y jardín",
    location: "Asturias",
    price: 95,
    image_url: "/countryside-cottage.png",
  },
  {
    id: "2",
    name: "Maria Manuela Hotel & Spa",
    description: "Hotel moderno con spa en entorno rural",
    location: "Asturias",
    price: 120,
    image_url: "/countryside-retreat.png",
  },
  {
    id: "3",
    name: "El Bricial Hotel",
    description: "Hotel en Asturias, cerca de Covadonga",
    location: "Covadonga",
    price: 85,
    image_url: "/covadonga-sanctuary-view.png",
  },
]

export default function Home() {
  // Usamos directamente las propiedades de demostración para evitar errores
  const properties = demoProperties

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="relative h-[500px] w-full">
            <Image
              src="/mountain-village-vista.png"
              alt="Paisaje rural de Asturias"
              fill
              className="object-cover brightness-[0.7]"
              priority
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-8">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Amplia selección de casas rurales en Asturias
              </h1>
              <p className="text-lg md:text-xl text-white mb-8 max-w-3xl">
                Encuentra el alojamiento perfecto para tus vacaciones rurales con nuestra cuidada selección de casas y
                cabañas en los mejores entornos naturales.
              </p>
              <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="¿Dónde quieres ir?"
                      className="w-full pl-10 pr-4 py-2 border rounded-md"
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <input type="text" placeholder="Llegada" className="w-full pl-10 pr-4 py-2 border rounded-md" />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <input type="text" placeholder="Salida" className="w-full pl-10 pr-4 py-2 border rounded-md" />
                  </div>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <select className="w-full pl-10 pr-4 py-2 border rounded-md appearance-none">
                      <option value="">Huéspedes</option>
                      <option value="1">1 huésped</option>
                      <option value="2">2 huéspedes</option>
                      <option value="3">3 huéspedes</option>
                      <option value="4">4+ huéspedes</option>
                    </select>
                  </div>
                </div>
                <Button className="w-full mt-4" size="lg">
                  <Search className="mr-2 h-5 w-5" /> Buscar alojamiento
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Properties */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8 text-center">Alojamientos destacados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property, index) => (
                <Card key={property.id || index} className="overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={
                        property.image_url ||
                        `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(property.name) || "rural house"}`
                      }
                      alt={property.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{property.name}</h3>
                      <span className="font-bold">{property.price || "95"}€/noche</span>
                    </div>
                    <div className="flex items-center text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.location || "Asturias"}</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{property.description}</p>
                    <Link href={`/properties/${property.id}`}>
                      <Button className="w-full">Ver detalles</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/properties">
                <Button variant="outline" size="lg">
                  Ver todos los alojamientos
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
