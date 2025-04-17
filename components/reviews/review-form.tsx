"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StarIcon, ImageIcon, X, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"
import { put } from "@vercel/blob"

interface ReviewFormProps {
  propertyId: string
  bookingId?: string
  onSuccess?: () => void
}

export function ReviewForm({ propertyId, bookingId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)
  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)

      // Limitar a 5 imágenes en total
      if (images.length + newFiles.length > 5) {
        toast({
          title: "Límite de imágenes",
          description: "Puedes subir un máximo de 5 imágenes por reseña",
          variant: "destructive",
        })
        return
      }

      // Validar tamaño y tipo de archivo
      const validFiles = newFiles.filter((file) => {
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "Archivo demasiado grande",
            description: "Las imágenes deben ser menores de 5MB",
            variant: "destructive",
          })
          return false
        }

        if (!file.type.startsWith("image/")) {
          toast({
            title: "Formato no válido",
            description: "Solo se permiten archivos de imagen",
            variant: "destructive",
          })
          return false
        }

        return true
      })

      setImages((prev) => [...prev, ...validFiles])

      // Crear URLs temporales para previsualización
      const newUrls = validFiles.map((file) => URL.createObjectURL(file))
      setImageUrls((prev) => [...prev, ...newUrls])
    }
  }

  const removeImage = (index: number) => {
    // Liberar URL de objeto para evitar fugas de memoria
    URL.revokeObjectURL(imageUrls[index])

    setImages((prev) => prev.filter((_, i) => i !== index))
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadImages = async () => {
    if (images.length === 0) return []

    setUploadingImages(true)
    const uploadedUrls: string[] = []

    try {
      for (const image of images) {
        const filename = `review-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${image.name.split(".").pop()}`

        const blob = await put(filename, image, {
          access: "public",
          multipart: true,
        })

        uploadedUrls.push(blob.url)
      }

      return uploadedUrls
    } catch (error) {
      console.error("Error uploading images:", error)
      toast({
        title: "Error al subir imágenes",
        description: "No se pudieron subir algunas imágenes. Inténtalo de nuevo.",
        variant: "destructive",
      })
      return []
    } finally {
      setUploadingImages(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast({
        title: "Error",
        description: "Por favor, selecciona una calificación",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Primero subimos las imágenes
      const imageUrls = await uploadImages()

      // Luego enviamos la reseña con las URLs de las imágenes
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId,
          bookingId,
          rating,
          comment,
          images: imageUrls,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al enviar la reseña")
      }

      toast({
        title: "Reseña enviada",
        description: "Gracias por compartir tu experiencia",
      })

      setRating(0)
      setComment("")
      setImages([])
      setImageUrls([])

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar la reseña. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-1">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Tu calificación</label>
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHoverRating(i + 1)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1"
            >
              <StarIcon
                className={`h-6 w-6 ${
                  i < (hoverRating || rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="comment" className="block text-sm font-medium">
          Tu comentario
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comparte tu experiencia con esta propiedad..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Añadir fotos (opcional)</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative w-24 h-24 rounded-md overflow-hidden">
              <Image src={url || "/placeholder.svg"} alt={`Imagen ${index + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}

          {images.length < 5 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 hover:border-gray-400"
            >
              <ImageIcon className="h-6 w-6 mb-1" />
              <span className="text-xs">Añadir</span>
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="hidden"
        />
        <p className="text-xs text-muted-foreground">Puedes subir hasta 5 imágenes (máx. 5MB cada una)</p>
      </div>

      <Button type="submit" disabled={isSubmitting || uploadingImages}>
        {isSubmitting || uploadingImages ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {uploadingImages ? "Subiendo imágenes..." : "Enviando..."}
          </>
        ) : (
          "Enviar reseña"
        )}
      </Button>
    </form>
  )
}
