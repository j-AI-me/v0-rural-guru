import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

// Singleton para el cliente de Supabase
let supabaseInstance: ReturnType<typeof createClient> | null = null

export function getSupabaseBrowserClient() {
  // Verificar que estamos en el cliente
  if (typeof window === "undefined") {
    throw new Error("getSupabaseBrowserClient debe ser llamado solo desde el cliente")
  }

  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Variables de entorno de Supabase no definidas")
      return createMockClient()
    }

    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storageKey: "ruralguru-auth",
      },
    })
  }

  return supabaseInstance
}

// Para compatibilidad con código existente
export const supabase = typeof window !== "undefined" ? getSupabaseBrowserClient() : createMockClient()

// Cliente mock para entornos no compatibles
function createMockClient() {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
          limit: () => Promise.resolve({ data: [], error: null }),
        }),
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: null }),
        }),
        limit: () => Promise.resolve({ data: [], error: null }),
      }),
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
  } as any
}
