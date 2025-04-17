"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { supabase } from "@/lib/supabase/client"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { MessageCircle } from "lucide-react"

interface ConversationListProps {
  userId: string
  userRole: string
  onSelectConversation?: (bookingId: string) => void
  className?: string
}

export function ConversationList({ userId, userRole, onSelectConversation, className }: ConversationListProps) {
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true)
      try {
        // Obtener todas las reservas donde el usuario es anfitrión o huésped
        let query = supabase.from("bookings").select(`
            id,
            properties(id, name, host_id),
            guest_id,
            check_in,
            check_out,
            users!bookings_guest_id_fkey(full_name, email)
          `)

        if (userRole === "host") {
          // Si es anfitrión, obtener reservas de sus propiedades
          query = query.eq("properties.host_id", userId)
        } else {
          // Si es huésped, obtener sus reservas
          query = query.eq("guest_id", userId)
        }

        const { data: bookingsData, error: bookingsError } = await query

        if (bookingsError) throw bookingsError

        // Para cada reserva, obtener el último mensaje y el conteo de no leídos
        const conversationsWithMessages = await Promise.all(
          (bookingsData || []).map(async (booking) => {
            // Obtener el último mensaje
            const { data: lastMessageData, error: lastMessageError } = await supabase
              .from("messages")
              .select("*")
              .eq("booking_id", booking.id)
              .order("created_at", { ascending: false })
              .limit(1)

            if (lastMessageError) throw lastMessageError

            // Contar mensajes no leídos
            const { data: unreadCountData, error: unreadCountError } = await supabase
              .from("messages")
              .select("id", { count: true })
              .eq("booking_id", booking.id)
              .eq("receiver_id", userId)
              .eq("read", false)

            if (unreadCountError) throw unreadCountError

            return {
              ...booking,
              lastMessage: lastMessageData?.[0] || null,
              unreadCount: unreadCountData?.length || 0,
            }
          }),
        )

        // Ordenar por fecha del último mensaje (más reciente primero)
        const sortedConversations = conversationsWithMessages.sort((a, b) => {
          const dateA = a.lastMessage?.created_at ? new Date(a.lastMessage.created_at).getTime() : 0
          const dateB = b.lastMessage?.created_at ? new Date(b.lastMessage.created_at).getTime() : 0
          return dateB - dateA
        })

        setConversations(sortedConversations)
      } catch (error) {
        console.error("Error al cargar las conversaciones:", error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchConversations()
    }
  }, [userId, userRole])

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: es })
    } catch (error) {
      return "fecha desconocida"
    }
  }

  const getOtherPartyName = (conversation: any) => {
    if (userRole === "host") {
      return conversation.users?.full_name || "Huésped"
    } else {
      // Para el huésped, mostrar el nombre de la propiedad
      return conversation.properties?.name || "Propiedad"
    }
  }

  const handleSelectConversation = (bookingId: string) => {
    if (onSelectConversation) {
      onSelectConversation(bookingId)
    }
  }

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start space-x-4 p-4 border rounded-lg">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No hay conversaciones</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {userRole === "host"
            ? "Cuando recibas reservas, podrás comunicarte con tus huéspedes aquí."
            : "Cuando realices reservas, podrás comunicarte con los anfitriones aquí."}
        </p>
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
          onClick={() => handleSelectConversation(conversation.id)}
        >
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-medium">{getOtherPartyName(conversation)}</h3>
            {conversation.lastMessage && (
              <span className="text-xs text-muted-foreground">{formatDate(conversation.lastMessage.created_at)}</span>
            )}
          </div>

          <div className="text-sm text-muted-foreground mb-2">
            {new Date(conversation.check_in).toLocaleDateString()} -{" "}
            {new Date(conversation.check_out).toLocaleDateString()}
          </div>

          {conversation.lastMessage ? (
            <p className="text-sm line-clamp-2">{conversation.lastMessage.content}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">No hay mensajes</p>
          )}

          {conversation.unreadCount > 0 && (
            <div className="mt-2">
              <Badge variant="default" className="text-xs">
                {conversation.unreadCount} {conversation.unreadCount === 1 ? "nuevo mensaje" : "nuevos mensajes"}
              </Badge>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
