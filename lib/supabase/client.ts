import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/database"

// Create a single supabase client for interacting with your database
export const supabase = createClientComponentClient<Database>()

// Function to get a client instance
export function getSupabaseBrowserClient() {
  return createClientComponentClient<Database>()
}
