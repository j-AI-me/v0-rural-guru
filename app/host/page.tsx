import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Check, Home, Upload, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"

export default function HostPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-1">
        <section className="relative">
          <div className="absolute inset-0 z-0">
            <Image
              src="/placeholder.svg?key=fe7kp"
              alt="Anfitrión en Asturias"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="container relative z-10 py-24 md:py-32">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Conviértete en anfitrión en RuralGuru</h1>
              <p className="mt-6 text-lg">
                Comparte tu propiedad rural y genera ingresos adicionales. Nosotros te ayudamos en todo el proceso.
              </p>
              <div className="mt-8">
                <Link href="/register?type=host">
                  <Button size="lg" className="gap-2">
                    Regístrate ahora
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="container py-16">
          <h2 className="text-3xl font-bold text-center mb-12">¿Por qué ser anfitrión con nosotros?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Home className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Rentabiliza tu propiedad</CardTitle>
                <CardDescription>
                  Genera ingresos adicionales compartiendo tu casa rural cuando no la utilices.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Fija tus propios precios</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Controla tu disponibilidad</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Pagos seguros y puntuales</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Upload className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Publicación sencilla</CardTitle>
                <CardDescription>
                  Crear y gestionar tu anuncio es fácil con nuestras herramientas intuitivas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Asistente de publicación</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Consejos profesionales</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Gestión desde cualquier dispositivo</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Soporte completo</CardTitle>
                <CardDescription>
                  Te acompañamos en todo el proceso con nuestro equipo de atención al anfitrión.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Asistencia 24/7</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Seguro para anfitriones</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Verificación de huéspedes</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="bg-muted py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Cumplimiento legal simplificado</h2>
                <p className="text-lg mb-6">
                  Nos encargamos de que tu alojamiento cumpla con toda la normativa española, incluyendo:
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Registro de viajeros</p>
                      <p className="text-muted-foreground">
                        Sistema automatizado para el registro obligatorio de huéspedes con la Policía Nacional/Guardia
                        Civil.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Protección de datos (RGPD)</p>
                      <p className="text-muted-foreground">
                        Gestión segura de los datos personales conforme a la normativa europea.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Facturación y fiscalidad</p>
                      <p className="text-muted-foreground">
                        Herramientas para la gestión fiscal y contable de tu actividad como anfitrión.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="relative aspect-video">
                <Image
                  src="/legal-work-from-home.png"
                  alt="Cumplimiento legal"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="container py-16">
          <h2 className="text-3xl font-bold text-center mb-12">¿Cómo funciona?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Crea tu cuenta</h3>
              <p className="text-muted-foreground">
                Regístrate como anfitrión y completa tu perfil con tus datos personales y de contacto.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Publica tu propiedad</h3>
              <p className="text-muted-foreground">
                Añade fotos, descripción, servicios y establece precios y disponibilidad de tu alojamiento.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Recibe reservas</h3>
              <p className="text-muted-foreground">
                Gestiona las solicitudes, comunícate con los huéspedes y recibe pagos de forma segura.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/register?type=host">
              <Button size="lg">Regístrate como anfitrión</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
