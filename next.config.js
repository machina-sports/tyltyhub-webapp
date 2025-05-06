/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use export mode in production
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'geniusbetaistorage.blob.core.windows.net',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: '*.machina.gg',
        pathname: '/**'
      }
    ]
  },
  typescript: {
    ignoreBuildErrors: true
  },
  env: {
    MACHINA_API_KEY: process.env.MACHINA_API_KEY,
    MACHINA_CLIENT_URL: process.env.MACHINA_CLIENT_URL,
    IMAGE_CONTAINER_URL: process.env.IMAGE_CONTAINER_URL,
  }
};

module.exports = nextConfig;
