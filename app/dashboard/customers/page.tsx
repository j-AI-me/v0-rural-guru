import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Users } from "lucide-react"

export default function CustomersPage() {
  // Datos de ejemplo - en una implementación real, estos vendrían de QloApps
  const customers = [
    {
      id: 1,
      name: "María García",
      email: "maria.garcia@example.com",
      phone: "+34 612 345 678",
      bookings: 3,
      lastBooking: "2023-11-15",
    },
    {
      id: 2,
      name: "Juan Pérez",
      email: "juan.perez@example.com",
      phone: "+34 623 456 789",
      bookings: 1,
      lastBooking: "2023-11-18",
    },
    {
      id: 3,
      name: "Ana Martínez",
      email: "ana.martinez@example.com",
      phone: "+34 634 567 890",
      bookings: 2,
      lastBooking: "2023-11-25",
    },
    {
      id: 4,
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@example.com",
      phone: "+34 645 678 901",
      bookings: 1,
      lastBooking: "2023-12-05",
    },
    {
      id: 5,
      name: "Laura Fernández",
      email: "laura.fernandez@example.com",
      phone: "+34 656 789 012",
      bookings: 0,
      lastBooking: null,
    },
  ]

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Button className="bg-black hover:bg-gray-800">
          <Plus className="mr-2 h-4 w-4" /> Añadir Cliente
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Directorio de Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar clientes..." className="pl-8" />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Reservas</TableHead>
                  <TableHead>Última Reserva</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.bookings}</TableCell>
                    <TableCell>{formatDate(customer.lastBooking)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Ver
                      </Button>
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
