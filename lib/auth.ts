import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { z } from "zod"

// Esquema para validación de credenciales
const credentialsSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
})

// Función para obtener el cliente de Supabase en el servidor
export function getServerSupabase() {
  const cookieStore = cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}

// Función para verificar la autenticación en rutas API
export async function verifyAuth(req: NextRequest) {
  const supabase = getServerSupabase()

  // Obtener token de la cookie de sesión
  const { data, error } = await supabase.auth.getSession()

  if (error || !data.session) {
    return { authenticated: false, user: null, error: "No autenticado" }
  }

  return {
    authenticated: true,
    user: data.session.user,
    error: null,
  }
}

// Función para registrar un usuario
export async function registerUser(email: string, password: string, userData: any) {
  try {
    // Validar credenciales
    const validationResult = credentialsSchema.safeParse({ email, password })
    if (!validationResult.success) {
      return { success: false, error: validationResult.error.errors[0].message }
    }

    const supabase = getServerSupabase()

    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Requerir verificación de email
      user_metadata: {
        full_name: userData.fullName,
      },
    })

    if (authError) {
      return { success: false, error: authError.message }
    }

    if (!authData.user) {
      return { success: false, error: "Error al crear usuario" }
    }

    // Crear perfil de usuario en nuestra tabla personalizada
    const { error: profileError } = await supabase.from("users").insert({
      id: authData.user.id,
      email,
      full_name: userData.fullName,
      role: userData.role || "guest",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (profileError) {
      // Si falla la creación del perfil, eliminar el usuario de Auth
      await supabase.auth.admin.deleteUser(authData.user.id)
      return { success: false, error: profileError.message }
    }

    return { success: true, userId: authData.user.id }
  } catch (error: any) {
    console.error("Error en registerUser:", error)
    return { success: false, error: error.message || "Error desconocido" }
  }
}

// Función para verificar permisos de usuario
export async function checkUserPermission(userId: string, requiredRole: string) {
  try {
    const supabase = getServerSupabase()

    const { data, error } = await supabase.from("users").select("role").eq("id", userId).single()

    if (error || !data) {
      return false
    }

    // Verificar si el rol del usuario cumple con el requerido
    if (requiredRole === "admin") {
      return data.role === "admin"
    } else if (requiredRole === "host") {
      return data.role === "admin" || data.role === "host"
    } else {
      return true // Todos los usuarios autenticados tienen acceso a rutas 'guest'
    }
  } catch (error) {
    console.error("Error en checkUserPermission:", error)
    return false
  }
}
