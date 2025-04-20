/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración básica
  reactStrictMode: true,
  
  // Desactivar completamente la optimización de imágenes
  images: {
    unoptimized: true,
    domains: ['*'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Ignorar todos los errores durante la compilación
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Desactivar la minificación para depurar mejor
  swcMinify: false,
  
  // Configuración avanzada de webpack
  webpack: (config, { isServer }) => {
    // Evitar problemas con módulos específicos
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
    };
    
    // Ignorar advertencias específicas
    config.ignoreWarnings = [
      { module: /node_modules/ },
    ];
    
    // Reducir el tamaño del paquete
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return `npm.${packageName.replace('@', '')}`;
            },
          },
        },
      };
    }
    
    return config;
  },
  
  // Configuración de salida
  output: 'standalone',
  
  // Desactivar la generación de fuentes de mapas
  productionBrowserSourceMaps: false,
}

export default nextConfig
