import { NextResponse } from "next/server"
import { isAdmin, promoteToAdmin } from "@/lib/admin-utils"
import { getSupabaseServerClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    // Verificar que el solicitante sea un administrador
    const supabase = getSupabaseServerClient()
    const { data: sessionData } = await supabase.auth.getSession()

    if (!sessionData.session) {
      return NextResponse.json({ success: false, message: "No autenticado" }, { status: 401 })
    }

    const currentUserId = sessionData.session.user.id
    const isCurrentUserAdmin = await isAdmin(currentUserId)

    if (!isCurrentUserAdmin) {
      return NextResponse.json({ success: false, message: "No autorizado" }, { status: 403 })
    }

    // Obtener datos del cuerpo de la solicitud
    const body = await request.json()
    const { userId } = body

    // Validar datos
    if (!userId) {
      return NextResponse.json({ success: false, message: "Falta el ID de usuario" }, { status: 400 })
    }

    // Promover usuario a administrador
    const success = await promoteToAdmin(userId)

    if (!success) {
      return NextResponse.json(
        { success: false, message: "Error al promover usuario a administrador" },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Usuario promovido a administrador exitosamente",
    })
  } catch (error: any) {
    console.error("Error en la ruta de promoción a administrador:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Error interno del servidor" },
      { status: 500 },
    )
  }
}
