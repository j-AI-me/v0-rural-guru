"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface ReviewResponseFormProps {
  reviewId: string
  onResponseAdded: (response: string) => void
  onCancel: () => void
}

export function ReviewResponseForm({ reviewId, onResponseAdded, onCancel }: ReviewResponseFormProps) {
  const [response, setResponse] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const supabase = getSupabaseBrowserClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!response.trim()) {
      toast({
        title: "Error",
        description: "Por favor, escribe una respuesta",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Actualizar la valoración con la respuesta
      const { error } = await supabase
        .from("reviews")
        .update({
          response: response.trim(),
          response_date: new Date().toISOString(),
        })
        .eq("id", reviewId)

      if (error) throw error

      // Notificar al componente padre
      onResponseAdded(response.trim())

      toast({
        title: "Respuesta enviada",
        description: "Tu respuesta ha sido publicada correctamente.",
      })
    } catch (error) {
      console.error("Error al enviar la respuesta:", error)
      toast({
        title: "Error",
        description: "No se pudo enviar tu respuesta. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded-lg">
      <h3 className="font-medium">Responder a esta valoración</h3>

      <div className="space-y-2">
        <label htmlFor="response" className="block text-sm font-medium">
          Tu respuesta
        </label>
        <Textarea
          id="response"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Escribe tu respuesta a esta valoración..."
          className="min-h-[100px]"
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting || !response.trim()} className="bg-black hover:bg-gray-800">
          {isSubmitting ? "Enviando..." : "Publicar respuesta"}
        </Button>
      </div>
    </form>
  )
}
