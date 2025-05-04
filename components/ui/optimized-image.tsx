"use client"

import Image from "next/image"
import { useState } from "react"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  sizes?: string
  quality?: number
  fill?: boolean
  onLoad?: () => void
}

// Componente simplificado
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = "",
  sizes = "100vw",
  quality = 75,
  fill = false,
  onLoad,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  // Manejar la carga de la imagen
  const handleLoad = () => {
    setIsLoaded(true)
    if (onLoad) onLoad()
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        quality={quality}
        sizes={sizes}
        priority={priority}
        fill={fill}
        onLoad={handleLoad}
        className={`transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      />
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gray-200"
          style={{ aspectRatio: width && height ? width / height : undefined }}
        />
      )}
    </div>
  )
}

// También exportamos como default para mantener compatibilidad
export default OptimizedImage
