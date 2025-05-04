"use client"

import { useEffect } from "react"
import { logClientError } from "@/lib/error-handling"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Registrar el error global
    logClientError({
      message: error.message,
      stack: error.stack,
      url: typeof window !== "undefined" ? window.location.href : undefined,
    })
  }, [error])

  return (
    <html lang="es">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error en la aplicación</h1>
            <p className="text-gray-700 mb-6">
              Lo sentimos, ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => reset()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Intentar de nuevo
              </button>
            </div>
            {process.env.NODE_ENV === "development" && (
              <div className="mt-6 p-4 bg-gray-100 rounded overflow-auto">
                <p className="font-mono text-sm text-red-800">{error.message}</p>
                {error.stack && (
                  <pre className="mt-2 font-mono text-xs text-gray-700 whitespace-pre-wrap">{error.stack}</pre>
                )}
              </div>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}
