"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

type SupabaseContext = {
  supabase: ReturnType<typeof createBrowserClient> | null
}

const Context = createContext<SupabaseContext>({ supabase: null })

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [supabase, setSupabase] = useState<ReturnType<typeof createBrowserClient> | null>(null)
  const router = useRouter()

  // Inicializar Supabase solo en el lado del cliente
  useEffect(() => {
    const client = createBrowserClient()
    setSupabase(client)

    // Escuchar cambios de autenticación para refrescar la página
    const { data: authListener } = client.auth.onAuthStateChange(() => {
      router.refresh()
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [router])

  return <Context.Provider value={{ supabase }}>{children}</Context.Provider>
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider")
  }
  return context
}
