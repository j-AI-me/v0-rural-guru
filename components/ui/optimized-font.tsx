"use client"

import type React from "react"

import { useEffect } from "react"
import { Inter, Poppins } from "next/font/google"

// Definir las fuentes que queremos precargar
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
})

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-poppins",
})

interface OptimizedFontProps {
  children: React.ReactNode
}

export default function OptimizedFont({ children }: OptimizedFontProps) {
  useEffect(() => {
    // Precargar fuentes críticas
    const linkEl = document.createElement("link")
    linkEl.rel = "preload"
    linkEl.href = inter.url
    linkEl.as = "font"
    linkEl.type = "font/woff2"
    linkEl.crossOrigin = "anonymous"
    document.head.appendChild(linkEl)

    // Añadir clase para activar las fuentes
    document.documentElement.classList.add(inter.variable, poppins.variable)

    return () => {
      // Limpieza
      document.head.removeChild(linkEl)
    }
  }, [])

  return <>{children}</>
}
