import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CookieConsent } from "@/components/cookie-consent"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RuralGuru - Casas rurales en Asturias",
  description: "Encuentra y reserva las mejores casas rurales en Asturias",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <div className="px-6 md:px-10 lg:px-12 mx-auto max-w-7xl">{children}</div>
        <CookieConsent />
        <Toaster />
      </body>
    </html>
  )
}


import './globals.css'