"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { useInView } from "react-intersection-observer"

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
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  onLoad?: () => void
  lowQualityPlaceholder?: boolean
}

// Componente principal
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = "",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  quality = 75,
  fill = false,
  placeholder = "empty",
  blurDataURL,
  onLoad,
  lowQualityPlaceholder = false,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "200px 0px",
  })

  // Generar un placeholder blur data URL si no se proporciona uno
  const [localBlurDataURL, setLocalBlurDataURL] = useState(blurDataURL)

  useEffect(() => {
    if (!blurDataURL && placeholder === "blur" && !localBlurDataURL) {
      // Crear un SVG simple como placeholder
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width || 100}" height="${height || 100}">
          <rect width="100%" height="100%" fill="#e2e8f0"/>
        </svg>
      `
      const encodedSVG = encodeURIComponent(svg)
      setLocalBlurDataURL(`data:image/svg+xml;charset=utf-8,${encodedSVG}`)
    }
  }, [blurDataURL, placeholder, width, height, localBlurDataURL])

  // Manejar la carga de la imagen
  const handleLoad = () => {
    setIsLoaded(true)
    if (onLoad) onLoad()
  }

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={fill ? { width: "100%", height: "100%" } : {}}
    >
      {(inView || priority) && (
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          quality={quality}
          sizes={sizes}
          priority={priority}
          fill={fill}
          placeholder={placeholder === "blur" ? "blur" : "empty"}
          blurDataURL={localBlurDataURL}
          onLoad={handleLoad}
          className={`transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
      {!isLoaded && lowQualityPlaceholder && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ aspectRatio: width && height ? width / height : undefined }}
        />
      )}
    </div>
  )
}

// También exportamos como default para mantener compatibilidad con código existente
export default OptimizedImage
