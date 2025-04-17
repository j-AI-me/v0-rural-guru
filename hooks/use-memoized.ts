"use client"

import { useMemo, useCallback, type DependencyList } from "react"

/**
 * Hook personalizado para memoizar valores
 */
export function useMemoizedValue<T>(factory: () => T, deps: DependencyList): T {
  return useMemo(factory, deps)
}

/**
 * Hook personalizado para memoizar funciones
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(callback: T, deps: DependencyList): T {
  return useCallback(callback, deps)
}

/**
 * Hook para filtrar propiedades con memoización
 */
export function useFilteredProperties(properties: any[], filters: any) {
  return useMemo(() => {
    if (!properties || properties.length === 0) return []

    return properties.filter((property) => {
      // Filtro por ubicación
      if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false
      }

      // Filtro por precio mínimo
      if (filters.minPrice && property.price < filters.minPrice) {
        return false
      }

      // Filtro por precio máximo
      if (filters.maxPrice && property.price > filters.maxPrice) {
        return false
      }

      // Filtro por número de huéspedes
      if (filters.guests && property.max_guests < filters.guests) {
        return false
      }

      return true
    })
  }, [properties, filters.location, filters.minPrice, filters.maxPrice, filters.guests])
}
