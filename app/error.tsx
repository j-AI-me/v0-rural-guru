"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { logError } from "@/lib/error-handling"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Registrar el error
    logError(error, `GlobalError: ${error.digest || "unknown"}`)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full p-6 text-center">
            <h1 className="text-3xl font-bold mb-4">Algo salió mal</h1>
            <p className="text-muted-foreground mb-6">
              Lo sentimos, ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
            </p>
            <div className="flex flex-col gap-2">
              <Button onClick={reset} className="w-full">
                Intentar de nuevo
              </Button>
              <Button variant="outline" onClick={() => (window.location.href = "/")} className="w-full">
                Volver al inicio
              </Button>
            </div>
            {error.digest && <p className="text-xs text-muted-foreground mt-4">Código de referencia: {error.digest}</p>}
          </div>
        </div>
      </body>
    </html>
  )
}
