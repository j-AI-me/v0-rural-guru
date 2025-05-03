"use client"

import type React from "react"
import { Suspense } from "react"
import dynamic from "next/dynamic"

// Import the AppProvider dynamically with ssr: false
const AppProviderDynamic = dynamic(() => import("@/contexts/app-context").then((mod) => mod.AppProvider), {
  ssr: false,
})

// Create a client component wrapper for the AppProvider
export function ClientAppProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50"></div>}>
      <AppProviderDynamic>{children}</AppProviderDynamic>
    </Suspense>
  )
}
