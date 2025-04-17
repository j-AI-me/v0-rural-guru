import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Configurar encabezados de seguridad
  const response = NextResponse.next()

  // X-Frame-Options para prevenir clickjacking
  response.headers.set("X-Frame-Options", "DENY")

  // X-Content-Type-Options para prevenir MIME sniffing
  response.headers.set("X-Content-Type-Options", "nosniff")

  return response
}

// Limitar el middleware solo a las rutas necesarias
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
