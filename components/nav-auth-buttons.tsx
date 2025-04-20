"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function NavAuthButtons() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Importar el cliente de Supabase dinámicamente para evitar problemas de SSR
    const fetchSession = async () => {
      try {
        // Importación dinámica para evitar problemas de SSR
        const { createClient } = await import("@supabase/supabase-js")

        // Crear cliente directamente aquí en lugar de importar una función
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        const supabase = createClient(supabaseUrl, supabaseAnonKey)

        const { data } = await supabase.auth.getSession()
        setSession(data.session)

        // Suscribirse a cambios en la autenticación
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session)
        })

        setLoading(false)

        return () => {
          authListener?.subscription.unsubscribe()
        }
      } catch (error) {
        console.error("Error fetching session:", error)
        setLoading(false)
      }
    }

    fetchSession()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <div className="h-9 w-20 bg-gray-200 animate-pulse rounded-md"></div>
        <div className="h-9 w-24 bg-gray-800 animate-pulse rounded-md"></div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" className="text-sm">
            Dashboard
          </Button>
        </Link>
        <Link href="/auth/logout">
          <Button className="text-sm bg-black hover:bg-gray-800">Cerrar sesión</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/auth/login">
        <Button variant="ghost" className="text-sm">
          Iniciar sesión
        </Button>
      </Link>
      <Link href="/auth/registro">
        <Button className="text-sm bg-black hover:bg-gray-800">Registrarse</Button>
      </Link>
    </div>
  )
}
