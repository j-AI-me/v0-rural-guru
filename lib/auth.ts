"use server"

import { createServerClientWithCookies } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import type { Session } from "@supabase/supabase-js"

// Obtener la sesión del usuario actual desde el servidor
export async function getSession(): Promise<Session | null> {
  const supabase = createServerClientWithCookies()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

// Verificar si el usuario está autenticado y redirigir si es necesario
export async function requireAuth(redirectTo = "/auth/login") {
  try {
    const session = await getSession()

    if (!session) {
      redirect(redirectTo)
    }

    return session
  } catch (error) {
    console.error("Error en requireAuth:", error)
    // Si hay un error, redirigir de todos modos para evitar problemas de seguridad
    redirect(redirectTo)
  }
}

// Verificar si el usuario ya está autenticado y redirigir si es necesario
export async function requireGuest(redirectTo = "/dashboard") {
  const session = await getSession()

  if (session) {
    redirect(redirectTo)
  }

  return null
}

// Obtener el perfil del usuario actual
export async function getCurrentUserProfile() {
  const session = await getSession()

  if (!session) {
    return null
  }

  const supabase = createServerClientWithCookies()
  const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  return data
}
