"use client"

import type React from "react"

import { Suspense, lazy, useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface LazyComponentProps {
  importFn: () => Promise<{ default: React.ComponentType<any> }>
  props?: Record<string, any>
  fallback?: React.ReactNode
  onLoad?: () => void
}

export function LazyComponent({ importFn, props = {}, fallback, onLoad }: LazyComponentProps) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadComponent = async () => {
      try {
        const module = await importFn()
        if (isMounted) {
          setComponent(() => module.default)
          onLoad?.()
        }
      } catch (error) {
        console.error("Error loading component:", error)
      }
    }

    loadComponent()

    return () => {
      isMounted = false
    }
  }, [importFn, onLoad])

  if (!Component) {
    return fallback || <Skeleton className="h-40 w-full" />
  }

  return <Component {...props} />
}

// Componente de orden superior para crear componentes lazy
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  LoadingComponent: React.ReactNode = <Skeleton className="h-40 w-full" />,
) {
  const LazyComponentWrapper = (props: React.ComponentProps<T>) => {
    const LazyLoadedComponent = lazy(importFn)

    return (
      <Suspense fallback={LoadingComponent}>
        <LazyLoadedComponent {...props} />
      </Suspense>
    )
  }

  return LazyComponentWrapper
}
