"use client"

import Head from "next/head"
import { usePathname } from "next/navigation"

interface MetaTagsProps {
  title?: string
  description?: string
  canonicalUrl?: string
  ogImage?: string
  ogType?: "website" | "article"
  twitterCard?: "summary" | "summary_large_image"
}

export default function MetaTags({
  title = "RuralGuru - Alojamientos rurales en Asturias",
  description = "Encuentra el alojamiento rural perfecto para tus vacaciones en Asturias",
  canonicalUrl,
  ogImage = "/og-image.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
}: MetaTagsProps) {
  const pathname = usePathname()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ruralguru.com"
  const fullUrl = canonicalUrl || `${baseUrl}${pathname}`
  const fullImageUrl = ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`

  return (
    <Head>
      {/* Metadatos básicos */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="RuralGuru" />
      <meta property="og:locale" content="es_ES" />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Metadatos adicionales */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
    </Head>
  )
}
