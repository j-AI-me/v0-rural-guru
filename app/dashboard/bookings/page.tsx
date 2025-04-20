import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, Filter, Plus } from "lucide-react"
import { createServerClient } from "@/lib/supabase"
import { requireAuth } from "@/lib/auth"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

// Función para obtener las reservas del usuario
async function getUserBookings() {
  const supabase = createServerClient()

  // Obtener la sesión del usuario
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return []
  }

  // Obtener las reservas del usuario
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      property:properties(id, title, location)
    `)
    .eq("guest_id", session.user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error al obtener las reservas:", error)
    return []
  }

  return data || []
}

export default async function BookingsPage() {
  // Verificar que el usuario esté autenticado
  await requireAuth()

  // Obtener las reservas del usuario
  const bookings = await getUserBookings()

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "d MMM yyyy", { locale: es })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mis Reservas</h1>
        <Link href="/propiedades">
          <Button className="bg-black hover:bg-gray-800">
            <Plus className="mr-2 h-4 w-4" /> Nueva Reserva
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Reservas Realizadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="confirmed">Confirmadas</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="cancelled">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {bookings.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Propiedad</TableHead>
                    <TableHead>Entrada</TableHead>
                    <TableHead>Salida</TableHead>
                    <TableHead>Huéspedes</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Pago</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        <Link href={`/propiedades/${booking.property.id}`} className="hover:underline">
                          {booking.property.title}
                        </Link>
                        <div className="text-xs text-gray-500">{booking.property.location}</div>
                      </TableCell>
                      <TableCell>{formatDate(booking.check_in)}</TableCell>
                      <TableCell>{formatDate(booking.check_out)}</TableCell>
                      <TableCell>{booking.guests}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)}`}
                        >
                          {booking.status === "confirmed"
                            ? "Confirmada"
                            : booking.status === "pending"
                              ? "Pendiente"
                              : "Cancelada"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.payment_status === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {booking.payment_status === "paid" ? "Pagado" : "Pendiente"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{booking.total_price}€</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <CalendarDays className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No tienes reservas</h3>
              <p className="text-gray-500 mb-4">Aún no has realizado ninguna reserva.</p>
              <Link href="/propiedades">
                <Button className="bg-black hover:bg-gray-800">Explorar propiedades</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
