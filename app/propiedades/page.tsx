import Link from "next/link"
import { Button } from "@/components/ui/button"
import { dynamic, dynamicParams, revalidate, fetchCache, runtime, preferredRegion } from "../config"

// Exportar la configuración
export { dynamic, dynamicParams, revalidate, fetchCache, runtime, preferredRegion }

export default function PropiedadesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Propiedades en Asturias</h1>

      <div className="text-center py-12">
        <p className="text-xl mb-4">Estamos cargando las propiedades...</p>
        <Link href="/">
          <Button className="bg-black hover:bg-gray-800">Volver al inicio</Button>
        </Link>
      </div>
    </div>
  )
}
