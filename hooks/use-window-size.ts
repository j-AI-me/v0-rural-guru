"use client"

import { useState, useEffect } from "react"
import { useMemoizedCallback } from "@/hooks/use-memoized"

interface WindowSize {
  width: number
  height: number
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

export function useWindowSize(mobileBreakpoint = 768, tabletBreakpoint = 1024): WindowSize {
  // Inicializar con valores por defecto para SSR
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  })

  // Memoizar la función de actualización para evitar recreaciones innecesarias
  const handleResize = useMemoizedCallback(() => {
    const width = window.innerWidth
    const height = window.innerHeight

    setWindowSize({
      width,
      height,
      isMobile: width < mobileBreakpoint,
      isTablet: width >= mobileBreakpoint && width < tabletBreakpoint,
      isDesktop: width >= tabletBreakpoint,
    })
  }, [mobileBreakpoint, tabletBreakpoint])

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === "undefined") return

    // Actualizar el tamaño inicial
    handleResize()

    // Agregar event listener para el resize
    window.addEventListener("resize", handleResize)

    // Limpiar event listener
    return () => window.removeEventListener("resize", handleResize)
  }, [handleResize])

  return windowSize
}
