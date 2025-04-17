"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/hooks/use-app-store"
import { useUser } from "@/hooks/use-app-store"
import { useRouter } from "next/navigation"
import { useFeedback } from "@/components/ui/feedback"

interface FavoriteButtonProps {
  propertyId: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function FavoriteButton({ propertyId, variant = "outline", size = "icon", className }: FavoriteButtonProps) {
  const { user, isAuthenticated } = useUser()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [isFav, setIsFav] = useState(false)
  const router = useRouter()
  const { success, error } = useFeedback()

  useEffect(() => {
    if (isAuthenticated) {
      setIsFav(isFavorite(propertyId))
    }
  }, [isAuthenticated, isFavorite, propertyId])

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      error("Debes iniciar sesión para guardar favoritos")
      router.push(`/login?redirect=/properties/${propertyId}`)
      return
    }

    toggleFavorite(propertyId)
    setIsFav(!isFav)

    if (!isFav) {
      success("Propiedad añadida a favoritos")
    } else {
      success("Propiedad eliminada de favoritos")
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleToggleFavorite}
      aria-label={isFav ? "Eliminar de favoritos" : "Añadir a favoritos"}
    >
      <Heart className={`h-5 w-5 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
    </Button>
  )
}
