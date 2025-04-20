import type React from "react"
import "./globals.css"

export const metadata = {
  title: "RuralGuru",
  description: "Alojamientos rurales en Asturias",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
