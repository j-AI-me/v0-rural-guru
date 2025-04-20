import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Crear cliente de Supabase para el middleware
  const supabase = createMiddlewareClient({ req, res })

  // Refrescar la sesión si existe
  await supabase.auth.getSession()

  return res
}
