"use client"

import { useEffect, useState } from "react"

interface ThirdPartyScriptProps {
  src: string
  id?: string
  async?: boolean
  defer?: boolean
  onLoad?: () => void
  onError?: (error: Error) => void
  strategy?: "beforeInteractive" | "afterInteractive" | "lazyOnload"
}

export function ThirdPartyScript({
  src,
  id,
  async = true,
  defer = false,
  onLoad,
  onError,
  strategy = "afterInteractive",
}: ThirdPartyScriptProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Si el script ya existe, no lo cargamos de nuevo
    const existingScript = document.getElementById(id || src)
    if (existingScript) {
      setLoaded(true)
      onLoad?.()
      return
    }

    // Si la estrategia es lazyOnload, usamos Intersection Observer
    if (strategy === "lazyOnload") {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadScript()
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
      loadScript()
      return
    }

    // Si la estrategia es afterInteractive, cargamos después de que la página sea interactiva
    if (strategy === "afterInteractive") {
      if (document.readyState === "complete") {
        loadScript()
      } else {
        window.addEventListener("load", loadScript)
        return () => {
          window.removeEventListener("load", loadScript)
        }
      }
    }

    function loadScript() {
      const script = document.createElement("script")
      script.src = src
      script.async = async
      script.defer = defer
      if (id) script.id = id

      script.onload = () => {
        setLoaded(true)
        onLoad?.()
      }

      script.onerror = (e) => {
        const err = new Error(`Failed to load script: ${src}`)
        setError(err)
        onError?.(err)
      }

      document.body.appendChild(script)
    }
  }, [src, id, async, defer, onLoad, onError, strategy])

  return null
}
