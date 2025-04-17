import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"

export default function PropertiesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-2">Propiedades en Asturias</h1>
          <p className="text-muted-foreground mb-8">Explora nuestra selección de alojamientos rurales en Asturias</p>

          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando propiedades...</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
