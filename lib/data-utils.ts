// Propiedades de demostración para fallback
export const demoProperties = [
  {
    id: "1",
    name: "The Auteiro Crown",
    description: "Casa rural en la montaña con vistas y jardín",
    location: "Asturias",
    price: 95,
    image_url: "/countryside-cottage.png",
  },
  {
    id: "2",
    name: "Maria Manuela Hotel & Spa",
    description: "Hotel moderno con spa en entorno rural",
    location: "Asturias",
    price: 120,
    image_url: "/countryside-retreat.png",
  },
  {
    id: "3",
    name: "El Bricial Hotel",
    description: "Hotel en Asturias, cerca de Covadonga",
    location: "Covadonga",
    price: 85,
    image_url: "/covadonga-sanctuary-view.png",
  },
]

// Función para obtener propiedades de forma segura
export async function fetchProperties(limit = 3) {
  // Usamos un bloque try/catch para manejar cualquier error
  try {
    // Verificamos que estamos en el servidor
    if (typeof window !== "undefined") {
      console.warn("fetchProperties debe ser llamado solo desde el servidor")
      return demoProperties
    }

    // Importamos dinámicamente para evitar errores de SSR
    const { getSupabaseServerClient } = await import("@/lib/supabase")
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase.from("properties").select("*").order("id", { ascending: true }).limit(limit)

    if (error) {
      console.error("Error fetching properties:", error)
      return demoProperties
    }

    return data && data.length > 0 ? data : demoProperties
  } catch (error) {
    console.error("Error in fetchProperties:", error)
    return demoProperties
  }
}
