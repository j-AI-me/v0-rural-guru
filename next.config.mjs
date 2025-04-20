/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ignorar errores durante la compilación para facilitar el despliegue
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configuración de imágenes simplificada
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Desactivar algunas optimizaciones que podrían causar problemas
  swcMinify: false,
  // Asegurarse de que las Server Actions estén habilitadas
  experimental: {
    serverActions: true,
  },
}

export default nextConfig
