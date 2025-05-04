// Sistema básico de manejo de errores sin dependencias externas

// Tipos de errores
export type ErrorSeverity = "low" | "medium" | "high" | "critical"

export interface ErrorDetails {
  message: string
  code?: string
  severity?: ErrorSeverity
  context?: Record<string, any>
  stack?: string
}

// Función para registrar errores en el cliente
export function logClientError(error: Error | ErrorDetails): void {
  const errorDetails =
    error instanceof Error
      ? {
          message: error.message,
          stack: error.stack,
          severity: "medium" as ErrorSeverity,
        }
      : error

  // En desarrollo, mostramos en consola
  if (process.env.NODE_ENV === "development") {
    console.error("Error del cliente:", errorDetails)
  }

  // En producción, podríamos enviar a un endpoint para registro
  if (process.env.NODE_ENV === "production") {
    try {
      // Aquí podríamos implementar un envío a un endpoint de registro
      // Por ahora solo registramos en consola de forma limitada
      console.error("Error:", errorDetails.message)
    } catch (e) {
      // Silenciamos errores en el registro de errores
      console.error("Error al registrar error:", e)
    }
  }
}

// Función para registrar errores en el servidor
export async function logServerError(error: Error | ErrorDetails): Promise<void> {
  const errorDetails =
    error instanceof Error
      ? {
          message: error.message,
          stack: error.stack,
          severity: "high" as ErrorSeverity,
        }
      : error

  // En desarrollo, mostramos detalles completos
  if (process.env.NODE_ENV === "development") {
    console.error("Error del servidor:", errorDetails)
  }

  // En producción, registramos de forma más controlada
  if (process.env.NODE_ENV === "production") {
    // Aquí podríamos implementar un registro en base de datos o servicio
    console.error("Error del servidor:", errorDetails.message)

    // También podríamos notificar por email errores críticos
    if (errorDetails.severity === "critical") {
      // Implementar notificación
    }
  }
}

// Función para formatear errores para respuestas API
export function formatApiError(error: Error | ErrorDetails): {
  error: string
  code?: string
  details?: Record<string, any>
} {
  const errorDetails = error instanceof Error ? { message: error.message } : error

  // En desarrollo, incluimos más detalles
  if (process.env.NODE_ENV === "development") {
    return {
      error: errorDetails.message,
      code: errorDetails.code || "UNKNOWN_ERROR",
      details: errorDetails.context,
    }
  }

  // En producción, respuestas más genéricas
  return {
    error: errorDetails.message,
    code: errorDetails.code,
  }
}

// Función para manejar errores en componentes
export function handleComponentError(error: Error, componentName: string): void {
  logClientError({
    message: `Error en componente ${componentName}: ${error.message}`,
    severity: "medium",
    context: { componentName },
    stack: error.stack,
  })
}
