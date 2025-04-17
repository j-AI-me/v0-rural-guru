"use client"

import { useEffect } from "react"

interface PropertyStructuredDataProps {
  property: {
    id: string
    name: string
    description: string
    image: string[]
    pricePerNight: number
    maxGuests: number
    bedrooms: number
    bathrooms: number
    location: string
    rating?: number
    reviewCount?: number
  }
}

export function PropertyStructuredData({ property }: PropertyStructuredDataProps) {
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.id = `structured-data-property-${property.id}`

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      name: property.name,
      description: property.description,
      image: property.image,
      address: {
        "@type": "PostalAddress",
        addressLocality: property.location,
        addressRegion: "Asturias",
        addressCountry: "ES",
      },
      priceRange: `€${property.pricePerNight} per night`,
      numberOfRooms: property.bedrooms,
      amenityFeature: [
        {
          "@type": "LocationFeatureSpecification",
          name: "Bathrooms",
          value: property.bathrooms,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Maximum guests",
          value: property.maxGuests,
        },
      ],
    }

    // Añadir datos de reseñas si están disponibles
    if (property.rating && property.reviewCount) {
      Object.assign(structuredData, {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: property.rating,
          reviewCount: property.reviewCount,
        },
      })
    }

    script.innerHTML = JSON.stringify(structuredData)
    document.head.appendChild(script)

    return () => {
      const existingScript = document.getElementById(`structured-data-property-${property.id}`)
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [property])

  return null
}
