"use client"

import { useEffect, useState } from "react"
import Script from "next/script"

interface ThirdPartyScriptProps {
  src: string
  id?: string
  strategy?: "beforeInteractive" | "afterInteractive" | "lazyOnload"
  onLoad?: () => void
  defer?: boolean
  async?: boolean
}

export default function ThirdPartyScript({
  src,
  id,
  strategy = "lazyOnload",
  onLoad,
  defer = true,
  async = true,
}: ThirdPartyScriptProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  // Manejar la carga del script
  const handleLoad = () => {
    setIsLoaded(true)
    if (onLoad) onLoad()
  }

  // Verificar si el usuario ha dado consentimiento para cookies (ejemplo)
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    // Comprobar si el usuario ha dado consentimiento para cookies
    const cookieConsent = localStorage.getItem("cookieConsent")
    setHasConsent(cookieConsent === "true")
  }, [])

  // No cargar scripts de terceros si el usuario no ha dado consentimiento
  if (!hasConsent && strategy !== "beforeInteractive") {
    return null
  }

  return <Script src={src} id={id} strategy={strategy} onLoad={handleLoad} defer={defer} async={async} />
}
