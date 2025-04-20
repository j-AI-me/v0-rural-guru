export const dynamic = "force-dynamic"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { NavAuthButtons } from "@/components/nav-auth-buttons"

// Propiedades de ejemplo simplificadas
const exampleProperties = [
  {
    id: 1,
    title: "Casa rural en Covadonga",
    location: "Covadonga, Asturias",
    price: 120,
    image: "/asturian-countryside-home.png",
  },
  {
    id: 2,
    title: "Apartamento en Llanes",
    location: "Llanes, Asturias",
    price: 85,
    image: "/llanes-apartment-balcony-view.png",
  },
  {
    id: 3,
    title: "Cabaña en Cangas de Onís",
    location: "Cangas de Onís, Asturias",
    price: 95,
    image: "/asturian-cabin-retreat.png",
  },
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold">
              RuralGuru
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-sm font-medium hover:text-green-600">
                Inicio
              </Link>
              <Link href="/propiedades" className="text-sm font-medium hover:text-green-600">
                Propiedades
              </Link>
            </nav>
          </div>
          <NavAuthButtons />
        </div>
      </header>

      <main className="flex-1">
        <section className="relative h-[500px]">
          <div className="absolute inset-0 bg-gray-200" />
          <div className="container mx-auto px-4 relative z-10 h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Casas rurales en Asturias</h1>
            <p className="text-lg md:text-xl max-w-3xl">
              Encuentra el alojamiento perfecto para tus vacaciones rurales.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">Alojamientos destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {exampleProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <div className="relative h-48 bg-gray-200"></div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold">{property.title}</h3>
                  <p className="text-sm text-gray-500">{property.location}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="font-bold">{property.price}€ / noche</div>
                    <Button variant="outline" className="bg-black text-white hover:bg-gray-800">
                      Ver detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} RuralGuru. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
