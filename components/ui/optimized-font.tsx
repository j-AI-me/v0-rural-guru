"use client"

import { useEffect } from "react"

interface OptimizedFontProps {
  family: string
  weights?: number[]
  display?: "auto" | "block" | "swap" | "fallback" | "optional"
  preload?: boolean
  preconnect?: boolean
  subsets?: string[]
  text?: string
  variable?: string
}

export function OptimizedFont({
  family,
  weights = [400],
  display = "swap",
  preload = true,
  preconnect = true,
  subsets = ["latin"],
  text,
  variable,
}: OptimizedFontProps) {
  useEffect(() => {
    // Crear URL para Google Fonts
    const familyWithWeights = `${family.replace(/\s+/g, "+")}:wght@${weights.join(";")}${
      text ? `&text=${encodeURIComponent(text)}` : ""
    }`
    const url = `https://fonts.googleapis.com/css2?family=${familyWithWeights}&display=${display}${
      subsets.length > 0 ? `&subset=${subsets.join(",")}` : ""
    }`

    // Preconectar con Google Fonts
    if (preconnect) {
      const preconnectLink = document.createElement("link")
      preconnectLink.rel = "preconnect"
      preconnectLink.href = "https://fonts.googleapis.com"
      document.head.appendChild(preconnectLink)

      const preconnectGstatic = document.createElement("link")
      preconnectGstatic.rel = "preconnect"
      preconnectGstatic.href = "https://fonts.gstatic.com"
      preconnectGstatic.crossOrigin = "anonymous"
      document.head.appendChild(preconnectGstatic)
    }

    // Precargar la fuente si es necesario
    if (preload) {
      const preloadLink = document.createElement("link")
      preloadLink.rel = "preload"
      preloadLink.as = "style"
      preloadLink.href = url
      document.head.appendChild(preloadLink)
    }

    // Cargar la hoja de estilos
    const styleLink = document.createElement("link")
    styleLink.rel = "stylesheet"
    styleLink.href = url
    document.head.appendChild(styleLink)

    // Añadir variable CSS si es necesario
    if (variable) {
      const style = document.createElement("style")
      style.textContent = `:root { ${variable}: "${family}", sans-serif; }`
      document.head.appendChild(style)
    }

    // Limpiar al desmontar
    return () => {
      if (preconnect) {
        const preconnectLinks = document.querySelectorAll('link[rel="preconnect"]')
        preconnectLinks.forEach((link) => {
          if (
            link.getAttribute("href") === "https://fonts.googleapis.com" ||
            link.getAttribute("href") === "https://fonts.gstatic.com"
          ) {
            document.head.removeChild(link)
          }
        })
      }

      if (preload) {
        const preloadLinks = document.querySelectorAll('link[rel="preload"][as="style"]')
        preloadLinks.forEach((link) => {
          if (link.getAttribute("href") === url) {
            document.head.removeChild(link)
          }
        })
      }

      const styleLinks = document.querySelectorAll('link[rel="stylesheet"]')
      styleLinks.forEach((link) => {
        if (link.getAttribute("href") === url) {
          document.head.removeChild(link)
        }
      })

      if (variable) {
        const styles = document.querySelectorAll("style")
        styles.forEach((style) => {
          if (style.textContent?.includes(variable)) {
            document.head.removeChild(style)
          }
        })
      }
    }
  }, [family, weights, display, preload, preconnect, subsets, text, variable])

  return null
}
