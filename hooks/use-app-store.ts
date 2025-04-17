"use client"

import { useAppStore } from "@/lib/store"

// Hook para acceder al usuario
export function useUser() {
  const user = useAppStore((state) => state.user)
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)
  const setUser = useAppStore((state) => state.setUser)

  return { user, isAuthenticated, setUser }
}

// Hook para acceder a los filtros de búsqueda
export function useSearchFilters() {
  const filters = useAppStore((state) => state.searchFilters)
  const setFilters = useAppStore((state) => state.setSearchFilters)
  const clearFilters = useAppStore((state) => state.clearSearchFilters)

  return { filters, setFilters, clearFilters }
}

// Hook para acceder a favoritos
export function useFavorites() {
  const favorites = useAppStore((state) => state.favorites)
  const toggleFavorite = useAppStore((state) => state.toggleFavorite)

  const isFavorite = (propertyId: string) => favorites.includes(propertyId)

  return { favorites, toggleFavorite, isFavorite }
}

// Hook para acceder a propiedades vistas recientemente
export function useRecentlyViewed() {
  const recentlyViewed = useAppStore((state) => state.recentlyViewed)
  const addRecentlyViewed = useAppStore((state) => state.addRecentlyViewed)

  return { recentlyViewed, addRecentlyViewed }
}
