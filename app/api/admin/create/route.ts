import { NextResponse } from "next/server"
import { createAdmin, isAdmin } from "@/lib/admin-utils"
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
    const { email, password, fullName } = body

    // Validar datos
    if (!email || !password || !fullName) {
      return NextResponse.json({ success: false, message: "Faltan datos requeridos" }, { status: 400 })
    }

    // Crear administrador
    const newAdminId = await createAdmin(email, password, fullName)

    if (!newAdminId) {
      return NextResponse.json({ success: false, message: "Error al crear administrador" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Administrador creado exitosamente",
      adminId: newAdminId,
    })
  } catch (error: any) {
    console.error("Error en la ruta de creación de administrador:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Error interno del servidor" },
      { status: 500 },
    )
  }
}
