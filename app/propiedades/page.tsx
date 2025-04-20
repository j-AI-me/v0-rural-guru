import Link from "next/link"

export default function PropiedadesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Propiedades en Asturias</h1>

      <div className="text-center py-12">
        <p className="text-xl mb-4">Estamos trabajando en esta sección. Vuelve pronto.</p>
        <Link href="/" className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
