"use client"

import type React from "react"
import { Component, type ErrorInfo, type ReactNode } from "react"
import { logClientError } from "@/lib/error-handling"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  componentName?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Registrar el error
    logClientError({
      message: error.message,
      severity: "high",
      context: {
        componentName: this.props.componentName || "Unknown",
        componentStack: errorInfo.componentStack,
      },
      stack: error.stack,
    })

    // Llamar al manejador personalizado si existe
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Renderizar fallback personalizado o el predeterminado
      return (
        this.props.fallback || (
          <div className="p-4 border border-red-300 bg-red-50 rounded-md">
            <h2 className="text-lg font-semibold text-red-800">Algo salió mal</h2>
            <p className="text-red-600">
              {process.env.NODE_ENV === "development"
                ? `Error: ${this.state.error?.message}`
                : "Ha ocurrido un error inesperado. Por favor, intenta de nuevo más tarde."}
            </p>
            {process.env.NODE_ENV === "development" && (
              <details className="mt-2">
                <summary className="text-sm text-red-700 cursor-pointer">Detalles del error</summary>
                <pre className="mt-2 p-2 bg-red-100 overflow-auto text-xs">{this.state.error?.stack}</pre>
              </details>
            )}
          </div>
        )
      )
    }

    return this.props.children
  }
}

// Componente de orden superior para envolver componentes con ErrorBoundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ErrorBoundaryProps, "children"> = {},
): React.FC<P> {
  const displayName = Component.displayName || Component.name || "Component"

  const WrappedComponent: React.FC<P> = (props) => (
    <ErrorBoundary {...options} componentName={displayName}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${displayName})`
  return WrappedComponent
}

export default ErrorBoundary
