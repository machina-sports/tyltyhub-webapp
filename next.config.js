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
  }
};

module.exports = nextConfig;
