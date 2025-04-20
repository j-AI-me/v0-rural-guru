import { createClient } from "@supabase/supabase-js"

// Función para crear un cliente de Supabase en el servidor
export const createServerClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  // Verificar que las URLs sean válidas
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("Variables de entorno de Supabase no definidas en el servidor")
    // Devolver un cliente con valores por defecto que no causará errores
    return createClient("https://placeholder-url.supabase.co", "placeholder-key", {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  // Verificar que la URL sea válida
  try {
    new URL(supabaseUrl)
  } catch (error) {
    console.error("URL de Supabase inválida:", supabaseUrl)
    return createClient("https://placeholder-url.supabase.co", "placeholder-key", {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
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
  try {
    // Asegurarse de que las variables de entorno estén definidas
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error(
        "Error: Variables de entorno de Supabase no definidas. Asegúrate de que NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY estén configuradas.",
      )
      // Devolver un cliente con valores por defecto que no causará errores
      return createClient("https://placeholder-url.supabase.co", "placeholder-key")
    }

    // Verificar que la URL sea válida
    try {
      new URL(supabaseUrl)
    } catch (error) {
      console.error("URL de Supabase inválida:", supabaseUrl)
      return createClient("https://placeholder-url.supabase.co", "placeholder-key")
    }

    return createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error("Error al crear el cliente de Supabase:", error)
    // Devolver un cliente con valores por defecto que no causará errores
    return createClient("https://placeholder-url.supabase.co", "placeholder-key")
  }
}

/**
 * IMPORTANTE: Esta función solo debe usarse en componentes cliente ('use client').
 * No importar esta función en componentes de servidor o archivos que se usen en el servidor.
 */
export const getSupabaseBrowserClient = createBrowserClient
