"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { logClientError } from "@/lib/error-handling"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Manejar errores no capturados
    const handleError = (event: ErrorEvent) => {
      event.preventDefault()
      setError(event.error || new Error(event.message))
      setHasError(true)

      // Registrar el error
      logClientError({
        message: event.message,
        stack: event.error?.stack,
        url: window.location.href,
      })
    }

    // Manejar rechazos de promesas no capturados
    const handleRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault()
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason))
      setError(error)
      setHasError(true)

      // Registrar el error
      logClientError({
        message: error.message,
        stack: error.stack,
        url: window.location.href,
      })
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleRejection)
    }
  }, [])

  if (hasError) {
    return (
      fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-4 bg-red-50 rounded-lg">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Algo salió mal</h2>
          <p className="text-red-600 mb-4">Ha ocurrido un error inesperado. Por favor, intenta recargar la página.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Recargar página
          </button>
          {process.env.NODE_ENV === "development" && error && (
            <div className="mt-4 p-4 bg-gray-100 rounded overflow-auto max-w-full">
              <p className="font-mono text-sm text-red-800">{error.message}</p>
              <pre className="mt-2 font-mono text-xs text-gray-700 whitespace-pre-wrap">{error.stack}</pre>
            </div>
          )}
        </div>
      )
    )
  }

  return <>{children}</>
}
