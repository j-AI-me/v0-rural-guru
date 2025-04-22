"use client"

import type React from "react"

import { useCallback, useMemo, useRef } from "react"

/**
 * Hook para memoizar un valor y evitar recálculos innecesarios
 * @param factory Función que genera el valor a memoizar
 * @param deps Dependencias que determinan cuándo recalcular el valor
 * @returns El valor memoizado
 */
export function useMemoized<T>(factory: () => T, deps: React.DependencyList): T {
  return useMemo(factory, deps)
}

/**
 * Hook para memoizar una función y evitar recreaciones innecesarias
 * @param callback Función a memoizar
 * @param deps Dependencias que determinan cuándo recrear la función
 * @returns La función memoizada
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(callback: T, deps: React.DependencyList): T {
  return useCallback(callback, deps)
}

/**
 * Hook para memoizar un valor que solo se calcula una vez
 * @param factory Función que genera el valor a memoizar
 * @returns El valor memoizado que solo se calcula una vez
 */
export function useConstant<T>(factory: () => T): T {
  const ref = useRef<{ value: T }>()

  if (ref.current === undefined) {
    ref.current = { value: factory() }
  }

  return ref.current.value
}

/**
 * Hook para comparar valores de manera profunda y evitar renderizados innecesarios
 * @param value Valor a comparar
 * @returns Valor memoizado que solo cambia cuando el contenido cambia
 */
export function useDeepCompareMemo<T>(value: T): T {
  const ref = useRef<T>(value)

  // Solo actualizar la referencia si el valor ha cambiado profundamente
  if (JSON.stringify(ref.current) !== JSON.stringify(value)) {
    ref.current = value
  }

  return ref.current
}
