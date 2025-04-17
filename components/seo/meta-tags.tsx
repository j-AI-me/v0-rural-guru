import Head from "next/head"

interface MetaTagsProps {
  title: string
  description: string
  canonical?: string
  image?: string
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
}

export function MetaTags({
  title,
  description,
  canonical,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
}: MetaTagsProps) {
  const siteTitle = `${title} | RuralGuru`
  const siteImage = image || "/og-image.jpg"

  return (
    <Head>
      {/* Metadatos básicos */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={siteImage} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:site_name" content="RuralGuru" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={siteImage} />

      {/* Artículo específico (si aplica) */}
      {type === "article" && publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {type === "article" && modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {type === "article" && author && <meta property="article:author" content={author} />}
      {type === "article" && section && <meta property="article:section" content={section} />}
      {type === "article" &&
        tags &&
        tags.length > 0 &&
        tags.map((tag, index) => <meta key={index} property="article:tag" content={tag} />)}
    </Head>
  )
}
