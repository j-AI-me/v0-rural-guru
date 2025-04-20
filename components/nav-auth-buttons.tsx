"use client"

import Link from "next/link"

export function NavAuthButtons() {
  return (
    <div className="flex items-center gap-4">
      <Link href="/auth/login" className="text-sm">
        Iniciar sesión
      </Link>
      <Link href="/auth/registro" className="text-sm">
        Registrarse
      </Link>
    </div>
  )
}
