/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración básica y estable
  reactStrictMode: true,
  
  // Configuración de imágenes
  images: {
    domains: ["localhost", "v0.blob.com"],
    formats: ["image/avif", "image/webp"],
  },
  
  // Ignorar errores durante la compilación
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
