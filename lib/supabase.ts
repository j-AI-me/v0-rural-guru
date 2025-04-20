import { createClient } from "@supabase/supabase-js"

// Función para crear un cliente de Supabase en el servidor
export const createServerClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("Variables de entorno de Supabase no definidas en el servidor")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Exportamos una función para el cliente que se usará en componentes cliente
export const createBrowserClient = () => {
  // Asegurarse de que las variables de entorno estén definidas
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "Error: Variables de entorno de Supabase no definidas. Asegúrate de que NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY estén configuradas.",
    )
    // Devolver un cliente con valores vacíos que no causará errores pero no funcionará
    return createClient("https://placeholder-url.supabase.co", "placeholder-key")
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

/**
 * IMPORTANTE: Esta función solo debe usarse en componentes cliente ('use client').
 * No importar esta función en componentes de servidor o archivos que se usen en el servidor.
 */
export const getSupabaseBrowserClient = createBrowserClient
