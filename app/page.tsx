import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, MapPinIcon, Search, Users } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { es } from "date-fns/locale"
import { PropertyCard } from "@/components/property-card"
import { NavAuthButtons } from "@/components/nav-auth-buttons"

// Marcamos la función como asíncrona y la separamos para evitar pasarla directamente al componente
async function getFeaturedProperties() {
  "use server"

  const { createServerClient } = await import("@/lib/supabase")
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(3)

  if (error) {
    console.error("Error fetching properties:", error)
    return []
  }

  return data || []
}

export default async function Home() {
  const featuredProperties = await getFeaturedProperties()

  // Propiedades de ejemplo para usar si no hay datos en Supabase
  const exampleProperties = [
    {
      id: 1,
      title: "Casa rural en Covadonga",
      location: "Covadonga, Asturias",
      price: 120,
      description: "Encantadora casa rural con vistas a los Picos de Europa, cerca del Santuario de Covadonga.",
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
      description: "Moderno apartamento en el centro de Llanes, a pocos minutos de las playas más bonitas de Asturias.",
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
      description: "Hermosa cabaña de madera situada en un entorno natural privilegiado cerca de Cangas de Onís.",
      image: "/asturian-cabin-retreat.png",
      bedrooms: 2,
      bathrooms: 1,
      capacity: 5,
    },
  ]

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
              <Link href="/sobre-nosotros" className="text-sm font-medium hover:text-green-600">
                Sobre nosotros
              </Link>
              <Link href="/contacto" className="text-sm font-medium hover:text-green-600">
                Contacto
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <span className="sr-only">Cambiar idioma</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                <path d="M2 12h20" />
              </svg>
            </Button>
            <NavAuthButtons />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative h-[500px]">
          <Image src="/asturias-peaks.png" alt="Paisaje rural de Asturias" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/30" />
          <div className="container mx-auto px-4 relative z-10 h-full flex flex-col items-center justify-center text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Amplia selección de casas rurales en Asturias</h1>
            <p className="text-lg md:text-xl max-w-3xl">
              Encuentra el alojamiento perfecto para tus vacaciones rurales con nuestra cuidada selección de casas y
              cabañas en los mejores entornos naturales.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 -mt-16 relative z-20">
          <Card className="p-6 shadow-lg">
            <CardContent className="p-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input placeholder="¿Dónde quieres ir?" className="pl-10" />
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal w-full">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>Llegada</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" locale={es} showOutsideDays={false} className="border-0" />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal w-full">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>Salida</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" locale={es} showOutsideDays={false} className="border-0" />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal w-full">
                      <Users className="mr-2 h-4 w-4" />
                      <span>Huéspedes</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-60" align="start">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Adultos</span>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            -
                          </Button>
                          <span>2</span>
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Niños</span>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            -
                          </Button>
                          <span>0</span>
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <Button className="w-full bg-black hover:bg-gray-800">
                <Search className="mr-2 h-4 w-4" />
                Buscar alojamiento
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="container mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">Alojamientos destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProperties.length > 0
              ? featuredProperties.map((property) => <PropertyCard key={property.id} property={property} />)
              : exampleProperties.map((property) => <PropertyCard key={property.id} property={property} />)}
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">RuralGuru</h3>
              <p className="text-sm text-gray-600">
                Tu plataforma para encontrar los mejores alojamientos rurales en España.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Enlaces</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-black">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/propiedades" className="text-gray-600 hover:text-black">
                    Propiedades
                  </Link>
                </li>
                <li>
                  <Link href="/sobre-nosotros" className="text-gray-600 hover:text-black">
                    Sobre nosotros
                  </Link>
                </li>
                <li>
                  <Link href="/contacto" className="text-gray-600 hover:text-black">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Destinos populares</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-black">
                    Asturias
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-gray-600 hover:text-black">
                    Cantabria
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-gray-600 hover:text-black">
                    Galicia
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-gray-600 hover:text-black">
                    Castilla y León
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contacto</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-gray-600">info@ruralguru.com</li>
                <li className="text-gray-600">+34 900 123 456</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} RuralGuru. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
