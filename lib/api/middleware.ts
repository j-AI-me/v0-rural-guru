import type { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"

type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void

export function withValidation(schema: z.ZodType<any>, handler: ApiHandler): ApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Validar el cuerpo de la solicitud
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body
      schema.parse(body)

      // Continuar con el handler si la validación es exitosa
      return handler(req, res)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          errors: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        })
      }

      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      })
    }
  }
}

export function withAuth(handler: ApiHandler): ApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Verificar autenticación
    const { supabase } = req as any

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      })
    }
    // Añadir usuario a la solicitud
    ;(req as any).user = session.user

    // Continuar con el handler si está autenticado
    return handler(req, res)
  }
}

export function withErrorHandling(handler: ApiHandler): ApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      return await handler(req, res)
    } catch (error: any) {
      console.error("API Error:", error)

      return res.status(500).json({
        success: false,
        message: error.message || "Error interno del servidor",
      })
    }
  }
}
