/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilitar optimizaciones de compilación
  swcMinify: true,

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Configuración de imágenes optimizadas
  images: {
    domains: ["localhost", "v0.blob.com"],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Desactivar unoptimized para asegurar que todas las imágenes pasen por la optimización
    unoptimized: false,
  },

  // Optimización de compilación
  compiler: {
    // Eliminar console.log en producción
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
    // Optimización de React
    reactRemoveProperties: process.env.NODE_ENV === "production",
  },

  // Optimización de módulos
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{kebabCase member}}",
    },
  },

  // Configuración experimental
  experimental: {
    // Optimización de fuentes
    optimizeFonts: true,
    // Optimización de imágenes
    optimizeImages: true,
    // Optimización de CSS
    optimizeCss: true,
    // Mejorar la experiencia de desarrollo
    turbo: {
      loaders: {
        ".svg": ["@svgr/webpack"],
      },
    },
    // Habilitar ISR para mejor rendimiento y SEO
    isrMemoryCacheSize: 50,
    // Optimización de carga de módulos
    serverActions: true,
  },

  // Configuración de webpack
  webpack: (config, { dev, isServer }) => {
    // Optimizaciones solo para producción
    if (!dev) {
      // Optimización de CSS
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        styles: {
          name: "styles",
          test: /\.(css|scss)$/,
          chunks: "all",
          enforce: true,
        },
      }

      // Optimización de imágenes
      config.module.rules.push({
        test: /\.(jpe?g|png|webp|avif)$/i,
        use: [
          {
            loader: "responsive-loader",
            options: {
              adapter: require("responsive-loader/sharp"),
              quality: 80,
              placeholder: true,
              placeholderSize: 40,
              progressive: true,
            },
          },
        ],
      })

      // Comprimir SVGs
      config.module.rules.push({
        test: /\.svg$/,
        use: ["svgo-loader"],
      })
    }

    return config
  },

  // Configuración de rutas con ISR
  async rewrites() {
    return [
      // Ejemplo de reescritura para SEO
      {
        source: "/alojamientos/:path*",
        destination: "/propiedades/:path*",
      },
    ]
  },

  // Redirecciones para SEO
  async redirects() {
    return [
      {
        source: "/old-path/:slug",
        destination: "/new-path/:slug",
        permanent: true, // 308 status code (permanent redirect)
      },
    ]
  },

  // Headers para seguridad y SEO
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
