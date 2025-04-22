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
    unoptimized: true,
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
            },
          },
        ],
      })
    }

    return config
  },
}

module.exports = nextConfig
