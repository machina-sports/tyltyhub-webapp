/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "machina.gg",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  env: {
    MACHINA_API_KEY: process.env.MACHINA_API_KEY,
    MACHINA_CLIENT_URL: process.env.MACHINA_CLIENT_URL,
    IMAGE_CONTAINER_URL: process.env.IMAGE_CONTAINER_URL,
    NEXT_PUBLIC_BRAND: process.env.NEXT_PUBLIC_BRAND,
  }
};

module.exports = nextConfig;
