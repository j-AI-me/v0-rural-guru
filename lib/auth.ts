"use server"

// Archivo simplificado para evitar errores de compilación
export async function getSession() {
  return null
}

export async function requireAuth(redirectTo = "/auth/login") {
  return null
}

export async function requireGuest(redirectTo = "/dashboard") {
  return null
}

export async function getCurrentUserProfile() {
  return null
}
