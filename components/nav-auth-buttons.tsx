"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"

export function NavAuthButtons() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setSession(session)

        // Suscribirse a cambios en la autenticación
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session)
        })

        return () => subscription.unsubscribe()
      } catch (error) {
        console.error("Error fetching session:", error)
      } finally {
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
