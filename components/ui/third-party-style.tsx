"use client"

import { useEffect, useState } from "react"

interface ThirdPartyStyleProps {
  href: string
  id?: string
  media?: string
  onLoad?: () => void
  onError?: (error: Error) => void
  strategy?: "beforeInteractive" | "afterInteractive" | "lazyOnload"
}

export function ThirdPartyStyle({
  href,
  id,
  media = "all",
  onLoad,
  onError,
  strategy = "afterInteractive",
}: ThirdPartyStyleProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Si el estilo ya existe, no lo cargamos de nuevo
    const existingStyle = document.getElementById(id || href)
    if (existingStyle) {
      setLoaded(true)
      onLoad?.()
      return
    }

    // Si la estrategia es lazyOnload, usamos Intersection Observer
    if (strategy === "lazyOnload") {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadStyle()
            observer.disconnect()
          }
        },
        { rootMargin: "200px" },
      )

      const target = document.body
      observer.observe(target)

      return () => {
        observer.disconnect()
      }
    }

    // Si la estrategia es beforeInteractive, cargamos inmediatamente
    if (strategy === "beforeInteractive") {
      loadStyle()
      return
    }

    // Si la estrategia es afterInteractive, cargamos después de que la página sea interactiva
    if (strategy === "afterInteractive") {
      if (document.readyState === "complete") {
        loadStyle()
      } else {
        window.addEventListener("load", loadStyle)
        return () => {
          window.removeEventListener("load", loadStyle)
        }
      }
    }

    function loadStyle() {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = href
      link.media = media
      if (id) link.id = id

      link.onload = () => {
        setLoaded(true)
        onLoad?.()
      }

      link.onerror = (e) => {
        const err = new Error(`Failed to load stylesheet: ${href}`)
        setError(err)
        onError?.(err)
      }

      document.head.appendChild(link)
    }
  }, [href, id, media, onLoad, onError, strategy])

  return null
}
