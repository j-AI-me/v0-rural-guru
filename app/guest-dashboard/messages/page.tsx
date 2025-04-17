"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { ConversationList } from "@/components/messaging/conversation-list"
import { MessageThread } from "@/components/messaging/message-thread"

export default function GuestMessagesPage() {
  const [user, setUser] = useState<any>(null)
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null)
  const [bookingDetails, setBookingDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Obtener detalles del usuario, incluyendo el rol
        const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single()

        if (!error && data) {
          setUser({ ...user, ...data })
        }
      }
      setLoading(false)
    }

    fetchUser()
  }, [])

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!selectedBooking) {
        setBookingDetails(null)
        return
      }

      try {
        const { data, error } = await supabase
          .from("bookings")
          .select(`
            *,
            properties(id, name, host_id, host:host_id(id, full_name, email))
          `)
          .eq("id", selectedBooking)
          .single()

        if (error) throw error

        setBookingDetails(data)
      } catch (error) {
        console.error("Error al cargar los detalles de la reserva:", error)
        setBookingDetails(null)
      }
    }

    fetchBookingDetails()
  }, [selectedBooking])

  const handleSelectConversation = (bookingId: string) => {
    setSelectedBooking(bookingId)
  }

  const getReceiverId = () => {
    if (!bookingDetails) return ""
    return bookingDetails.properties.host_id
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <MainNav />
        <main className="flex-1 container py-8">
          <div className="text-center py-12">Cargando...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <MainNav />
        <main className="flex-1 container py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Acceso denegado</h1>
            <p className="text-muted-foreground mb-6">Debes iniciar sesión para acceder a esta página.</p>
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
        <Link href="/guest-dashboard" className="inline-flex items-center gap-1 mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Volver al dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-8">Mis mensajes</h1>

        <div className="grid md:grid-cols-[350px_1fr] gap-8 min-h-[600px]">
          <Card className="md:max-h-[700px] overflow-hidden">
            <CardHeader>
              <CardTitle>Conversaciones</CardTitle>
              <CardDescription>Tus conversaciones con anfitriones</CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto max-h-[600px]">
              <ConversationList
                userId={user.id}
                userRole={user.role}
                onSelectConversation={handleSelectConversation}
                className="p-4"
              />
            </CardContent>
          </Card>

          <Card className="md:max-h-[700px] flex flex-col">
            {selectedBooking && bookingDetails ? (
              <>
                <CardHeader className="pb-2">
                  <CardTitle>{bookingDetails.properties?.name || "Propiedad"}</CardTitle>
                  <CardDescription>
                    {new Date(bookingDetails.check_in).toLocaleDateString()} -{" "}
                    {new Date(bookingDetails.check_out).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0">
                  <MessageThread
                    bookingId={selectedBooking}
                    userId={user.id}
                    receiverId={getReceiverId()}
                    className="h-full"
                  />
                </CardContent>
              </>
            ) : (
              <div className="flex items-center justify-center h-full p-8 text-center">
                <div>
                  <h3 className="text-lg font-medium mb-2">Selecciona una conversación</h3>
                  <p className="text-muted-foreground">Elige una conversación de la lista para ver los mensajes.</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
