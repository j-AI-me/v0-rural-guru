"use server"

import { createServerClientWithCookies } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import type { Session } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Obtener la sesión del usuario actual desde el servidor con manejo mejorado de tokens
export async function getSession(): Promise<Session | null> {
  try {
    const supabase = createServerClientWithCookies()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Verificar la validez del token JWT
    if (session && session.expires_at) {
      const expiresAt = new Date(session.expires_at * 1000)
      const now = new Date()

      // Si el token está a punto de expirar (menos de 5 minutos), refrescarlo
      if (expiresAt.getTime() - now.getTime() < 300000) {
        const { data } = await supabase.auth.refreshSession()
        return data.session
      }
    }

    return session
  } catch (error) {
    console.error("Error en getSession:", error)
    return null
  }
}

// Verificar si el usuario está autenticado y redirigir si es necesario
export async function requireAuth(redirectTo = "/auth/login") {
  try {
    const session = await getSession()

    if (!session) {
      redirect(redirectTo)
    }

    // Verificar roles o permisos específicos si es necesario
    // Ejemplo: if (session.user.role !== 'admin') redirect('/unauthorized')

    return session
  } catch (error) {
    console.error("Error en requireAuth:", error)
    // Si hay un error, redirigir de todos modos para evitar problemas de seguridad
    redirect(redirectTo)
  }
}

// Verificar si el usuario ya está autenticado y redirigir si es necesario
export async function requireGuest(redirectTo = "/dashboard") {
  try {
    const session = await getSession()

    if (session) {
      redirect(redirectTo)
    }

    return null
  } catch (error) {
    console.error("Error en requireGuest:", error)
    return null
  }
}

// Obtener el perfil del usuario actual con manejo de caché
export async function getCurrentUserProfile() {
  try {
    const session = await getSession()

    if (!session) {
      return null
    }

    const supabase = createServerClientWithCookies()
    const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

    if (error) {
      console.error("Error al obtener perfil:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error en getCurrentUserProfile:", error)
    return null
  }
}

// Cerrar sesión de forma segura
export async function logoutUser(redirectTo = "/") {
  try {
    const supabase = createServerClientWithCookies()
    await supabase.auth.signOut()

    // Limpiar cookies relacionadas con la autenticación
    const cookieStore = cookies()
    cookieStore.getAll().forEach((cookie) => {
      if (cookie.name.includes("supabase") || cookie.name.includes("auth")) {
        cookieStore.delete(cookie.name)
      }
    })

    redirect(redirectTo)
  } catch (error) {
    console.error("Error al cerrar sesión:", error)
    redirect(redirectTo)
  }
}
