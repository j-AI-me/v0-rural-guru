import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart, PieChart, Calendar, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Informes</h1>
        <div className="flex gap-2">
          <Select defaultValue="month">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
              <SelectItem value="quarter">Este trimestre</SelectItem>
              <SelectItem value="year">Este año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Personalizar
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="bookings">Reservas</TabsTrigger>
          <TabsTrigger value="revenue">Ingresos</TabsTrigger>
          <TabsTrigger value="properties">Propiedades</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Ingresos Totales</CardTitle>
                <CardDescription>Ingresos del periodo actual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">€4,550.00</div>
                <p className="text-sm text-muted-foreground mt-2">+20.1% respecto al periodo anterior</p>
                <div className="h-[150px] flex items-center justify-center text-muted-foreground mt-4">
                  <LineChart className="h-8 w-8 mr-2" />
                  Gráfico de ingresos
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reservas</CardTitle>
                <CardDescription>Total de reservas del periodo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12</div>
                <p className="text-sm text-muted-foreground mt-2">+4 respecto al periodo anterior</p>
                <div className="h-[150px] flex items-center justify-center text-muted-foreground mt-4">
                  <BarChart className="h-8 w-8 mr-2" />
                  Gráfico de reservas
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ocupación</CardTitle>
                <CardDescription>Tasa de ocupación del periodo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">68%</div>
                <p className="text-sm text-muted-foreground mt-2">+12% respecto al periodo anterior</p>
                <div className="h-[150px] flex items-center justify-center text-muted-foreground mt-4">
                  <PieChart className="h-8 w-8 mr-2" />
                  Gráfico de ocupación
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rendimiento Mensual</CardTitle>
              <CardDescription>Comparativa de ingresos y reservas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <BarChart className="h-8 w-8 mr-2" />
                Gráfico de rendimiento mensual
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Reservas</CardTitle>
              <CardDescription>Desglose detallado de las reservas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                <BarChart className="h-8 w-8 mr-2" />
                Gráfico detallado de reservas
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Ingresos</CardTitle>
              <CardDescription>Desglose detallado de los ingresos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                <LineChart className="h-8 w-8 mr-2" />
                Gráfico detallado de ingresos
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento de Propiedades</CardTitle>
              <CardDescription>Análisis comparativo de propiedades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                <PieChart className="h-8 w-8 mr-2" />
                Gráfico de rendimiento de propiedades
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
