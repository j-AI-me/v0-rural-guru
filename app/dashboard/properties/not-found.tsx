import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <Building2 className="h-16 w-16 text-gray-400 mb-6" />
      <h1 className="text-3xl font-bold mb-2">Propiedad no encontrada</h1>
      <p className="text-gray-500 mb-6 max-w-md">La propiedad que estás buscando no existe o ha sido eliminada.</p>
      <Link href="/dashboard/properties">
        <Button className="bg-black hover:bg-gray-800">Volver a propiedades</Button>
      </Link>
    </div>
  )
}
