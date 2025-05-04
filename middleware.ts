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
    const protectedRoutes = ["/dashboard", "/api/admin", "/api/user", "/perfil"]

    // Rutas que requieren rol de administrador
    const adminRoutes = ["/dashboard/admin", "/api/admin"]

    // Comprobar si la ruta actual está protegida y el usuario no está autenticado
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
    const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

    // Si es una ruta protegida y no hay sesión, redirigir a la página de acceso restringido
    if (isProtectedRoute && !session) {
      const redirectUrl = new URL("/acceso-restringido", req.url)
      // Guardar la URL original para redirigir después del login
      redirectUrl.searchParams.set("redirectTo", pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Si es una ruta de administrador, verificar el rol del usuario
    if (isAdminRoute && session) {
      // Obtener el rol del usuario desde Supabase
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

      if (!profile || profile.role !== "admin") {
        return NextResponse.redirect(new URL("/acceso-restringido", req.url))
      }
    }

    // Si el usuario está intentando acceder a páginas de autenticación pero ya está autenticado
    if ((pathname.startsWith("/auth/login") || pathname.startsWith("/auth/registro")) && session) {
      // Verificar si hay un parámetro redirectTo en la URL
      const redirectTo = req.nextUrl.searchParams.get("redirectTo")
      const redirectUrl = new URL(redirectTo || "/dashboard", req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Añadir encabezados de seguridad
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set("X-Frame-Options", "DENY")
    requestHeaders.set("X-Content-Type-Options", "nosniff")
    requestHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin")
    requestHeaders.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

    // Devolver respuesta con encabezados de seguridad
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
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
     * - public files (robots.txt, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|public/).*)",
  ],
}
