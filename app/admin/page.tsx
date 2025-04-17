import { Building, Calendar, TrendingUp, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido al panel de administración de AsturiasRural</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propiedades</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">+6 nuevas este mes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground">+180 nuevos este mes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">324</div>
            <p className="text-xs text-muted-foreground">+18% desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€12,234</div>
            <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
          <TabsTrigger value="reports">Informes</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Propiedades pendientes de aprobación</CardTitle>
              <CardDescription>Propiedades que requieren revisión y aprobación</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-[1fr_100px_100px] gap-4 border-b pb-4">
                  <div className="font-medium">Nombre</div>
                  <div className="font-medium">Anfitrión</div>
                  <div className="font-medium">Acción</div>
                </div>
                <div className="grid grid-cols-[1fr_100px_100px] gap-4 border-b pb-4">
                  <div>Casa rural en Covadonga</div>
                  <div>Juan P.</div>
                  <div className="flex gap-2">
                    <button className="text-sm text-primary hover:underline">Revisar</button>
                  </div>
                </div>
                <div className="grid grid-cols-[1fr_100px_100px] gap-4 border-b pb-4">
                  <div>Apartamento en Llanes</div>
                  <div>María G.</div>
                  <div className="flex gap-2">
                    <button className="text-sm text-primary hover:underline">Revisar</button>
                  </div>
                </div>
                <div className="grid grid-cols-[1fr_100px_100px] gap-4 border-b pb-4">
                  <div>Cabaña en Picos de Europa</div>
                  <div>Carlos R.</div>
                  <div className="flex gap-2">
                    <button className="text-sm text-primary hover:underline">Revisar</button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Últimas reservas</CardTitle>
              <CardDescription>Reservas realizadas recientemente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-[1fr_150px_100px_100px] gap-4 border-b pb-4">
                  <div className="font-medium">Propiedad</div>
                  <div className="font-medium">Huésped</div>
                  <div className="font-medium">Fechas</div>
                  <div className="font-medium">Estado</div>
                </div>
                <div className="grid grid-cols-[1fr_150px_100px_100px] gap-4 border-b pb-4">
                  <div>Casa rural en Covadonga</div>
                  <div>Laura M.</div>
                  <div>10-15 Abr</div>
                  <div>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-700 border-green-200">
                      Confirmada
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-[1fr_150px_100px_100px] gap-4 border-b pb-4">
                  <div>Cabaña en Cangas de Onís</div>
                  <div>Pedro S.</div>
                  <div>12-14 Abr</div>
                  <div>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-50 text-yellow-700 border-yellow-200">
                      Pendiente
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-[1fr_150px_100px_100px] gap-4 border-b pb-4">
                  <div>Villa en Ribadesella</div>
                  <div>Ana G.</div>
                  <div>15-20 Abr</div>
                  <div>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-700 border-green-200">
                      Confirmada
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analíticas</CardTitle>
              <CardDescription>Estadísticas y métricas de la plataforma</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center border rounded-md">
              <p className="text-muted-foreground">Gráficos de analíticas</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informes</CardTitle>
              <CardDescription>Informes detallados de actividad</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center border rounded-md">
              <p className="text-muted-foreground">Informes y reportes</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
