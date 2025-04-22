import { createServerClient } from "@/lib/supabase"
import { requireAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PropertyReviewsList } from "@/components/reviews/property-reviews-list"

export default async function ReviewsPage() {
  // Verificar que el usuario esté autenticado
  const session = await requireAuth()
  const userId = session.user.id

  // Obtener las propiedades del usuario
  const supabase = createServerClient()
  const { data: properties } = await supabase.from("properties").select("id, name").eq("host_id", userId).order("name")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Valoraciones</h1>
        <p className="text-gray-500 mt-2">
          Gestiona las valoraciones de tus propiedades y responde a los comentarios de tus huéspedes.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Valoraciones de tus propiedades</CardTitle>
          <CardDescription>
            Responder a las valoraciones de tus huéspedes puede aumentar la confianza y mejorar tu reputación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {properties && properties.length > 0 ? (
            <Tabs defaultValue={properties[0].id} className="w-full">
              <TabsList className="mb-4 flex flex-wrap">
                {properties.map((property) => (
                  <TabsTrigger key={property.id} value={property.id}>
                    {property.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {properties.map((property) => (
                <TabsContent key={property.id} value={property.id}>
                  <PropertyReviewsList propertyId={property.id} />
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium">No tienes propiedades</h3>
              <p className="text-gray-500 mt-2">Añade propiedades para poder recibir valoraciones de tus huéspedes.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
