"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Search } from "lucide-react"
import { PaginatedList } from "@/components/ui/paginated-list"
import { useMemoizedCallback, useMemoized } from "@/hooks/use-memoized"

type SortDirection = "asc" | "desc" | null

interface Column<T> {
  key: string
  header: React.ReactNode
  cell: (item: T) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  pageSize?: number
  className?: string
  searchPlaceholder?: string
  loading?: boolean
  renderLoading?: () => React.ReactNode
  renderEmpty?: () => React.ReactNode
  initialSortColumn?: string
  initialSortDirection?: SortDirection
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 10,
  className = "",
  searchPlaceholder = "Buscar...",
  loading = false,
  renderLoading,
  renderEmpty,
  initialSortColumn,
  initialSortDirection = null,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(initialSortColumn || null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredData, setFilteredData] = useState<T[]>(data)

  // Actualizar los datos filtrados cuando cambian los datos originales
  useEffect(() => {
    setFilteredData(data)
  }, [data])

  // Memoizar la función de búsqueda
  const handleSearch = useMemoizedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const term = e.target.value.toLowerCase()
      setSearchTerm(term)

      if (!term) {
        setFilteredData(data)
        return
      }

      // Filtrar los datos por todas las columnas filtrables
      const filtered = data.filter((item) => {
        return columns.some((column) => {
          if (!column.filterable) return false

          const value = item[column.key]
          if (value === null || value === undefined) return false

          return String(value).toLowerCase().includes(term)
        })
      })

      setFilteredData(filtered)
    },
    [data, columns],
  )

  // Memoizar la función de ordenación
  const handleSort = useMemoizedCallback(
    (columnKey: string) => {
      // Si es la misma columna, cambiar la dirección
      if (sortColumn === columnKey) {
        setSortDirection((prev) => {
          if (prev === "asc") return "desc"
          if (prev === "desc") return null
          return "asc"
        })
      } else {
        // Si es una columna diferente, ordenar ascendente
        setSortColumn(columnKey)
        setSortDirection("asc")
      }
    },
    [sortColumn],
  )

  // Memoizar los datos ordenados
  const sortedData = useMemoized(() => {
    if (!sortColumn || !sortDirection) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]

      // Manejar valores nulos o indefinidos
      if (aValue === null || aValue === undefined) return sortDirection === "asc" ? -1 : 1
      if (bValue === null || bValue === undefined) return sortDirection === "asc" ? 1 : -1

      // Comparar según el tipo de dato
      if (typeof aValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      // Comparación numérica por defecto
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    })
  }, [filteredData, sortColumn, sortDirection])

  // Renderizar un elemento de la lista paginada
  const renderTableRow = useMemoizedCallback(
    (item: T) => {
      return (
        <TableRow>
          {columns.map((column) => (
            <TableCell key={column.key}>{column.cell(item)}</TableCell>
          ))}
        </TableRow>
      )
    },
    [columns],
  )

  // Renderizar el componente de carga
  const renderLoadingComponent = useMemoizedCallback(() => {
    if (renderLoading) return renderLoading()

    return (
      <div className="w-full py-10 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-4 text-gray-500">Cargando...</p>
      </div>
    )
  }, [renderLoading])

  // Renderizar el componente vacío
  const renderEmptyComponent = useMemoizedCallback(() => {
    if (renderEmpty) return renderEmpty()

    return (
      <div className="w-full py-10 text-center">
        <p className="text-gray-500">No hay datos disponibles</p>
      </div>
    )
  }, [renderEmpty])

  return (
    <div className={className}>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearch}
            className="pl-8 w-full max-w-sm"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 h-8 data-[state=open]:bg-accent"
                      onClick={() => handleSort(column.key)}
                    >
                      {column.header}
                      {sortColumn === column.key && (
                        <span className="ml-2">
                          {sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : sortDirection === "desc" ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : null}
                        </span>
                      )}
                    </Button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {renderLoadingComponent()}
                </TableCell>
              </TableRow>
            ) : sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {renderEmptyComponent()}
                </TableCell>
              </TableRow>
            ) : (
              <PaginatedList
                items={sortedData}
                renderItem={renderTableRow}
                pageSize={pageSize}
                showPageNumbers={true}
              />
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
