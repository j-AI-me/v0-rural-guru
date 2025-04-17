"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, MessageCircle, Home, User } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default function GuestDashboardPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [unreadMessages, setUnreadMessages] = useState(0)

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

        // Obtener detalles del usuario
        const { data: userData, error: userError } = await supabase.from("users").select("*").eq("id", user.id).single()

        if (userError) throw userError
        setUser(userData)

        // Obtener reservas del huésped
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select(`
            *,
            properties(*, property_images(url, is_main))
          `)
          .eq("guest_id", user.id)
          .order("check_in", { ascending: false })

        if (bookingsError) throw bookingsError

        // Filtrar para obtener solo la imagen principal de cada propiedad
        const bookingsWithMainImage = bookingsData?.map((booking) => {
          const mainImage = booking.properties.property_images.find((img: any) => img.is_main)
          return {
            ...booking,
            properties: {
              ...booking.properties,
              mainImage: mainImage?.url || null,
            },
          }
        })

        setBookings(bookingsWithMainImage || [])

        // Contar mensajes no leídos
        const { data: unreadData, error: unreadError } = await supabase
          .from("messages")
          .select("id", { count: true })
          .eq("receiver_id", user.id)
          .eq("read", false)

        if (!unreadError) {
          setUnreadMessages(unreadData?.length || 0)
        }
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
              <h1 className="text-3xl font-bold tracking-tight">Mi cuenta</h1>
              <p className="text-muted-foreground">Gestiona tus reservas y mensajes</p>
            </div>
            <Link href="/properties">
              <Button>
                <Home className="mr-2 h-4 w-4" />
                Explorar propiedades
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mis reservas</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{bookings.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {bookings.filter((b) => new Date(b.check_in) > new Date()).length} próximas
                    </p>
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
                    <div className="text-2xl font-bold">{unreadMessages}</div>
                    <p className="text-xs text-muted-foreground">mensajes sin leer</p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mi perfil</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <>
                    <div className="text-lg font-medium truncate">{user?.full_name || "Usuario"}</div>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="bookings">
            <TabsList>
              <TabsTrigger value="bookings">Mis Reservas</TabsTrigger>
              <TabsTrigger value="messages">
                Mensajes
                {unreadMessages > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadMessages}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="bookings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Mis Reservas</CardTitle>
                  <CardDescription>Gestiona tus reservas de alojamiento</CardDescription>
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
                      <p className="text-muted-foreground">No tienes reservas realizadas</p>
                      <Link href="/properties">
                        <Button className="mt-4">Explorar propiedades</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <div key={booking.id} className="flex flex-col md:flex-row gap-4 border-b pb-4">
                          <div className="relative w-full md:w-32 h-24 rounded-md overflow-hidden">
                            <Image
                              src={
                                booking.properties.mainImage ||
                                "/placeholder.svg?height=100&width=100&query=house" ||
                                "/placeholder.svg"
                              }
                              alt={booking.properties.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{booking.properties.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="text-sm">
                                <span className="text-muted-foreground">Fechas:</span> {formatDate(booking.check_in)} -{" "}
                                {formatDate(booking.check_out)}
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
                          <div className="flex items-center gap-2">
                            <Link href={`/guest-dashboard/bookings/${booking.id}`}>
                              <Button variant="outline" size="sm">
                                Detalles
                              </Button>
                            </Link>
                            <Link href={`/properties/${booking.properties.id}`}>
                              <Button variant="ghost" size="sm">
                                Ver propiedad
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
                  <CardDescription>Comunícate con los anfitriones de tus reservas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <Link href="/guest-dashboard/messages">
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
