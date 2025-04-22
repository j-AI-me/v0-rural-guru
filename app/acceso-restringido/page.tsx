import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export default function AccesoRestringidoPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            RuralGuru
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="outline" className="mr-2">
                Iniciar sesión
              </Button>
            </Link>
            <Link href="/auth/registro">
              <Button>Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">Acceso restringido</h1>
            <p className="text-xl text-gray-600">
              Esta sección requiere una cuenta para acceder a todas sus funcionalidades
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Para propietarios</CardTitle>
                <CardDescription>Gestiona tus propiedades rurales y maximiza tus ingresos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <p>Publica tus propiedades rurales y gestiona su disponibilidad</p>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <p>Recibe reservas y gestiona el calendario de ocupación</p>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <p>Accede a estadísticas detalladas sobre el rendimiento de tus propiedades</p>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <p>Comunícate directamente con los huéspedes</p>
                  </div>
                </div>

                <div className="mt-8">
                  <Link href="/auth/registro">
                    <Button className="w-full">Registrarse como propietario</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Para viajeros</CardTitle>
                <CardDescription>Encuentra y reserva los mejores alojamientos rurales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <p>Guarda tus alojamientos favoritos para futuras visitas</p>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <p>Gestiona tus reservas y recibe confirmaciones automáticas</p>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <p>Deja valoraciones y comentarios sobre tus experiencias</p>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <p>Recibe recomendaciones personalizadas según tus preferencias</p>
                  </div>
                </div>

                <div className="mt-8">
                  <Link href="/auth/registro">
                    <Button className="w-full">Registrarse como viajero</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">¿Ya tienes una cuenta?</h2>
            <p className="text-center mb-6">Inicia sesión para acceder a todas las funcionalidades de RuralGuru</p>
            <div className="flex justify-center">
              <Link href="/auth/login">
                <Button size="lg">Iniciar sesión</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} RuralGuru. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
