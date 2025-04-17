"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function SkipLink() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <a
      href="#main-content"
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50",
        "bg-primary text-primary-foreground px-4 py-2 rounded-md focus:outline-none",
      )}
    >
      Saltar al contenido principal
    </a>
  )
}
