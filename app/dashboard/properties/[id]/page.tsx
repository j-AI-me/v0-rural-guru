import { createServerClient } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { PropertyForm } from "@/components/property-form"
import { AvailabilityCalendar } from "@/components/availability-calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Función para obtener una propiedad por ID con verificación de propiedad
async function getProperty(id: string) {
  const supabase = createServerClient()

  // Obtener la sesión del usuario
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  // Obtener la propiedad y verificar que pertenezca al usuario actual
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .eq("user_id", session.user.id) // Verificar que la propiedad pertenezca al usuario
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
  const property = await getProperty(params.id)

  if (!property) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/properties" className="text-gray-500 hover:text-black">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold">Editar Propiedad</h1>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="availability">Disponibilidad</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <PropertyForm property={property} />
        </TabsContent>

        <TabsContent value="availability">
          <AvailabilityCalendar propertyId={property.id} initialPrice={property.price} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
