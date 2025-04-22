import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import dynamic from "next/dynamic"
import { Suspense } from "react"

// Importación estática de componentes críticos para el renderizado inicial
import { ThemeProvider } from "@/components/theme-provider"
import { ClientAppProvider } from "./client-providers"

// Importaciones dinámicas para componentes no críticos
const AuthProvider = dynamic(() => import("@/components/auth/auth-provider").then((mod) => mod.AuthProvider), {
  ssr: true,
})

const SupabaseProvider = dynamic(() => import("./supabase-provider"), {
  ssr: true,
})

// Optimizar la carga de fuentes
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "RuralGuru - Alojamientos rurales en Asturias",
  description: "Encuentra el alojamiento rural perfecto para tus vacaciones en Asturias",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SupabaseProvider>
            <Suspense fallback={<div className="min-h-screen bg-gray-50"></div>}>
              <AuthProvider>
                <ClientAppProvider>{children}</ClientAppProvider>
              </AuthProvider>
            </Suspense>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
