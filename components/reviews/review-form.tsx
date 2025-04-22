"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useAuth } from "@/components/auth/auth-provider"
import { useToast } from "@/hooks/use-toast"

interface ReviewFormProps {
  propertyId: string
  onReviewAdded: (review: any) => void
  onCancel: () => void
}

export function ReviewForm({ propertyId, onReviewAdded, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const supabase = getSupabaseBrowserClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para dejar una valoración",
        variant: "destructive",
      })
      return
    }

    if (rating === 0) {
      toast({
        title: "Error",
        description: "Por favor, selecciona una valoración",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Insertar la valoración en la base de datos
      const { data, error } = await supabase
        .from("reviews")
        .insert({
          property_id: propertyId,
          user_id: user.id,
          rating,
          comment: comment.trim() || null,
          status: "published",
        })
        .select(`
          id, 
          created_at, 
          rating, 
          comment,
          profiles:user_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .single()

      if (error) throw error

      // Formatear la valoración para el componente padre
      const newReview = {
        id: data.id,
        created_at: data.created_at,
        rating: data.rating,
        comment: data.comment || "",
        response: null,
        response_date: null,
        user: {
          id: data.profiles?.id || "",
          full_name: data.profiles?.full_name || "Usuario anónimo",
          avatar_url: data.profiles?.avatar_url || "/vibrant-street-market.png",
        },
      }

      // Notificar al componente padre
      onReviewAdded(newReview)

      toast({
        title: "¡Gracias por tu valoración!",
        description: "Tu opinión ayuda a otros viajeros a tomar mejores decisiones.",
      })
    } catch (error) {
      console.error("Error al enviar la valoración:", error)
      toast({
        title: "Error",
        description: "No se pudo enviar tu valoración. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded-lg">
      <h3 className="font-medium">Comparte tu experiencia</h3>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Tu valoración</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-yellow-500 focus:outline-none"
            >
              <Star
                className={`h-8 w-8 transition-all ${
                  (hoverRating || rating) >= star ? "fill-yellow-500 scale-110" : ""
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="comment" className="block text-sm font-medium">
          Tu comentario (opcional)
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comparte los detalles de tu experiencia en esta propiedad..."
          className="min-h-[100px]"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting || rating === 0} className="bg-black hover:bg-gray-800">
          {isSubmitting ? "Enviando..." : "Enviar valoración"}
        </Button>
      </div>
    </form>
  )
}
