"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"
import { createBrowserClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

type SupabaseContext = {
  supabase: ReturnType<typeof createBrowserClient>
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [supabase] = useState(() => createBrowserClient())
  const router = useRouter()

  // Escuchar cambios de autenticación para refrescar la página
  supabase.auth.onAuthStateChange(() => {
    router.refresh()
  })

  return <Context.Provider value={{ supabase }}>{children}</Context.Provider>
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider")
  }
  return context
}
