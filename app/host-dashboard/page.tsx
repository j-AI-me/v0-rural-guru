"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Building, Plus, Calendar, Settings, Users, MapPin, MessageCircle } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default function HostDashboardPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeProperties: 0,
    pendingProperties: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalIncome: 0,
    unreadMessages: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Obtener el usuario actual
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          throw new Error("No se ha encontrado un usuario autenticado")
        }

        // Obtener propiedades del host
        const { data: propertiesData, error: propertiesError } = await supabase
          .from("properties")
          .select(`
            *,
            property_images!inner(*)
          `)
          .eq("host_id", user.id)
          .eq("property_images.is_main", true)

        if (propertiesError) throw propertiesError

        // Obtener reservas de las propiedades del host
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select(`
            *,
            properties!inner(*)
          `)
          .in("property_id", propertiesData?.map((p) => p.id) || [])
          .order("check_in", { ascending: true })

        if (bookingsError) throw bookingsError

        // Contar mensajes no leídos
        const { data: unreadData, error: unreadError } = await supabase
          .from("messages")
          .select("id", { count: true })
          .eq("receiver_id", user.id)
          .eq("read", false)

        const unreadCount = !unreadError ? unreadData?.length || 0 : 0

        // Calcular estadísticas
        const activeProps = propertiesData?.filter((p) => p.status === "active").length || 0
        const pendingProps = propertiesData?.filter((p) => p.status === "pending").length || 0
        const pendingBooks = bookingsData?.filter((b) => b.status === "pending").length || 0
        const confirmedBooks = bookingsData?.filter((b) => b.status === "confirmed").length || 0
        const totalIncome =
          bookingsData?.reduce((sum, booking) => {
            return booking.payment_status === "paid" ? sum + Number.parseFloat(booking.total_price) : sum
          }, 0) || 0

        setProperties(propertiesData || [])
        setBookings(bookingsData || [])
        setStats({
          totalProperties: propertiesData?.length || 0,
          activeProperties: activeProps,
          pendingProperties: pendingProps,
          totalBookings: bookingsData?.length || 0,
          pendingBookings: pendingBooks,
          confirmedBookings: confirmedBooks,
          totalIncome: totalIncome,
          unreadMessages: unreadCount,
        })
      } catch (error) {
        console.error("Error al cargar los datos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard de Propietario</h1>
              <p className="text-muted-foreground">Gestiona tus propiedades y reservas</p>
            </div>
            <Link href="/host-dashboard/properties/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Añadir propiedad
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Propiedades</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats.totalProperties}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.activeProperties} activas, {stats.pendingProperties} pendientes
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reservas</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats.totalBookings}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.pendingBookings} pendientes, {stats.confirmedBookings} confirmadas
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats.totalIncome.toFixed(2)}€</div>
                    <p className="text-xs text-muted-foreground">Total de reservas pagadas</p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mensajes</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats.unreadMessages}</div>
                    <p className="text-xs text-muted-foreground">mensajes sin leer</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="properties">
            <TabsList>
              <TabsTrigger value="properties">Mis Propiedades</TabsTrigger>
              <TabsTrigger value="bookings">Reservas</TabsTrigger>
              <TabsTrigger value="messages">
                Mensajes
                {stats.unreadMessages > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {stats.unreadMessages}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="properties" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Mis Propiedades</CardTitle>
                  <CardDescription>Gestiona tus propiedades rurales</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12 rounded" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : properties.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No tienes propiedades registradas</p>
                      <Link href="/host-dashboard/properties/new">
                        <Button className="mt-4">Añadir tu primera propiedad</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {properties.map((property) => (
                        <div key={property.id} className="flex flex-col md:flex-row gap-4 border-b pb-4">
                          <div className="relative w-full md:w-32 h-24 rounded-md overflow-hidden">
                            <Image
                              src={
                                property.property_images[0]?.url || "/placeholder.svg?height=100&width=100&query=house"
                              }
                              alt={property.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{property.name}</h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{property.location}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant={property.status === "active" ? "default" : "secondary"}>
                                {property.status === "active" ? "Activa" : "Pendiente"}
                              </Badge>
                              <span className="text-sm">{property.price}€ / noche</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link href={`/host-dashboard/properties/${property.id}`}>
                              <Button variant="outline" size="sm">
                                Editar
                              </Button>
                            </Link>
                            <Link href={`/properties/${property.id}`}>
                              <Button variant="ghost" size="sm">
                                Ver
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="bookings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Reservas</CardTitle>
                  <CardDescription>Gestiona las reservas de tus propiedades</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12 rounded" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No tienes reservas todavía</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <div key={booking.id} className="flex flex-col md:flex-row gap-4 border-b pb-4">
                          <div className="flex-1">
                            <h3 className="font-medium">{booking.properties.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1 text-sm">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <Users className="h-3 w-3" />
                                <span>{booking.guests} huéspedes</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                                {booking.status === "confirmed" ? "Confirmada" : "Pendiente"}
                              </Badge>
                              <Badge variant={booking.payment_status === "paid" ? "outline" : "secondary"}>
                                {booking.payment_status === "paid" ? "Pagada" : "Pago pendiente"}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex flex-col justify-between">
                            <div className="text-right font-medium">
                              {Number.parseFloat(booking.total_price).toFixed(2)}€
                            </div>
                            <Link href={`/host-dashboard/bookings/${booking.id}`}>
                              <Button variant="outline" size="sm">
                                Gestionar
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Mensajes</CardTitle>
                  <CardDescription>Comunícate con tus huéspedes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <Link href="/host-dashboard/messages">
                      <Button>Ver todos los mensajes</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
