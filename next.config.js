/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["next-auth"],
  async redirects() {
    return [
      {
        source: "/",
        destination: "/api/auth/signin",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
