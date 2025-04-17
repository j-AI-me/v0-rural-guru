import { z } from "zod"
import DOMPurify from "isomorphic-dompurify"

// Función para sanitizar texto contra XSS
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  })
}

// Esquemas de validación comunes
export const emailSchema = z.string().email("Email inválido")
export const passwordSchema = z.string().min(8, "La contraseña debe tener al menos 8 caracteres")
export const nameSchema = z.string().min(2, "El nombre debe tener al menos 2 caracteres")

// Esquema para registro de usuario
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: nameSchema,
  role: z.enum(["guest", "host"]),
})

// Esquema para inicio de sesión
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "La contraseña es requerida"),
})

// Esquema para creación de propiedad
export const propertySchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().optional(),
  location: z.string().min(2, "La ubicación es requerida"),
  address: z.string().optional(),
  price: z.number().positive("El precio debe ser positivo"),
  max_guests: z.number().int().positive("El número de huéspedes debe ser positivo"),
  bedrooms: z.number().int().positive("El número de habitaciones debe ser positivo"),
  beds: z.number().int().positive("El número de camas debe ser positivo"),
  bathrooms: z.number().int().positive("El número de baños debe ser positivo"),
  type: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  adapted_mobility: z.boolean().optional(),
})

// Esquema para creación de reserva
export const bookingSchema = z.object({
  property_id: z.string().uuid("ID de propiedad inválido"),
  check_in: z.string().refine((val) => !isNaN(Date.parse(val)), "Fecha de entrada inválida"),
  check_out: z.string().refine((val) => !isNaN(Date.parse(val)), "Fecha de salida inválida"),
  guests: z.number().int().positive("El número de huéspedes debe ser positivo"),
})

// Esquema para reseñas
export const reviewSchema = z.object({
  property_id: z.string().uuid("ID de propiedad inválido"),
  rating: z.number().int().min(1).max(5, "La calificación debe estar entre 1 y 5"),
  comment: z.string().max(1000, "El comentario no puede exceder los 1000 caracteres").optional(),
})

// Función para validar datos con un esquema específico
export async function validateData<T>(
  schema: z.ZodType<T>,
  data: unknown,
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const validatedData = await schema.parseAsync(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(", "),
      }
    }
    return { success: false, error: "Error de validación desconocido" }
  }
}

// Middleware para validar solicitudes API
export function withValidation<T>(schema: z.ZodType<T>) {
  return async (req: Request) => {
    try {
      const body = await req.json()
      const result = await validateData(schema, body)

      if (!result.success) {
        return new Response(JSON.stringify({ error: result.error }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        })
      }

      return { success: true, data: result.data }
    } catch (error) {
      return new Response(JSON.stringify({ error: "Error al procesar la solicitud" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }
  }
}
