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
      severity: "critical",
      context: {
        digest: error.digest,
        global: true,
      },
      stack: error.stack,
    })
  }, [error])

  return (
    <html lang="es">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Algo salió mal</h1>
            <p className="text-gray-700 mb-6">
              Lo sentimos, ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
            </p>
            {process.env.NODE_ENV === "development" && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded">
                <p className="font-mono text-sm text-red-800">{error.message}</p>
                {error.digest && <p className="font-mono text-xs text-red-600 mt-1">ID: {error.digest}</p>}
              </div>
            )}
            <button
              onClick={reset}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
