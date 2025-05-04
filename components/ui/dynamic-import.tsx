"use client"

import type React from "react"

import { Suspense, lazy } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// Versión simplificada del componente
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
