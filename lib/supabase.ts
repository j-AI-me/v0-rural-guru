import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Función para obtener el cliente Supabase en el servidor
export function getSupabaseServerClient() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

    // Crear un nuevo cliente para cada solicitud
    const cookieStore = cookies()
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
  } catch (error) {
    console.error("Error initializing Supabase server client:", error)
    throw error
  }
}

// Alias para mantener compatibilidad con el código existente
export const getServerSupabase = getSupabaseServerClient
