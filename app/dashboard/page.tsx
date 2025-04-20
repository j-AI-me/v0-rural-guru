import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <p className="mb-4">Bienvenido al dashboard de RuralGuru.</p>
        <p>Estamos trabajando en esta sección. Vuelve pronto.</p>
      </div>

      <div className="mt-6">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Volver al inicio
        </Link>
      </div>
    </div>
  )
}
