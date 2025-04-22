"use client"

import type React from "react"

import { Suspense, lazy, useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface DynamicImportProps {
  importFn: () => Promise<{ default: React.ComponentType<any> }>
  props?: Record<string, any>
  fallback?: React.ReactNode
  onLoad?: () => void
}

export function DynamicImport({ importFn, props = {}, fallback, onLoad }: DynamicImportProps) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadComponent = async () => {
      try {
        const module = await importFn()
        if (isMounted) {
          setComponent(() => module.default)
          onLoad?.()
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error loading component:", err)
          setError(err instanceof Error ? err : new Error("Failed to load component"))
        }
      }
    }

    loadComponent()

    return () => {
      isMounted = false
    }
  }, [importFn, onLoad])

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-md">
        <p className="font-medium">Error al cargar el componente</p>
        <p className="text-sm">{error.message}</p>
      </div>
    )
  }

  if (!Component) {
    return fallback || <Skeleton className="h-40 w-full" />
  }

  return <Component {...props} />
}

// Función de utilidad para crear componentes con carga diferida
export function createDynamicComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  LoadingComponent: React.ReactNode = <Skeleton className="h-40 w-full" />,
) {
  const DynamicComponent = (props: React.ComponentProps<T>) => {
    const LazyComponent = lazy(importFn)

    return (
      <Suspense fallback={LoadingComponent}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }

  return DynamicComponent
}
