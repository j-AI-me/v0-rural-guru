import Image from "next/image"
import { cn } from "@/lib/utils"

interface AccessibleImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  loading?: "eager" | "lazy"
  sizes?: string
  quality?: number
  longDescription?: string
}

export function AccessibleImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false,
  loading,
  sizes,
  quality,
  longDescription,
}: AccessibleImageProps) {
  return (
    <figure className={cn("relative", fill && "w-full h-full")}>
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        fill={fill}
        className={className}
        priority={priority}
        loading={loading}
        sizes={sizes}
        quality={quality}
        aria-describedby={longDescription ? `desc-${alt.replace(/\s+/g, "-").toLowerCase()}` : undefined}
      />
      {longDescription && (
        <figcaption id={`desc-${alt.replace(/\s+/g, "-").toLowerCase()}`} className="sr-only">
          {longDescription}
        </figcaption>
      )}
    </figure>
  )
}
