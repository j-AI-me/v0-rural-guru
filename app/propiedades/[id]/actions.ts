"use server"

import { createServerClient } from "@/lib/supabase"

// Función para obtener una propiedad por ID
export async function getProperty(id: string) {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase.from("properties").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching property:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error fetching property:", error)
    return null
  }
}
