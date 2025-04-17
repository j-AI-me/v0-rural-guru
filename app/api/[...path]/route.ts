import { type NextRequest, NextResponse } from "next/server"
import { rateLimit } from "@/lib/rate-limit"

// Middleware global para todas las rutas API
export async function middleware(req: NextRequest) {
  // Verificar límite de tasa
  const rateLimitResult = await rateLimit(req, "api")

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: rateLimitResult.error },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
          "X-RateLimit-Limit": "50",
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.floor(Date.now() / 1000) + 60),
        },
      },
    )
  }

  // Añadir encabezados de límite de tasa
  const response = NextResponse.next()
  response.headers.set("X-RateLimit-Limit", "50")
  response.headers.set("X-RateLimit-Remaining", String(rateLimitResult.remaining))

  return response
}

// Configurar qué rutas se aplican
export const config = {
  matcher: "/api/:path*",
}
