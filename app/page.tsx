import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold">
              RuralGuru
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-sm">
                Iniciar sesión
              </Button>
            </Link>
            <Link href="/auth/registro">
              <Button className="text-sm bg-black hover:bg-gray-800">Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Bienvenido a RuralGuru</h1>
          <p className="text-xl mb-8">Tu plataforma para encontrar alojamientos rurales en Asturias</p>
          <div className="flex gap-4 justify-center">
            <Link href="/propiedades">
              <Button className="bg-black hover:bg-gray-800">Ver propiedades</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">Ir al dashboard</Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-4 text-center">
        <p className="text-sm text-gray-600">© {new Date().getFullYear()} RuralGuru. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
