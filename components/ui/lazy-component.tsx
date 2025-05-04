"use client"

import type React from "react"

import { Suspense, lazy } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// Versión simplificada del componente
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
