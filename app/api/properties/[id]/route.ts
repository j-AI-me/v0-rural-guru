import { type NextRequest, NextResponse } from "next/server"
import { withResourceOwnership } from "@/lib/authorization"
import { validateCsrf } from "@/lib/csrf"
import { withValidation } from "@/lib/validation"
import { propertySchema } from "@/lib/validation"
import { getServerSupabase } from "@/lib/auth"
import { rateLimit } from "@/lib/rate-limit"

// GET: Obtener una propiedad por ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const propertyId = params.id

    if (!propertyId) {
      return NextResponse.json({ error: "ID de propiedad no proporcionado" }, { status: 400 })
    }

    const supabase = getServerSupabase()

    const { data, error } = await supabase
      .from("properties")
      .select(`
        *,
        property_images(*),
        property_amenities(*),
        host:host_id(id, full_name, email)
      `)
      .eq("id", propertyId)
      .single()

    if (error) {
      return NextResponse.json({ error: "Error al obtener la propiedad" }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error en GET property:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// PUT: Actualizar una propiedad
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar CSRF
    const csrfError = validateCsrf(req)
    if (csrfError) return csrfError

    // Verificar límite de tasa
    const rateLimitResult = await rateLimit(req)
    if (rateLimitResult.error) {
      return NextResponse.json({ error: rateLimitResult.error }, { status: 429 })
    }

    const propertyId = params.id

    // Verificar propiedad del recurso
    const ownershipResult = await withResourceOwnership(req, "property", propertyId)
    if (ownershipResult instanceof NextResponse) {
      return ownershipResult
    }

    // Validar datos de entrada
    const validationResult = await withValidation(propertySchema)(req)
    if (validationResult instanceof Response) {
      return validationResult
    }

    const { data: propertyData } = validationResult

    // Actualizar propiedad
    const supabase = getServerSupabase()
    const { error } = await supabase
      .from("properties")
      .update({
        ...propertyData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", propertyId)

    if (error) {
      return NextResponse.json({ error: "Error al actualizar la propiedad" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error en PUT property:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// DELETE: Eliminar una propiedad
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar CSRF
    const csrfError = validateCsrf(req)
    if (csrfError) return csrfError

    // Verificar límite de tasa
    const rateLimitResult = await rateLimit(req)
    if (rateLimitResult.error) {
      return NextResponse.json({ error: rateLimitResult.error }, { status: 429 })
    }

    const propertyId = params.id

    // Verificar propiedad del recurso o si es administrador
    const ownershipResult = await withResourceOwnership(req, "property", propertyId)
    if (ownershipResult instanceof NextResponse) {
      return ownershipResult
    }

    // Eliminar propiedad
    const supabase = getServerSupabase()
    const { error } = await supabase.from("properties").delete().eq("id", propertyId)

    if (error) {
      return NextResponse.json({ error: "Error al eliminar la propiedad" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error en DELETE property:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
