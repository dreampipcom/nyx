/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["next-auth"],
  async redirects() {
    return [
      {
        source: "/signin",
        destination: "/api/auth/signin",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
