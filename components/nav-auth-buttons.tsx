"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export function NavAuthButtons() {
  // Usamos un estado simple para manejar la hidratación
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mientras no esté montado, mostramos un esqueleto
  if (!mounted) {
    return (
      <div className="flex items-center gap-4">
        <div className="h-9 w-20 bg-gray-200 animate-pulse rounded-md"></div>
        <div className="h-9 w-24 bg-gray-800 animate-pulse rounded-md"></div>
      </div>
    )
  }

  // Una vez montado, mostramos los botones reales
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
