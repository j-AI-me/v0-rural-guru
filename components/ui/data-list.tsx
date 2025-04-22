"use client"

import type React from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface DataListProps<T> {
  data: T[]
  isLoading: boolean
  emptyMessage: string
  emptyIcon?: React.ReactNode
  renderItem: (item: T, index: number) => React.ReactNode
  renderSkeleton?: () => React.ReactNode
  className?: string
  itemClassName?: string
}

export function DataList<T>({
  data,
  isLoading,
  emptyMessage,
  emptyIcon,
  renderItem,
  renderSkeleton,
  className = "",
  itemClassName = "",
}: DataListProps<T>) {
  if (isLoading) {
    if (renderSkeleton) {
      return renderSkeleton()
    }

    return (
      <div className={className}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`${itemClassName} space-y-2`}>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        {emptyIcon}
        <h3 className="text-lg font-medium text-gray-900 mt-2">{emptyMessage}</h3>
      </div>
    )
  }

  return (
    <div className={className}>
      {data.map((item, index) => (
        <div key={index} className={itemClassName}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  )
}
