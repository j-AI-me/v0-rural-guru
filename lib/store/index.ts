import { create } from "zustand"
import { persist } from "zustand/middleware"

// Tipos
interface User {
  id: string
  email: string
  full_name?: string
  role: "admin" | "host" | "guest"
}

interface SearchFilters {
  location?: string
  checkIn?: string
  checkOut?: string
  guests?: number
  minPrice?: number
  maxPrice?: number
}

interface AppState {
  user: User | null
  isAuthenticated: boolean
  searchFilters: SearchFilters
  recentlyViewed: string[]
  favorites: string[]

  // Acciones
  setUser: (user: User | null) => void
  setSearchFilters: (filters: Partial<SearchFilters>) => void
  addRecentlyViewed: (propertyId: string) => void
  toggleFavorite: (propertyId: string) => void
  clearSearchFilters: () => void
}

// Crear store
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      searchFilters: {},
      recentlyViewed: [],
      favorites: [],

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setSearchFilters: (filters) =>
        set((state) => ({
          searchFilters: { ...state.searchFilters, ...filters },
        })),

      clearSearchFilters: () => set({ searchFilters: {} }),

      addRecentlyViewed: (propertyId) =>
        set((state) => {
          // Eliminar si ya existe para moverlo al principio
          const filtered = state.recentlyViewed.filter((id) => id !== propertyId)
          // Añadir al principio y limitar a 10 elementos
          return {
            recentlyViewed: [propertyId, ...filtered].slice(0, 10),
          }
        }),

      toggleFavorite: (propertyId) =>
        set((state) => {
          const isFavorite = state.favorites.includes(propertyId)
          return {
            favorites: isFavorite
              ? state.favorites.filter((id) => id !== propertyId)
              : [...state.favorites, propertyId],
          }
        }),
    }),
    {
      name: "rural-guru-storage",
      partialize: (state) => ({
        searchFilters: state.searchFilters,
        recentlyViewed: state.recentlyViewed,
        favorites: state.favorites,
      }),
    },
  ),
)
