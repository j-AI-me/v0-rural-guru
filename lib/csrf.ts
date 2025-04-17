"use client"

import { useEffect } from "react"
import { useState } from "react"
import { randomBytes } from "crypto"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

// Nombre de la cookie CSRF
const CSRF_COOKIE_NAME = "ruralguru_csrf_token"
// Nombre del campo en el formulario
const CSRF_FIELD_NAME = "csrf_token"
// Tiempo de expiración (1 hora)
const CSRF_EXPIRY = 60 * 60 * 1000

// Generar un token CSRF
export function generateCsrfToken(): string {
  return randomBytes(32).toString("hex")
}

// Establecer el token CSRF en una cookie
export function setCsrfCookie(): string {
  const token = generateCsrfToken()
  const cookieStore = cookies()

  cookieStore.set({
    name: CSRF_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CSRF_EXPIRY / 1000, // En segundos
  })

  return token
}

// Obtener el token CSRF de la cookie
export function getCsrfToken(): string | undefined {
  const cookieStore = cookies()
  return cookieStore.get(CSRF_COOKIE_NAME)?.value
}

// Middleware para verificar el token CSRF
export function validateCsrf(req: NextRequest): NextResponse | null {
  // Solo verificar en métodos que modifican datos
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    return null
  }

  try {
    // Obtener el token de la cookie
    const cookieToken = req.cookies.get(CSRF_COOKIE_NAME)?.value
    if (!cookieToken) {
      return NextResponse.json({ error: "Token CSRF no encontrado" }, { status: 403 })
    }

    // Para solicitudes JSON, el token debe estar en el encabezado
    if (req.headers.get("content-type")?.includes("application/json")) {
      const headerToken = req.headers.get("x-csrf-token")
      if (headerToken !== cookieToken) {
        return NextResponse.json({ error: "Token CSRF inválido" }, { status: 403 })
      }
    } else {
      // Para solicitudes de formulario, el token debe estar en el cuerpo
      // Esto requiere parsear el cuerpo, lo cual se haría en el manejador de la ruta
    }

    return null // Validación exitosa
  } catch (error) {
    console.error("Error validando CSRF:", error)
    return NextResponse.json({ error: "Error de validación CSRF" }, { status: 403 })
  }
}

// Hook para usar CSRF en formularios del cliente
export function useCsrfToken() {
  // Esta función se usaría en el cliente para obtener el token
  // desde una API que lo genere
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    async function fetchToken() {
      try {
        const response = await fetch("/api/csrf")
        const data = await response.json()
        if (data.token) {
          setToken(data.token)
        }
      } catch (error) {
        console.error("Error obteniendo token CSRF:", error)
      }
    }

    fetchToken()
  }, [])

  return token
}

// Componente para incluir el token CSRF en formularios
export function CsrfToken({ token }: { token: string }) {
  return <input type="hidden" name={CSRF_FIELD_NAME} value={token} />
}
