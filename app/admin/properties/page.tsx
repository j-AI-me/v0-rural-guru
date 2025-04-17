import Link from "next/link"
import { Building, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminPropertiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Propiedades</h1>
          <p className="text-muted-foreground">Gestiona las propiedades de la plataforma</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Añadir propiedad
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar propiedades..." className="pl-8" />
        </div>
        <Button variant="outline">Filtros</Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="active">Activas</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="inactive">Inactivas</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Todas las propiedades</CardTitle>
              <CardDescription>Lista de todas las propiedades en la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-[1fr_150px_150px_100px_100px] gap-4 border-b pb-4">
                  <div className="font-medium">Nombre</div>
                  <div className="font-medium">Ubicación</div>
                  <div className="font-medium">Anfitrión</div>
                  <div className="font-medium">Estado</div>
                  <div className="font-medium">Acciones</div>
                </div>

                {[
                  {
                    id: 1,
                    name: "Cabaña en Cangas de Onís",
                    location: "Cangas de Onís",
                    host: "María G.",
                    status: "active",
                  },
                  {
                    id: 2,
                    name: "Casa rural en Covadonga",
                    location: "Covadonga",
                    host: "Juan P.",
                    status: "pending",
                  },
                  {
                    id: 3,
                    name: "Apartamento en Llanes",
                    location: "Llanes",
                    host: "Carlos R.",
                    status: "active",
                  },
                  {
                    id: 4,
                    name: "Villa en Ribadesella",
                    location: "Ribadesella",
                    host: "Ana G.",
                    status: "inactive",
                  },
                  {
                    id: 5,
                    name: "Casa de campo en Picos de Europa",
                    location: "Picos de Europa",
                    host: "Pedro S.",
                    status: "active",
                  },
                ].map((property) => (
                  <div key={property.id} className="grid grid-cols-[1fr_150px_150px_100px_100px] gap-4 border-b pb-4">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{property.name}</span>
                    </div>
                    <div>{property.location}</div>
                    <div>{property.host}</div>
                    <div>
                      {property.status === "active" && (
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-700 border-green-200">
                          Activa
                        </span>
                      )}
                      {property.status === "pending" && (
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-50 text-yellow-700 border-yellow-200">
                          Pendiente
                        </span>
                      )}
                      {property.status === "inactive" && (
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-gray-50 text-gray-700 border-gray-200">
                          Inactiva
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/properties/${property.id}`} className="text-sm text-primary hover:underline">
                        Editar
                      </Link>
                      <button className="text-sm text-red-500 hover:underline">Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Propiedades activas</CardTitle>
              <CardDescription>Lista de propiedades activas en la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Propiedades activas</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Propiedades pendientes</CardTitle>
              <CardDescription>Propiedades pendientes de aprobación</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Propiedades pendientes</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inactive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Propiedades inactivas</CardTitle>
              <CardDescription>Propiedades desactivadas o suspendidas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Propiedades inactivas</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
