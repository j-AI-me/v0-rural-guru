import { cookies } from "next/headers"
import { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies"

// Opciones para cookies seguras
interface SecureCookieOptions {
  value: string
  maxAge?: number
  path?: string
  domain?: string
  sameSite?: "strict" | "lax" | "none"
}

// Función para establecer una cookie segura
export function setSecureCookie(name: string, options: SecureCookieOptions) {
  const cookieStore = cookies()

  cookieStore.set({
    name,
    value: options.value,
    httpOnly: true, // No accesible desde JavaScript
    secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
    sameSite: options.sameSite || "lax", // Protección CSRF
    path: options.path || "/",
    maxAge: options.maxAge,
    ...(options.domain && { domain: options.domain }),
  })
}

// Función para obtener una cookie
export function getCookie(name: string): string | undefined {
  const cookieStore = cookies()
  return cookieStore.get(name)?.value
}

// Función para eliminar una cookie
export function deleteCookie(name: string, path = "/") {
  const cookieStore = cookies()
  cookieStore.delete({ name, path })
}

// Función para establecer cookies de sesión
export function setSessionCookies(response: Response, session: any) {
  const cookies = new ResponseCookies(response.headers)

  // Establecer cookie de sesión
  cookies.set({
    name: "session",
    value: JSON.stringify(session),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 semana
  })

  return response
}

// Función para establecer cookie de preferencias (accesible desde JavaScript)
export function setPreferenceCookie(
  name: string,
  value: string,
  maxAge = 60 * 60 * 24 * 365, // 1 año
) {
  if (typeof document !== "undefined") {
    const secureFlag = process.env.NODE_ENV === "production" ? "; Secure" : ""
    document.cookie = `${name}=${value}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secureFlag}`
  }
}
