"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { useMemoizedCallback } from "@/hooks/use-memoized"

interface LazyImageProps extends Omit<ImageProps, "onLoad" | "onError"> {
  fallbackSrc?: string
  threshold?: number
  rootMargin?: string
}

export function LazyImage({
  src,
  alt,
  fallbackSrc = "/placeholder.svg",
  threshold = 0.1,
  rootMargin = "200px",
  className,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  // Usar el hook de intersección para detectar cuando la imagen es visible
  const { ref, isVisible } = useIntersectionObserver({
    threshold,
    rootMargin,
    freezeOnceVisible: true,
  })

  // Cargar la imagen cuando sea visible
  if (isVisible && !imageSrc) {
    setImageSrc(src as string)
  }

  // Memoizar los callbacks para evitar recreaciones innecesarias
  const handleLoad = useMemoizedCallback(() => {
    setIsLoaded(true)
  }, [])

  const handleError = useMemoizedCallback(() => {
    setHasError(true)
    setImageSrc(fallbackSrc)
  }, [fallbackSrc])

  return (
    <div ref={ref} className="relative">
      {(!isLoaded || !imageSrc) && <Skeleton className={`absolute inset-0 ${className}`} />}
      {imageSrc && (
        <Image
          src={hasError ? fallbackSrc : imageSrc}
          alt={alt}
          className={`transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"} ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
    </div>
  )
}
