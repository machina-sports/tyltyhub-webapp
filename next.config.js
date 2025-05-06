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
    MACHINA_API_KEY: "tzDkqVqXvPSBX_UFFY5UzJYc4CEwFmhHqkz8qfW5uaXw1fCWQA-p05i4jWsJFCROnyzoLxxY1x0Ur8XACa9VhQ",
    MACHINA_CLIENT_URL: "https://entain-organization-sportingbet-blog-trainin.org.machina.gg",
    IMAGE_CONTAINER_ADDRESS: "https://geniusbetaistorage.blob.core.windows.net/gb-blob-images"
  }
};

module.exports = nextConfig;
