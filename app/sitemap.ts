import type { MetadataRoute } from "next"
import { getSupabaseServerClient } from "@/lib/supabase"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ruralguru.com"

  // Rutas estáticas
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ] as MetadataRoute.Sitemap

  // Obtener propiedades para rutas dinámicas
  const supabase = getSupabaseServerClient()
  const { data: properties } = await supabase.from("properties").select("id, updated_at").eq("status", "active")

  // Crear rutas para propiedades
  const propertyRoutes =
    properties?.map((property) => ({
      url: `${baseUrl}/properties/${property.id}`,
      lastModified: new Date(property.updated_at),
      changeFrequency: "weekly",
      priority: 0.8,
    })) || []

  return [...staticRoutes, ...propertyRoutes]
}
