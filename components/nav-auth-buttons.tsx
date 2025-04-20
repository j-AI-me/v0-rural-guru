"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function NavAuthButtons() {
  const [isClient, setIsClient] = useState(false)

  // Usar useEffect para evitar problemas de hidratación
  useEffect(() => {
    setIsClient(true)
  }, [])

  // No renderizar nada durante la hidratación para evitar errores
  if (!isClient) {
    return (
      <div className="flex items-center gap-4">
        <div className="h-9 w-20 bg-gray-200 rounded-md"></div>
        <div className="h-9 w-24 bg-gray-800 rounded-md"></div>
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
