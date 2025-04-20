"use client"

import type React from "react"
import dynamic from "next/dynamic"
import { ThemeProvider } from "@/components/theme-provider"

// Importar los componentes de forma dinámica
const SupabaseProvider = dynamic(() => import("./supabase-provider"), {
  ssr: false,
})

const AuthProvider = dynamic(
  () => import("@/components/auth/auth-provider").then((mod) => ({ default: mod.AuthProvider })),
  {
    ssr: false,
  },
)

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </ThemeProvider>
  )
}
