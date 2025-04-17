import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Create a singleton for server-side Supabase client
let supabaseServerClient: ReturnType<typeof createClient> | null = null

export function getSupabaseServerClient() {
  const cookieStore = cookies()

  if (!supabaseServerClient) {
    supabaseServerClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })
  }

  return supabaseServerClient
}
