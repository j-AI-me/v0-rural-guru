import type { NextRequest } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"

// Configuración de límites por tipo de ruta
const RATE_LIMITS = {
  default: { limit: 100, window: 60 }, // 100 solicitudes por minuto
  auth: { limit: 10, window: 60 }, // 10 solicitudes por minuto para autenticación
  api: { limit: 50, window: 60 }, // 50 solicitudes por minuto para API general
}

// Función para obtener la IP real del cliente
function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for")
  return (forwarded ? forwarded.split(",")[0] : "127.0.0.1").trim()
}

// Función para limitar la tasa de solicitudes usando Supabase
export async function rateLimit(req: NextRequest, type: "default" | "auth" | "api" = "default") {
  try {
    // Obtener configuración de límite según el tipo
    const { limit, window } = RATE_LIMITS[type]

    // Obtener IP del cliente
    const ip = getClientIp(req)

    // Crear clave única para esta IP y tipo de límite
    const key = `${type}:${ip}`

    const supabase = getSupabaseServerClient()

    // Verificar si existe un registro para esta IP y tipo
    const { data: existingData, error: fetchError } = await supabase
      .from("rate_limits")
      .select("count, created_at")
      .eq("key", key)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      // Error diferente a "no se encontró ningún registro"
      console.error("Error al verificar límite de tasa:", fetchError)
      return { success: true, remaining: 1 } // Permitir en caso de error
    }

    const now = new Date()

    if (existingData) {
      const createdAt = new Date(existingData.created_at)
      const elapsedSeconds = (now.getTime() - createdAt.getTime()) / 1000

      // Si ha pasado la ventana de tiempo, reiniciar contador
      if (elapsedSeconds > window) {
        const { error: updateError } = await supabase
          .from("rate_limits")
          .update({ count: 1, created_at: now.toISOString() })
          .eq("key", key)

        if (updateError) {
          console.error("Error al actualizar límite de tasa:", updateError)
        }

        return { success: true, remaining: limit - 1 }
      }

      // Incrementar contador
      const newCount = existingData.count + 1

      // Verificar si se ha excedido el límite
      if (newCount > limit) {
        return { success: false, error: "Demasiadas solicitudes, por favor intenta más tarde", remaining: 0 }
      }

      // Actualizar contador
      const { error: updateError } = await supabase.from("rate_limits").update({ count: newCount }).eq("key", key)

      if (updateError) {
        console.error("Error al actualizar límite de tasa:", updateError)
      }

      return { success: true, remaining: limit - newCount }
    } else {
      // Crear nuevo registro
      const { error: insertError } = await supabase
        .from("rate_limits")
        .insert({ key, count: 1, created_at: now.toISOString() })

      if (insertError) {
        console.error("Error al insertar límite de tasa:", insertError)
      }

      return { success: true, remaining: limit - 1 }
    }
  } catch (error) {
    console.error("Error en rateLimit:", error)
    // En caso de error, permitir la solicitud
    return { success: true, remaining: 1 }
  }
}
