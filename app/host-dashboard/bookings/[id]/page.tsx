"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
// Añadir el import de MessageCircle
import { ArrowLeft, Calendar, Users, Check, X, MessageCircle } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select(`
            *,
            properties(*),
            users(*)
          `)
          .eq("id", params.id)
          .single()

        if (error) throw error

        setBooking(data)
      } catch (error) {
        console.error("Error fetching booking:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar la reserva",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [params.id, toast])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  const calculateNights = () => {
    if (!booking) return 0
    const checkIn = new Date(booking.check_in)
    const checkOut = new Date(booking.check_out)
    return Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
  }

  const handleUpdateStatus = async (status: string) => {
    setUpdating(true)
    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", params.id)

      if (error) throw error

      setBooking({
        ...booking,
        status,
      })

      toast({
        title: "Reserva actualizada",
        description: `La reserva ha sido ${status === "confirmed" ? "confirmada" : "cancelada"}`,
      })
    } catch (error: any) {
      console.error("Error updating booking:", error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <MainNav />
        <main className="flex-1 container py-8">
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid md:grid-cols-[2fr_1fr] gap-8">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="flex flex-col min-h-screen">
        <MainNav />
        <main className="flex-1 container py-8">
          <Link href="/host-dashboard" className="inline-flex items-center gap-1 mb-6 hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Volver al dashboard
          </Link>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Reserva no encontrada</h1>
            <p className="text-muted-foreground mb-6">
              La reserva que buscas no existe o no tienes permisos para verla.
            </p>
            <Button onClick={() => router.push("/host-dashboard")}>Volver al dashboard</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-1 container py-8">
        <Link href="/host-dashboard" className="inline-flex items-center gap-1 mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Volver al dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-2">Detalles de la reserva</h1>
        <p className="text-muted-foreground mb-8">Reserva para {booking.properties.name}</p>

        <div className="grid md:grid-cols-[2fr_1fr] gap-8">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Información de la reserva</CardTitle>
                <CardDescription>Detalles de la estancia</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Propiedad</h3>
                    <p className="font-medium">{booking.properties.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Estado</h3>
                    <Badge variant={booking.status === "confirmed" ? "default" : "secondary"} className="mt-1">
                      {booking.status === "confirmed"
                        ? "Confirmada"
                        : booking.status === "cancelled"
                          ? "Cancelada"
                          : "Pendiente"}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Fechas</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-4 w-4" />
                      <p>
                        {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{calculateNights()} noches</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Huéspedes</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Users className="h-4 w-4" />
                      <p>{booking.guests} huéspedes</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Pago</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={booking.payment_status === "paid" ? "outline" : "secondary"}>
                      {booking.payment_status === "paid" ? "Pagado" : "Pendiente"}
                    </Badge>
                    <p className="font-medium">{Number.parseFloat(booking.total_price).toFixed(2)}€</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información del huésped</CardTitle>
                <CardDescription>Datos de contacto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Nombre</h3>
                  <p className="font-medium">{booking.users.full_name || "No disponible"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p>{booking.users.email}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Resumen de precio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {booking.properties.price}€ x {calculateNights()} noches
                  </span>
                  <span>{(booking.properties.price * calculateNights()).toFixed(2)}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tarifa de limpieza</span>
                  <span>30.00€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tarifa de servicio</span>
                  <span>{(booking.properties.price * calculateNights() * 0.1).toFixed(2)}€</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{Number.parseFloat(booking.total_price).toFixed(2)}€</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {booking.status === "pending" && (
                  <>
                    <Button className="w-full" onClick={() => handleUpdateStatus("confirmed")} disabled={updating}>
                      <Check className="mr-2 h-4 w-4" />
                      Confirmar reserva
                    </Button>

                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => handleUpdateStatus("cancelled")}
                      disabled={updating}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Rechazar reserva
                    </Button>
                  </>
                )}

                {booking.status === "confirmed" && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleUpdateStatus("cancelled")}
                    disabled={updating}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancelar reserva
                  </Button>
                )}

                {booking.status === "cancelled" && (
                  <Button className="w-full" onClick={() => handleUpdateStatus("confirmed")} disabled={updating}>
                    <Check className="mr-2 h-4 w-4" />
                    Reactivar reserva
                  </Button>
                )}

                {/* Añadir botón de mensajes */}
                <Link href={`/host-dashboard/messages?booking=${booking.id}`}>
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Enviar mensaje
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
