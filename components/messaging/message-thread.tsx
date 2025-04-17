"use client"

import { useState, useEffect, useRef } from "react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Send, Loader2 } from "lucide-react"

interface MessageThreadProps {
  bookingId: string
  userId: string
  receiverId: string
  className?: string
}

export function MessageThread({ bookingId, userId, receiverId, className }: MessageThreadProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("messages")
          .select(`
            *,
            sender:sender_id(id, full_name, email),
            receiver:receiver_id(id, full_name, email)
          `)
          .eq("booking_id", bookingId)
          .order("created_at", { ascending: true })

        if (error) throw error

        setMessages(data || [])

        // Marcar mensajes como leídos
        await supabase
          .from("messages")
          .update({ read: true })
          .eq("booking_id", bookingId)
          .eq("receiver_id", userId)
          .eq("read", false)
      } catch (error) {
        console.error("Error al cargar los mensajes:", error)
      } finally {
        setLoading(false)
      }
    }

    if (bookingId && userId) {
      fetchMessages()

      // Suscribirse a nuevos mensajes
      const subscription = supabase
        .channel(`messages:${bookingId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `booking_id=eq.${bookingId}`,
          },
          async (payload) => {
            // Obtener el mensaje completo con información del remitente y destinatario
            const { data, error } = await supabase
              .from("messages")
              .select(`
                *,
                sender:sender_id(id, full_name, email),
                receiver:receiver_id(id, full_name, email)
              `)
              .eq("id", payload.new.id)
              .single()

            if (!error && data) {
              setMessages((prev) => [...prev, data])

              // Si el mensaje es para el usuario actual, marcarlo como leído
              if (data.receiver_id === userId) {
                await supabase.from("messages").update({ read: true }).eq("id", data.id)
              }
            }
          },
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [bookingId, userId])

  useEffect(() => {
    // Scroll al final cuando se cargan los mensajes o llega uno nuevo
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    setSending(true)
    try {
      const { error } = await supabase.from("messages").insert({
        booking_id: bookingId,
        sender_id: userId,
        receiver_id: receiverId,
        content: newMessage.trim(),
      })

      if (error) throw error

      setNewMessage("")
    } catch (error) {
      console.error("Error al enviar el mensaje:", error)
    } finally {
      setSending(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: es })
    } catch (error) {
      return "fecha desconocida"
    }
  }

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
            <div
              className={`max-w-[80%] ${i % 2 === 0 ? "bg-accent" : "bg-primary text-primary-foreground"} rounded-lg p-3`}
            >
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px] mt-2" />
              <div className="flex justify-end mt-1">
                <Skeleton className="h-3 w-[80px]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No hay mensajes en esta conversación.</p>
            <p className="text-sm text-muted-foreground mt-1">Envía un mensaje para comenzar a chatear.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender_id === userId ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender_id === userId ? "bg-primary text-primary-foreground" : "bg-accent"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                <div className="flex justify-end mt-1">
                  <span className="text-xs opacity-70">{formatDate(message.created_at)}</span>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="min-h-[80px]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />
          <Button onClick={handleSendMessage} disabled={sending || !newMessage.trim()} className="self-end">
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
