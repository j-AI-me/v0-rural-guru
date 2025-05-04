// Sistema básico de manejo de errores

// Función para registrar errores en el cliente
export function logClientError(error: Error | { message: string }): void {
  console.error("Error del cliente:", error)
}

// Función para registrar errores en el servidor
export async function logServerError(error: Error | { message: string }): Promise<void> {
  console.error("Error del servidor:", error)
}
