"use client"

import { Component, type ReactNode } from "react"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error): void {
    console.error("Error en componente:", error)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 border border-red-300 bg-red-50 rounded-md">
            <h2 className="text-lg font-semibold text-red-800">Algo salió mal</h2>
            <p className="text-red-600">Ha ocurrido un error inesperado.</p>
          </div>
        )
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
