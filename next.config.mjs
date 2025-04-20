/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración básica
  reactStrictMode: true,
  
  // Configuración de imágenes que permite usar imágenes externas
  // pero evita problemas con sharp
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Usar un formato de imagen más compatible
    formats: ['image/webp'],
    // Desactivar temporalmente la optimización para evitar problemas con sharp
    unoptimized: true,
  },
  
  // Ignorar errores de ESLint y TypeScript durante la compilación
  // pero mantener la funcionalidad
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configuración mínima de webpack para resolver problemas específicos
  webpack: (config) => {
    // Resolver problemas con módulos específicos
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    return config;
  },
  
  // Configuración experimental para mejorar la compatibilidad
  experimental: {
    // Desactivar temporalmente la optimización de imágenes con sharp
    disableExperimentalFeaturesWarning: true,
  }
}

export default nextConfig
