"use server"

import { createServerClient } from "@/lib/supabase"

// Función para obtener propiedades destacadas
export async function getFeaturedProperties() {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(3)

    if (error) {
      console.error("Error fetching featured properties:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching featured properties:", error)
    return []
  }
}
