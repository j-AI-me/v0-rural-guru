"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)

  useEffect(() => {
    // Verificar si el usuario ya ha aceptado las cookies
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setShowConsent(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setShowConsent(false)
  }

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined")
    setShowConsent(false)
  }

  if (!showConsent) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
      <div className="px-6 md:px-10 lg:px-12 py-4 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="text-sm text-gray-700 pr-4">
            <h3 className="font-semibold mb-1">Política de Cookies</h3>
            <p>
              Utilizamos cookies propias y de terceros para mejorar nuestros servicios. Si continúa navegando,
              consideramos que acepta su uso.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={declineCookies}>
              Rechazar
            </Button>
            <Button size="sm" onClick={acceptCookies}>
              Aceptar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
