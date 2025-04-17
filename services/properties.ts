import { getSupabaseServerClient } from "@/lib/supabase"

export async function getProperties(filters?: {
  location?: string
  minPrice?: number
  maxPrice?: number
  guests?: number
}) {
  const supabase = getSupabaseServerClient()

  let query = supabase
    .from("properties")
    .select(`
      *,
      property_images!inner(*)
    `)
    .eq("status", "active")
    .eq("property_images.is_main", true)

  // Apply filters if provided
  if (filters?.location) {
    query = query.ilike("location", `%${filters.location}%`)
  }

  if (filters?.minPrice) {
    query = query.gte("price", filters.minPrice)
  }

  if (filters?.maxPrice) {
    query = query.lte("price", filters.maxPrice)
  }

  if (filters?.guests) {
    query = query.gte("max_guests", filters.guests)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching properties:", error)
    return []
  }

  return data
}

export async function getPropertyById(id: string) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      property_images(*),
      property_amenities(*),
      users!inner(*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching property:", error)
    return null
  }

  return data
}

export async function getPropertiesNearby(latitude: number, longitude: number, radiusKm = 10) {
  const supabase = getSupabaseServerClient()

  // Aproximación simple: 1 grado de latitud ≈ 111 km
  // Esta es una aproximación básica, para cálculos más precisos se necesitaría una fórmula haversine
  const latDegrees = radiusKm / 111
  const longDegrees = radiusKm / (111 * Math.cos((latitude * Math.PI) / 180))

  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      property_images!inner(*)
    `)
    .eq("status", "active")
    .eq("property_images.is_main", true)
    .gte("latitude", latitude - latDegrees)
    .lte("latitude", latitude + latDegrees)
    .gte("longitude", longitude - longDegrees)
    .lte("longitude", longitude + longDegrees)

  if (error) {
    console.error("Error fetching nearby properties:", error)
    return []
  }

  return data
}

export async function getPropertiesByDistance(latitude: number, longitude: number, limit = 5) {
  const supabase = getSupabaseServerClient()

  // Obtener todas las propiedades activas
  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      property_images!inner(*)
    `)
    .eq("status", "active")
    .eq("property_images.is_main", true)
    .not("latitude", "is", null)
    .not("longitude", "is", null)

  if (error) {
    console.error("Error fetching properties by distance:", error)
    return []
  }

  // Calcular la distancia para cada propiedad usando la fórmula haversine
  const propertiesWithDistance = data.map((property) => {
    const distance = calculateDistance(latitude, longitude, property.latitude, property.longitude)
    return { ...property, distance }
  })

  // Ordenar por distancia y limitar el número de resultados
  return propertiesWithDistance.sort((a, b) => a.distance - b.distance).slice(0, limit)
}

// Función para calcular la distancia entre dos puntos usando la fórmula haversine
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371 // Radio de la Tierra en km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distancia en km
  return distance
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180)
}
