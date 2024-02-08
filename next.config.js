/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXUS_BASE_PATH,
  transpilePackages: ['next-auth'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rickandmortyapi.com',
      },
    ],
  },
  async redirects() {
    return [];
  },
};

module.exports = nextConfig;
