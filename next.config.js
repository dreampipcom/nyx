const { LOCALES } = require("./lib/cjs-constants")

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

const config = {
    modularizeImports: {
        'lodash': {
            transform: 'lodash/dist/{{member}}',
        },
    },
    productionBrowserSourceMaps: false,
    i18n: {
        locales: LOCALES,
        defaultLocale: "default",
        localeDetection: true,
    },
    images: {
        domains: ['images.contentful.com', 'images.ctfassets.net'],
        formats: ['image/webp'],
    },
    compiler: {
        styledComponents: true
    },
    async redirects() {
        return [
            {
                source: '/home',
                destination: '/',
                permanent: true,
            },
            {
                source: '/chat',
                destination: 'https://discord.gg/cuBsP8DeyU',
                permanent: false,
            },
            {
                source: '/event/purizu-presents-abrakadabra-with-alabastro-mapa-splinter-dakaza-reale',
                destination: '/event/purizu-presents-abrakadabra-with-mapa-splinter-reale',
                permanent: false,
            },
            {
                source: '/event/purizu-presents-abrakadabra-with-alabastro-mapa-splinter-reale',
                destination: '/event/purizu-presents-abrakadabra-with-mapa-splinter-reale',
                permanent: false,
            },
            {
                source: '/episode/re-flight-dubem-at-karuna-sessions-160-l-2022-10-25',
                destination: '/episode/re-flight-dubem-at-karuna-sessions-161-l-2022-10-25',
                permanent: true,
            },
        ]
    },
    async rewrites() {
        return [
            {"source": "/app", "destination": "https://alpha.dreampip.com/"},
            {"source": "/app/:match*", "destination": "https://alpha.dreampip.com/:match*"},
            {
                source: '/api/nexus/audio/0',
                destination: 'http://66.135.5.207:8002/main',
            },
            {
                source: '/api/nexus/audio/1',
                destination: 'https://radio.media.infra.dreampip.com/0',
            },
            {
                source: '/api/nexus/audio/1',
                destination: 'https://radio.media.infra.dreampip.com/1',
            },
            {
                source: '/api/nexus/audio/2',
                destination: 'https://radio.media.infra.dreampip.com/2',
            },
            {
                source: '/api/nexus/audio/4',
                destination: 'https://radio.media.infra.dreampip.com/2',
            },
            {
                source: '/api/nexus/audio/5',
                destination: 'https://radio.media.infra.dreampip.com/2',
            },
            {
                source: '/api/nexus/audio/6',
                destination: 'https://radio.media.infra.dreampip.com/2',
            },
            {
                source: '/api/nexus/audio/7',
                destination: 'https://radio.media.infra.dreampip.com/2',
            },
            {
                source: '/api/nexus/audio/8',
                destination: 'https://radio.media.infra.dreampip.com/2',
            },
            {
                source: '/api/nexus/audio/9',
                destination: 'https://radio.media.infra.dreampip.com/2',
            },
            {
                source: '/api/nexus/audio/10',
                destination: 'https://radio.media.infra.dreampip.com/2',
            },
            {
                source: '/api/nexus/audio/11',
                destination: 'https://radio.media.infra.dreampip.com/2',
            },
            {
                source: '/api/nexus/audio/12',
                destination: 'https://radio.media.infra.dreampip.com/2',
            },
            {
                source: '/api/nexus/audio/13',
                destination: 'https://radio.media.infra.dreampip.com/2',
            },
            {
                source: '/api/nexus/audio/14',
                destination: 'https://radio.media.infra.dreampip.com/2',
            },
            {
                source: '/api/nexus/audio/15',
                destination: 'https://radio.media.infra.dreampip.com/2',
            },
            {
                source: '/api/nexus/audio/16',
                destination: 'https://radio.media.infra.dreampip.com/2',
            },
            {
                source: '/api/nexus/audio/17',
                destination: 'https://radio.media.infra.dreampip.com/2',
            },
            {
                source: '/api/nexus/audio/3',
                destination: 'http://45.77.156.190:8002/main',
            },
        ]
    }
}

module.exports = withBundleAnalyzer(config)