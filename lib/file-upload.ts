import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

// Tipos de archivos permitidos
const ALLOWED_FILE_TYPES = {
  images: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  documents: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  all: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
}

// Límites de tamaño (en bytes)
const SIZE_LIMITS = {
  images: 5 * 1024 * 1024, // 5MB
  documents: 10 * 1024 * 1024, // 10MB
  all: 10 * 1024 * 1024, // 10MB
}

// Función para validar un archivo
export function validateFile(
  file: File,
  type: "images" | "documents" | "all" = "all",
): { valid: boolean; error?: string } {
  // Verificar tipo de archivo
  if (!ALLOWED_FILE_TYPES[type].includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de archivo no permitido. Tipos permitidos: ${ALLOWED_FILE_TYPES[type].join(", ")}`,
    }
  }

  // Verificar tamaño
  if (file.size > SIZE_LIMITS[type]) {
    return {
      valid: false,
      error: `El archivo es demasiado grande. Tamaño máximo: ${SIZE_LIMITS[type] / (1024 * 1024)}MB`,
    }
  }

  return { valid: true }
}

// Función para subir un archivo a Vercel Blob
export async function uploadFile(
  file: File,
  folder = "uploads",
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Generar nombre único para el archivo
    const fileName = `${folder}/${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`

    // Subir archivo a Vercel Blob
    const blob = await put(fileName, file, {
      access: "public",
      addRandomSuffix: false,
    })

    return { success: true, url: blob.url }
  } catch (error: any) {
    console.error("Error al subir archivo:", error)
    return { success: false, error: error.message || "Error al subir archivo" }
  }
}

// Middleware para manejar subida de archivos
export async function handleFileUpload(
  req: NextRequest,
  type: "images" | "documents" | "all" = "all",
  folder = "uploads",
) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 })
    }

    // Validar archivo
    const validation = validateFile(file, type)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // Subir archivo
    const result = await uploadFile(file, folder)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ url: result.url })
  } catch (error: any) {
    console.error("Error en handleFileUpload:", error)
    return NextResponse.json({ error: "Error al procesar la subida de archivos" }, { status: 500 })
  }
}
