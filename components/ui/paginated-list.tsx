"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useMemoizedCallback, useMemoized } from "@/hooks/use-memoized"

interface PaginatedListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  pageSize?: number
  className?: string
  itemClassName?: string
  showPageNumbers?: boolean
  maxPageNumbers?: number
  loading?: boolean
  renderLoading?: () => React.ReactNode
  renderEmpty?: () => React.ReactNode
}

export function PaginatedList<T>({
  items,
  renderItem,
  pageSize = 10,
  className = "",
  itemClassName = "",
  showPageNumbers = true,
  maxPageNumbers = 5,
  loading = false,
  renderLoading,
  renderEmpty,
}: PaginatedListProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)

  // Calcular el número total de páginas
  const totalPages = useMemoized(() => Math.ceil(items.length / pageSize), [items.length, pageSize])

  // Asegurarse de que la página actual es válida
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  // Calcular los elementos a mostrar en la página actual
  const currentItems = useMemoized(() => {
    const startIndex = (currentPage - 1) * pageSize
    return items.slice(startIndex, startIndex + pageSize)
  }, [items, currentPage, pageSize])

  // Memoizar las funciones de navegación
  const goToPage = useMemoizedCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    },
    [totalPages],
  )

  const goToPreviousPage = useMemoizedCallback(() => {
    goToPage(currentPage - 1)
  }, [goToPage, currentPage])

  const goToNextPage = useMemoizedCallback(() => {
    goToPage(currentPage + 1)
  }, [goToPage, currentPage])

  // Calcular los números de página a mostrar
  const pageNumbers = useMemoized(() => {
    if (!showPageNumbers || totalPages <= 1) return []

    if (totalPages <= maxPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // Mostrar páginas alrededor de la página actual
    const halfMax = Math.floor(maxPageNumbers / 2)
    let startPage = Math.max(1, currentPage - halfMax)
    const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1)

    // Ajustar si estamos cerca del final
    if (endPage - startPage + 1 < maxPageNumbers) {
      startPage = Math.max(1, endPage - maxPageNumbers + 1)
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
  }, [showPageNumbers, totalPages, maxPageNumbers, currentPage])

  // Renderizar el componente
  if (loading && renderLoading) {
    return renderLoading()
  }

  if (items.length === 0 && renderEmpty) {
    return renderEmpty()
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {currentItems.map((item, index) => (
          <div key={index} className={itemClassName}>
            {renderItem(item, (currentPage - 1) * pageSize + index)}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {pageNumbers.map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => goToPage(page)}
              aria-label={`Página ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            aria-label="Página siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
