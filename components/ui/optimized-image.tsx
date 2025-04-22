"use client"

import Image, { type ImageProps } from "next/image"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface OptimizedImageProps extends Omit<ImageProps, "onLoad" | "onError"> {
  fallbackSrc?: string
  showLoadingIndicator?: boolean
  aspectRatio?: number
  lowQualityPlaceholder?: boolean
  lazyBoundary?: string
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = "/placeholder.svg",
  showLoadingIndicator = true,
  aspectRatio,
  lowQualityPlaceholder = false,
  lazyBoundary = "200px",
  className,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [imageSrc, setImageSrc] = useState(src)
  const [blurDataURL, setBlurDataURL] = useState<string | undefined>(undefined)

  // Restablecer el estado cuando cambia la fuente
  useEffect(() => {
    setIsLoading(true)
    setError(false)
    setImageSrc(src)
  }, [src])

  // Generar un placeholder de baja calidad si se solicita
  useEffect(() => {
    if (lowQualityPlaceholder && typeof src === "string") {
      // Crear un placeholder de baja calidad (10x10 píxeles)
      const canvas = document.createElement("canvas")
      canvas.width = 10
      canvas.height = 10
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.fillStyle = "#f3f4f6" // Color gris claro
        ctx.fillRect(0, 0, 10, 10)
        setBlurDataURL(canvas.toDataURL())
      }
    }
  }, [lowQualityPlaceholder, src])

  // Calcular el estilo para mantener la relación de aspecto
  const aspectRatioStyle = aspectRatio
    ? {
        aspectRatio: `${aspectRatio}`,
        objectFit: "cover" as const,
      }
    : {}

  return (
    <div className="relative" style={aspectRatioStyle}>
      {showLoadingIndicator && isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <Skeleton className="w-full h-full" />
        </div>
      )}
      <Image
        src={error ? fallbackSrc : imageSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"} ${className}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true)
          setIsLoading(false)
          setImageSrc(fallbackSrc)
        }}
        loading="lazy"
        placeholder={blurDataURL ? "blur" : "empty"}
        blurDataURL={blurDataURL}
        lazyBoundary={lazyBoundary}
        {...props}
      />
    </div>
  )
}
