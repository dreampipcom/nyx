/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["next-auth"],
  async redirects() {
    return [
      // {
      //   source: "/",
      //   destination: "/",
      //   permanent: true,
      // },
    ];
  },
};

module.exports = nextConfig;
