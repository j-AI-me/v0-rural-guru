import { NextResponse } from "next/server"

// Tipos de errores
export class AppError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.isOperational = isOperational
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, true)
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message, 401, true)
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string) {
    super(message, 403, true)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, true)
  }
}

// Función para manejar errores en rutas API
export function handleApiError(error: any) {
  console.error("API Error:", error)

  // Si es un error personalizado, usar su código de estado
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        // No incluir detalles técnicos en producción
        ...(process.env.NODE_ENV !== "production" && { stack: error.stack }),
      },
      { status: error.statusCode },
    )
  }

  // Para errores de Supabase
  if (error.code) {
    // Mapear códigos de error comunes
    switch (error.code) {
      case "PGRST301":
      case "PGRST204":
        return NextResponse.json({ error: "Recurso no encontrado" }, { status: 404 })
      case "PGRST401":
      case "PGRST403":
        return NextResponse.json({ error: "No autorizado" }, { status: 403 })
      default:
        // Mensaje genérico para otros errores
        return NextResponse.json(
          {
            error: "Error en el servidor",
            // Solo incluir detalles técnicos en desarrollo
            ...(process.env.NODE_ENV !== "production" && {
              code: error.code,
              details: error.message,
            }),
          },
          { status: 500 },
        )
    }
  }

  // Error genérico
  return NextResponse.json(
    {
      error: "Error en el servidor",
      ...(process.env.NODE_ENV !== "production" && {
        message: error.message,
        stack: error.stack,
      }),
    },
    { status: 500 },
  )
}

// Simple error logging function
export function logError(error: any, context?: string) {
  console.error(`Error ${context ? `in ${context}` : ""}:`, error)
}

// Wrapper para funciones asíncronas
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context?: string,
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const data = await fn()
    return { data, error: null }
  } catch (error: any) {
    logError(error, context)
    return { data: null, error }
  }
}
