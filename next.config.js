/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');
const nextConfig = {
  assetPrefix: process.env.NEXUS_HOST || 'https://nyx.dreampip.com',
  transpilePackages: ['next-auth'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rickandmortyapi.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [process.env.NEXUS_HOST, process.env.MAIN_URL, process.env.API_HOST],
    },
  },
  async redirects() {
    return [
      {
        source: '/dash/services/hypnos',
        destination: '/dash/services/hypnos/list',
        permanent: false,
      },
      {
        source: '/dash/services/rickmorty',
        destination: '/dash/services/rickmorty/list',
        permanent: false,
      },
      // {
      //   source: '/signin',
      //   destination: '/dash/signin',
      //   permanent: false,
      // },
    ];
  },
};

module.exports = nextConfig;

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: 'dreampip',
    project: 'nyx',
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    // tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  },
);
