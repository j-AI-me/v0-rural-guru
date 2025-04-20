import { Card, CardContent } from "@/components/ui/card"
import { requireAuth } from "@/lib/auth"
import { dynamic, dynamicParams, revalidate, fetchCache, runtime, preferredRegion } from "../config"

// Exportar la configuración
export { dynamic, dynamicParams, revalidate, fetchCache, runtime, preferredRegion }

export default async function DashboardPage() {
  // Verificar que el usuario esté autenticado
  try {
    await requireAuth()
  } catch (error) {
    console.error("Error de autenticación:", error)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <Card>
        <CardContent className="p-6">
          <p>Bienvenido al dashboard de RuralGuru.</p>
        </CardContent>
      </Card>
    </div>
  )
}
