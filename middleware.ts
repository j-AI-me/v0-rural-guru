import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const pathname = req.nextUrl.pathname

  try {
    // Crear cliente de Supabase para el middleware
    const supabase = createMiddlewareClient({ req, res })

    // Refrescar la sesión si existe
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Rutas protegidas que requieren autenticación
    const protectedRoutes = ["/dashboard"]

    // Comprobar si la ruta actual está protegida y el usuario no está autenticado
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

    // Si es una ruta protegida y no hay sesión, redirigir a la página de acceso restringido
    if (isProtectedRoute && !session) {
      const redirectUrl = new URL("/acceso-restringido", req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Si el usuario está intentando acceder a páginas de autenticación pero ya está autenticado
    if ((pathname.startsWith("/auth/login") || pathname.startsWith("/auth/registro")) && session) {
      const redirectUrl = new URL("/dashboard", req.url)
      return NextResponse.redirect(redirectUrl)
    }
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
