import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Función para crear un cliente de Supabase con cookies (para autenticación en el servidor)
export const createServerClientWithCookies = () => {
  try {
    const cookieStore = cookies()

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    return createClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name) {
          try {
            return cookieStore.get(name)?.value
          } catch (error) {
            console.error(`Error al obtener cookie ${name}:`, error)
            return undefined
          }
        },
      },
    })
  } catch (error) {
    console.error("Error al crear cliente de Supabase con cookies:", error)
    // Fallback a cliente sin cookies
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    return createClient(supabaseUrl, supabaseAnonKey)
  }
}
