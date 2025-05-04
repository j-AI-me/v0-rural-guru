"use server"

// Función para registrar errores en el servidor
export async function logServerError(error: Error, context?: Record<string, any>) {
  console.error("Error en el servidor:", {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  })

  // Aquí podrías implementar tu propia lógica de registro
  // Por ejemplo, guardar en una tabla de Supabase, enviar por email, etc.
}

// Función para registrar errores del cliente
export async function logClientError(errorInfo: {
  message: string
  stack?: string
  componentStack?: string
  url?: string
  userId?: string
}) {
  console.error("Error en el cliente:", {
    ...errorInfo,
    timestamp: new Date().toISOString(),
  })

  // Aquí podrías implementar tu propia lógica de registro
}
