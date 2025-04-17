import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/database"

export function getBrowserDatabaseOperations() {
  const supabase = createClientComponentClient<Database>()

  return {
    async getProperties(limit = 10) {
      return supabase.from("properties").select("*").eq("status", "active").limit(limit)
    },

    async getPropertyById(id: string) {
      return supabase.from("properties").select("*").eq("id", id).single()
    },
  }
}
