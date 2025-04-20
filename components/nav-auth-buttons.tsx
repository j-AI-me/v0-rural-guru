"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"

export function NavAuthButtons() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <div className="h-9 w-20 bg-gray-200 animate-pulse rounded-md"></div>
        <div className="h-9 w-24 bg-gray-800 animate-pulse rounded-md"></div>
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
