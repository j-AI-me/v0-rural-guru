import { supabase as supabaseClientInstance } from "./supabase/client"

// Re-export the existing client for backward compatibility
export const supabase = supabaseClientInstance

// For new code, use this function to get the singleton instance
export function getSupabaseBrowserClient() {
  return supabaseClientInstance
}
