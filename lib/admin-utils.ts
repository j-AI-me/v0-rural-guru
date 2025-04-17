import { supabase } from "@/lib/supabase/client"

/**
 * Verifica si un usuario es administrador
 * @param userId ID del usuario a verificar
 * @returns true si el usuario es administrador, false en caso contrario
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase.from("users").select("role").eq("id", userId).single()

  if (error || !data) {
    return false
  }

  return data.role === "admin"
}

/**
 * Promueve a un usuario existente a administrador
 * @param userId ID del usuario a promover
 * @returns true si la operación fue exitosa, false en caso contrario
 */
export async function promoteToAdmin(userId: string): Promise<boolean> {
  const { error } = await supabase
    .from("users")
    .update({ role: "admin", updated_at: new Date().toISOString() })
    .eq("id", userId)

  return !error
}

/**
 * Crea un nuevo usuario administrador
 * @param email Email del nuevo administrador
 * @param password Contraseña del nuevo administrador
 * @param fullName Nombre completo del nuevo administrador
 * @returns El ID del usuario creado si la operación fue exitosa, null en caso contrario
 */
export async function createAdmin(email: string, password: string, fullName: string): Promise<string | null> {
  try {
    // 1. Crear el usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Confirmar el email automáticamente
      user_metadata: {
        full_name: fullName,
      },
    })

    if (authError || !authData.user) {
      console.error("Error al crear usuario en Auth:", authError)
      return null
    }

    // 2. Crear el usuario en nuestra tabla personalizada
    const { error: dbError } = await supabase.from("users").insert({
      id: authData.user.id,
      email,
      full_name: fullName,
      role: "admin",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (dbError) {
      console.error("Error al crear usuario en DB:", dbError)
      // Intentar eliminar el usuario de Auth si falló la inserción en DB
      await supabase.auth.admin.deleteUser(authData.user.id)
      return null
    }

    return authData.user.id
  } catch (error) {
    console.error("Error al crear administrador:", error)
    return null
  }
}
