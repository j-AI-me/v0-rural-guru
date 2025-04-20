"use server"

import { createServerClient } from "@/lib/supabase"

// Función para obtener todas las propiedades
export async function getProperties() {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching properties:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching properties:", error)
    return []
  }
}
