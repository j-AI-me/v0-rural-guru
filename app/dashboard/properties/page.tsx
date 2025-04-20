import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Plus, Edit, Trash2, CalendarDays } from "lucide-react"
import Link from "next/link"
import { createServerClient } from "@/lib/supabase"
import { requireAuth } from "@/lib/auth"

// Función para obtener propiedades desde Supabase
async function getProperties() {
  const supabase = createServerClient()

  // Obtener la sesión del usuario
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return []
  }

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching properties:", error)
    return []
  }

  return data || []
}

export default async function PropertiesPage() {
  // Verificar que el usuario esté autenticado
  await requireAuth()

  const properties = await getProperties()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Propiedades</h1>
        <Link href="/dashboard/properties/new">
          <Button className="bg-black hover:bg-gray-800">
            <Plus className="mr-2 h-4 w-4" /> Añadir Propiedad
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.length > 0 ? (
          properties.map((property) => (
            <Card key={property.id}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {property.title}
                </CardTitle>
                <CardDescription>{property.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Habitaciones:</span>
                    <span>{property.bedrooms}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estado:</span>
                    <span className={property.status === "active" ? "text-green-500" : "text-amber-500"}>
                      {property.status === "active" ? "Activo" : "Mantenimiento"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Precio:</span>
                    <span className="font-medium">{property.price}€/noche</span>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Link href={`/dashboard/properties/${property.id}/reservations`}>
                      <Button variant="outline" size="sm">
                        <CalendarDays className="h-4 w-4 mr-1" /> Reservas
                      </Button>
                    </Link>
                    <Link href={`/dashboard/properties/${property.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" /> Editar
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-500">
                      <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay propiedades</h3>
            <p className="text-gray-500 mb-4">Aún no has añadido ninguna propiedad.</p>
            <Link href="/dashboard/properties/new">
              <Button className="bg-black hover:bg-gray-800">
                <Plus className="mr-2 h-4 w-4" /> Añadir primera propiedad
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
