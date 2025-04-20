import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  try {
    // Crear cliente de Supabase para el middleware
    const supabase = createMiddlewareClient({ req, res })

    // Refrescar la sesión si existe
    await supabase.auth.getSession()
  } catch (error) {
    console.error("Error en middleware:", error)
  }

  return res
}

// Configurar las rutas que deben usar el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
