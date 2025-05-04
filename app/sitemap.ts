import type { MetadataRoute } from "next"
import { createServerClientWithCookies } from "@/lib/supabase-server"

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
      url: `${baseUrl}/propiedades`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/registro`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ]

  // Obtener propiedades dinámicas desde Supabase
  const supabase = createServerClientWithCookies()
  const { data: properties } = await supabase
    .from("properties")
    .select("id, updated_at")
    .order("updated_at", { ascending: false })

  // Crear rutas dinámicas para propiedades
  const propertyRoutes =
    properties?.map((property) => ({
      url: `${baseUrl}/propiedades/${property.id}`,
      lastModified: new Date(property.updated_at),
      changeFrequency: "weekly",
      priority: 0.7,
    })) || []

  return [...staticRoutes, ...propertyRoutes]
}
