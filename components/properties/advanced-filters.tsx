"use client"

import { useState } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { useSearchFilters } from "@/hooks/use-app-store"
import { useTranslation } from "react-i18next"

interface AdvancedFiltersProps {
  onApplyFilters?: () => void
}

export function AdvancedFilters({ onApplyFilters }: AdvancedFiltersProps) {
  const { t } = useTranslation("common")
  const { filters, setFilters, clearFilters } = useSearchFilters()
  const [isOpen, setIsOpen] = useState(false)

  // Estado local para los filtros
  const [localFilters, setLocalFilters] = useState({
    minPrice: filters.minPrice || 0,
    maxPrice: filters.maxPrice || 300,
    bedrooms: filters.bedrooms || 1,
    bathrooms: filters.bathrooms || 1,
    amenities: {
      wifi: false,
      parking: false,
      pool: false,
      petFriendly: false,
      fireplace: false,
      garden: false,
    },
  })

  const handleApplyFilters = () => {
    // Convertir amenidades seleccionadas a array
    const selectedAmenities = Object.entries(localFilters.amenities)
      .filter(([_, isSelected]) => isSelected)
      .map(([name]) => name)

    setFilters({
      ...filters,
      minPrice: localFilters.minPrice,
      maxPrice: localFilters.maxPrice,
      bedrooms: localFilters.bedrooms,
      bathrooms: localFilters.bathrooms,
      amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
    })

    setIsOpen(false)
    if (onApplyFilters) onApplyFilters()
  }

  const handleReset = () => {
    setLocalFilters({
      minPrice: 0,
      maxPrice: 300,
      bedrooms: 1,
      bathrooms: 1,
      amenities: {
        wifi: false,
        parking: false,
        pool: false,
        petFriendly: false,
        fireplace: false,
        garden: false,
      },
    })

    clearFilters()
    setIsOpen(false)
    if (onApplyFilters) onApplyFilters()
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          {t("properties.filters")}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t("properties.advancedFilters")}</SheetTitle>
          <SheetDescription>{t("properties.filtersDescription")}</SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Rango de precios */}
          <div className="space-y-4">
            <h3 className="font-medium">{t("properties.priceRange")}</h3>
            <div className="flex justify-between">
              <div className="w-[45%]">
                <Label htmlFor="min-price">{t("properties.minPrice")}</Label>
                <Input
                  id="min-price"
                  type="number"
                  min="0"
                  value={localFilters.minPrice}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      minPrice: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="w-[45%]">
                <Label htmlFor="max-price">{t("properties.maxPrice")}</Label>
                <Input
                  id="max-price"
                  type="number"
                  min="0"
                  value={localFilters.maxPrice}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      maxPrice: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <Slider
              value={[localFilters.minPrice, localFilters.maxPrice]}
              min={0}
              max={500}
              step={10}
              onValueChange={(value) =>
                setLocalFilters({
                  ...localFilters,
                  minPrice: value[0],
                  maxPrice: value[1],
                })
              }
            />
          </div>

          {/* Habitaciones y baños */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">{t("properties.bedrooms")}</Label>
              <Input
                id="bedrooms"
                type="number"
                min="1"
                value={localFilters.bedrooms}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    bedrooms: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">{t("properties.bathrooms")}</Label>
              <Input
                id="bathrooms"
                type="number"
                min="1"
                value={localFilters.bathrooms}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    bathrooms: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          {/* Amenidades */}
          <div className="space-y-4">
            <h3 className="font-medium">{t("properties.amenities")}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wifi"
                  checked={localFilters.amenities.wifi}
                  onCheckedChange={(checked) =>
                    setLocalFilters({
                      ...localFilters,
                      amenities: {
                        ...localFilters.amenities,
                        wifi: checked as boolean,
                      },
                    })
                  }
                />
                <Label htmlFor="wifi">WiFi</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="parking"
                  checked={localFilters.amenities.parking}
                  onCheckedChange={(checked) =>
                    setLocalFilters({
                      ...localFilters,
                      amenities: {
                        ...localFilters.amenities,
                        parking: checked as boolean,
                      },
                    })
                  }
                />
                <Label htmlFor="parking">{t("properties.amenities.parking")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pool"
                  checked={localFilters.amenities.pool}
                  onCheckedChange={(checked) =>
                    setLocalFilters({
                      ...localFilters,
                      amenities: {
                        ...localFilters.amenities,
                        pool: checked as boolean,
                      },
                    })
                  }
                />
                <Label htmlFor="pool">{t("properties.amenities.pool")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pet-friendly"
                  checked={localFilters.amenities.petFriendly}
                  onCheckedChange={(checked) =>
                    setLocalFilters({
                      ...localFilters,
                      amenities: {
                        ...localFilters.amenities,
                        petFriendly: checked as boolean,
                      },
                    })
                  }
                />
                <Label htmlFor="pet-friendly">{t("properties.amenities.petFriendly")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fireplace"
                  checked={localFilters.amenities.fireplace}
                  onCheckedChange={(checked) =>
                    setLocalFilters({
                      ...localFilters,
                      amenities: {
                        ...localFilters.amenities,
                        fireplace: checked as boolean,
                      },
                    })
                  }
                />
                <Label htmlFor="fireplace">{t("properties.amenities.fireplace")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="garden"
                  checked={localFilters.amenities.garden}
                  onCheckedChange={(checked) =>
                    setLocalFilters({
                      ...localFilters,
                      amenities: {
                        ...localFilters.amenities,
                        garden: checked as boolean,
                      },
                    })
                  }
                />
                <Label htmlFor="garden">{t("properties.amenities.garden")}</Label>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <X className="h-4 w-4" />
            {t("properties.resetFilters")}
          </Button>
          <Button onClick={handleApplyFilters}>{t("properties.applyFilters")}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
