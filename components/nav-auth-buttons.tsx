"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"

export function NavAuthButtons() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        setUser(data.session?.user || null)
      } catch (err) {
        console.error("Error al verificar la sesión:", err)
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <div className="h-9 w-20 bg-gray-200 animate-pulse rounded-md"></div>
        <div className="h-9 w-24 bg-gray-800 animate-pulse rounded-md"></div>
      </div>
    )
  }

  if (error) {
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

  if (user) {
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
