// Tipos de almacenamiento
type StorageType = "session" | "local"

// Datos que se pueden almacenar de forma segura en el navegador
interface SafeStorageData {
  theme?: "light" | "dark"
  language?: string
  lastSearch?: {
    location?: string
    dates?: {
      from?: string
      to?: string
    }
    guests?: number
  }
  recentlyViewed?: string[] // Solo IDs de propiedades
  favorites?: string[] // Solo IDs de propiedades
  uiPreferences?: {
    showMap?: boolean
    listView?: "grid" | "list"
    sortBy?: "price" | "rating" | "date"
  }
}

// Lista de claves permitidas para almacenamiento
const ALLOWED_STORAGE_KEYS: (keyof SafeStorageData)[] = [
  "theme",
  "language",
  "lastSearch",
  "recentlyViewed",
  "favorites",
  "uiPreferences",
]

// Servicio de almacenamiento seguro
export const safeStorage = {
  // Obtener un valor
  get: <K extends keyof SafeStorageData>(key: K, type: StorageType = "local"): SafeStorageData[K] | null => {
    if (typeof window === "undefined") return null
    if (!ALLOWED_STORAGE_KEYS.includes(key)) {
      console.error(`Clave de almacenamiento no permitida: ${key}`)
      return null
    }

    const storage = type === "local" ? localStorage : sessionStorage
    const value = storage.getItem(`ruralguru:${key}`)

    if (!value) return null

    try {
      return JSON.parse(value)
    } catch (error) {
      console.error(`Error al parsear valor para ${key}:`, error)
      return null
    }
  },

  // Guardar un valor
  set: <K extends keyof SafeStorageData>(key: K, value: SafeStorageData[K], type: StorageType = "local"): boolean => {
    if (typeof window === "undefined") return false
    if (!ALLOWED_STORAGE_KEYS.includes(key)) {
      console.error(`Clave de almacenamiento no permitida: ${key}`)
      return false
    }

    try {
      const storage = type === "local" ? localStorage : sessionStorage
      storage.setItem(`ruralguru:${key}`, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error al guardar valor para ${key}:`, error)
      return false
    }
  },

  // Eliminar un valor
  remove: (key: keyof SafeStorageData, type: StorageType = "local"): boolean => {
    if (typeof window === "undefined") return false
    if (!ALLOWED_STORAGE_KEYS.includes(key)) {
      console.error(`Clave de almacenamiento no permitida: ${key}`)
      return false
    }

    try {
      const storage = type === "local" ? localStorage : sessionStorage
      storage.removeItem(`ruralguru:${key}`)
      return true
    } catch (error) {
      console.error(`Error al eliminar valor para ${key}:`, error)
      return false
    }
  },

  // Limpiar todo el almacenamiento
  clear: (type: StorageType = "local"): boolean => {
    if (typeof window === "undefined") return false

    try {
      const storage = type === "local" ? localStorage : sessionStorage

      // Solo eliminar claves que pertenecen a nuestra aplicación
      ALLOWED_STORAGE_KEYS.forEach((key) => {
        storage.removeItem(`ruralguru:${key}`)
      })

      return true
    } catch (error) {
      console.error("Error al limpiar almacenamiento:", error)
      return false
    }
  },
}
