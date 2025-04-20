"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase"
import type { Session, User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  error: Error | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  error: null,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [supabase, setSupabase] = useState<ReturnType<typeof createBrowserClient> | null>(null)

  // Inicializar Supabase solo en el lado del cliente
  useEffect(() => {
    try {
      setSupabase(createBrowserClient())
    } catch (err) {
      console.error("Error al crear el cliente de Supabase:", err)
      setError(err instanceof Error ? err : new Error(String(err)))
      setIsLoading(false)
    }
  }, [])

  // Verificar si hay una sesión activa y suscribirse a cambios en la autenticación
  useEffect(() => {
    if (!supabase) return

    // Verificar si hay una sesión activa
    const checkSession = async () => {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          throw sessionError
        }

        setSession(data.session)
        setUser(data.session?.user || null)
      } catch (err) {
        console.error("Error checking session:", err)
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    // Suscribirse a cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user || null)
      setIsLoading(false)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [supabase])

  return <AuthContext.Provider value={{ user, session, isLoading, error }}>{children}</AuthContext.Provider>
}
