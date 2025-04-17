// Este archivo contiene funciones para interactuar con APIs externas
// sin exponer credenciales en el frontend

// Función para obtener datos del clima
export async function getWeatherData(latitude: number, longitude: number) {
  try {
    // En lugar de llamar directamente a la API del clima desde el cliente,
    // hacemos la llamada a través de nuestro propio endpoint
    const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`)

    if (!response.ok) {
      throw new Error("Error al obtener datos del clima")
    }

    return await response.json()
  } catch (error) {
    console.error("Error en getWeatherData:", error)
    throw error
  }
}

// Función para obtener datos de mapas
export async function getMapData(location: string) {
  try {
    // Llamamos a nuestro propio endpoint en lugar de exponer la API key
    const response = await fetch(`/api/maps?location=${encodeURIComponent(location)}`)

    if (!response.ok) {
      throw new Error("Error al obtener datos de mapas")
    }

    return await response.json()
  } catch (error) {
    console.error("Error en getMapData:", error)
    throw error
  }
}

// Función para procesar pagos
export async function processPayment(paymentData: any) {
  try {
    const response = await fetch("/api/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Incluir token CSRF para protección
        "x-csrf-token":
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("ruralguru_csrf_token="))
            ?.split("=")[1] || "",
      },
      body: JSON.stringify(paymentData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Error al procesar el pago")
    }

    return await response.json()
  } catch (error) {
    console.error("Error en processPayment:", error)
    throw error
  }
}
