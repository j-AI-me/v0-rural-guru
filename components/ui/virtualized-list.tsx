"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useMemoizedCallback } from "@/hooks/use-memoized"

interface VirtualizedListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  itemHeight: number
  className?: string
  overscan?: number
  onEndReached?: () => void
  endReachedThreshold?: number
}

export function VirtualizedList<T>({
  items,
  renderItem,
  itemHeight,
  className = "",
  overscan = 5,
  onEndReached,
  endReachedThreshold = 200,
}: VirtualizedListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 })
  const [totalHeight, setTotalHeight] = useState(0)
  const lastScrollTop = useRef(0)
  const hasCalledEndReached = useRef(false)

  // Calcular el rango visible basado en el scroll
  const calculateVisibleRange = useMemoizedCallback(() => {
    if (!containerRef.current) return

    const { scrollTop, clientHeight } = containerRef.current
    const scrollDirection = scrollTop > lastScrollTop.current ? "down" : "up"
    lastScrollTop.current = scrollTop

    // Calcular el rango visible
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const end = Math.min(items.length, Math.ceil((scrollTop + clientHeight) / itemHeight) + overscan)

    setVisibleRange({ start, end })

    // Verificar si hemos llegado al final de la lista
    if (
      onEndReached &&
      scrollDirection === "down" &&
      scrollTop + clientHeight + endReachedThreshold >= containerRef.current.scrollHeight &&
      !hasCalledEndReached.current
    ) {
      hasCalledEndReached.current = true
      onEndReached()
    } else if (scrollDirection === "up") {
      hasCalledEndReached.current = false
    }
  }, [itemHeight, items.length, overscan, onEndReached, endReachedThreshold])

  // Actualizar el rango visible cuando cambian los items o el tamaño de la ventana
  useEffect(() => {
    setTotalHeight(items.length * itemHeight)
    calculateVisibleRange()
  }, [items.length, itemHeight, calculateVisibleRange])

  // Agregar event listener para el scroll
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      window.requestAnimationFrame(calculateVisibleRange)
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [calculateVisibleRange])

  // Renderizar solo los elementos visibles
  const visibleItems = items.slice(visibleRange.start, visibleRange.end)

  return (
    <div ref={containerRef} className={`overflow-auto relative ${className}`} style={{ height: "100%" }}>
      <div style={{ height: totalHeight, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: visibleRange.start * itemHeight,
            width: "100%",
          }}
        >
          {visibleItems.map((item, index) => (
            <div key={visibleRange.start + index} style={{ height: itemHeight }}>
              {renderItem(item, visibleRange.start + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
