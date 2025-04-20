"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Grid3X3, X } from "lucide-react"

interface GalleryImage {
  src: string
  alt: string
}

interface PropertyGalleryProps {
  images: GalleryImage[]
}

export function PropertyGallery({ images }: PropertyGalleryProps) {
  const [showAllPhotos, setShowAllPhotos] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  const handlePrevious = () => {
    setCurrentPhotoIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentPhotoIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-xl overflow-hidden h-[400px] md:h-[500px]">
          <div className="md:col-span-2 md:row-span-2 relative">
            <Image
              src={images[0].src || "/placeholder.svg"}
              alt={images[0].alt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority
            />
          </div>
          {images.slice(1, 5).map((image, index) => (
            <div key={index} className="hidden md:block relative">
              <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" sizes="25vw" />
            </div>
          ))}
        </div>
        <Button variant="secondary" className="absolute bottom-4 right-4 gap-2" onClick={() => setShowAllPhotos(true)}>
          <Grid3X3 className="h-4 w-4" />
          Ver todas las fotos
        </Button>
      </div>

      <Dialog open={showAllPhotos} onOpenChange={setShowAllPhotos}>
        <DialogContent className="max-w-7xl w-full p-0 h-[90vh] flex flex-col">
          <div className="p-4 flex items-center justify-between border-b">
            <h2 className="font-semibold">Galería de fotos</h2>
            <Button variant="ghost" size="icon" onClick={() => setShowAllPhotos(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            <div className="flex-1 relative flex items-center justify-center p-4">
              <div className="relative w-full h-full">
                <Image
                  src={images[currentPhotoIndex].src || "/placeholder.svg"}
                  alt={images[currentPhotoIndex].alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-8 top-1/2 transform -translate-y-1/2 rounded-full"
                onClick={handlePrevious}
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-8 top-1/2 transform -translate-y-1/2 rounded-full"
                onClick={handleNext}
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="w-full md:w-64 p-4 border-t md:border-t-0 md:border-l overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative aspect-square cursor-pointer rounded-md overflow-hidden ${
                      currentPhotoIndex === index ? "ring-2 ring-black" : ""
                    }`}
                    onClick={() => setCurrentPhotoIndex(index)}
                  >
                    <Image
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 64px"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
