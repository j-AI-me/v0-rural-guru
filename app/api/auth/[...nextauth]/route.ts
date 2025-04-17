import { type NextRequest, NextResponse } from "next/server"
import { rateLimit } from "@/lib/rate-limit"
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth-options"

// Middleware para rutas de autenticación
export async function middleware(req: NextRequest) {
  // Verificar límite de tasa más estricto para autenticación
  const rateLimitResult = await rateLimit(req, "auth")

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: rateLimitResult.error },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
          "X-RateLimit-Limit": "10",
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.floor(Date.now() / 1000) + 60),
        },
      },
    )
  }

  return NextResponse.next()
}

// Configurar NextAuth
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
