import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth, checkUserPermission } from "./auth"
import { getServerSupabase } from "./supabase"

// Middleware para verificar permisos en rutas API
export async function withAuthorization(req: NextRequest, requiredRole: "admin" | "host" | "guest") {
  try {
    // Verificar autenticación
    const { authenticated, user, error } = await verifyAuth(req)

    if (!authenticated || !user) {
      return NextResponse.json({ error: error || "No autenticado" }, { status: 401 })
    }

    // Verificar permisos
    const hasPermission = await checkUserPermission(user.id, requiredRole)

    if (!hasPermission) {
      return NextResponse.json({ error: "No autorizado para esta acción" }, { status: 403 })
    }

    // Usuario autenticado y con permisos
    return { authenticated: true, user }
  } catch (error: any) {
    console.error("Error en withAuthorization:", error)
    return NextResponse.json({ error: "Error de autorización" }, { status: 500 })
  }
}

// Función para verificar propiedad de un recurso
export async function verifyResourceOwnership(
  userId: string,
  resourceType: "property" | "booking" | "review",
  resourceId: string,
) {
  try {
    const supabase = getServerSupabase()

    let query

    switch (resourceType) {
      case "property":
        query = supabase.from("properties").select("id").eq("id", resourceId).eq("host_id", userId).single()
        break

      case "booking":
        query = supabase.from("bookings").select("id").eq("id", resourceId).eq("guest_id", userId).single()
        break

      case "review":
        query = supabase.from("reviews").select("id").eq("id", resourceId).eq("user_id", userId).single()
        break

      default:
        return false
    }

    const { data, error } = await query

    return !error && !!data
  } catch (error) {
    console.error("Error en verifyResourceOwnership:", error)
    return false
  }
}

// Middleware para verificar propiedad de un recurso
export async function withResourceOwnership(
  req: NextRequest,
  resourceType: "property" | "booking" | "review",
  resourceId: string,
) {
  try {
    // Verificar autenticación
    const { authenticated, user, error } = await verifyAuth(req)

    if (!authenticated || !user) {
      return NextResponse.json({ error: error || "No autenticado" }, { status: 401 })
    }

    // Verificar si es administrador (los administradores pueden acceder a todos los recursos)
    const isAdmin = await checkUserPermission(user.id, "admin")

    if (isAdmin) {
      return { authenticated: true, user, isOwner: true }
    }

    // Verificar propiedad del recurso
    const isOwner = await verifyResourceOwnership(user.id, resourceType, resourceId)

    if (!isOwner) {
      return NextResponse.json({ error: "No tienes permiso para acceder a este recurso" }, { status: 403 })
    }

    return { authenticated: true, user, isOwner: true }
  } catch (error: any) {
    console.error("Error en withResourceOwnership:", error)
    return NextResponse.json({ error: "Error al verificar propiedad del recurso" }, { status: 500 })
  }
}
