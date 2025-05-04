/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilitar optimizaciones de compilación
  swcMinify: true,

  // Ignorar errores de ESLint y TypeScript durante la compilación
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
    // Habilitar ISR para mejor rendimiento y SEO
    isrMemoryCacheSize: 50,
    // Optimización de imágenes
    optimizeImages: true,
    // Optimización de CSS
    optimizeCss: true,
  },

  // Configuración de generación estática incremental (ISR)
  // Esto permite regenerar páginas en segundo plano
  async generateStaticParams() {
    // Aquí puedes definir rutas para pre-renderizar
    return [];
  },

  // Configuración de rutas con ISR
  async rewrites() {
    return [
      // Ejemplo de reescritura para SEO
      {
        source: '/alojamientos/:path*',
        destination: '/propiedades/:path*',
      },
    ];
  },

  // Redirecciones para SEO
  async redirects() {
    return [
      {
        source: '/old-path/:slug',
        destination: '/new-path/:slug',
        permanent: true, // 308 status code (permanent redirect)
      },
    ];
  },

  // Headers para seguridad y SEO
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
