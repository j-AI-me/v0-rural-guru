"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { ErrorDisplay } from "@/components/ui/error-display"
import { logError } from "@/lib/error-handling"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logError(error, `ErrorBoundary: ${errorInfo.componentStack}`)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="p-4">
          <ErrorDisplay
            title="Algo salió mal"
            message={this.state.error?.message || "Ha ocurrido un error inesperado."}
            retry={() => this.setState({ hasError: false, error: null })}
          />
        </div>
      )
    }

    return this.props.children
  }
}
