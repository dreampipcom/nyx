/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["next-auth"],
  async redirects() {
    return [
      {
        source: "/signin",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
