const { LOCALES } = require("./lib/cjs-constants")

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

const config = {
    async headers() {
        return [
            {
                source: '/',
                headers: [
                  {
                    key: 'X-Dream-Vibe',
                    value: '...Pip!',
                  },
                ],
            },
            {
                source: '/:path',
                headers: [
                  {
                    key: 'X-Dream-Vibe',
                    value: '...Pip!',
                  },
                ],
            },
            {
                source: '/api/nexus/audio',
                headers: [
                  {
                    key: 'Referrer-Policy',
                    value: 'unsafe-url',
                  },
                ],
            },
            {
                source: '/api/nexus/audio/:path',
                headers: [
                  {
                    key: 'Referrer-Policy',
                    value: 'unsafe-url',
                  },
                ],
            },
        ]
    },
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
                source: '/subscribe',
                destination: 'https://dreampip.sumupstore.com/',
                permanent: false                
            },
            {
                source: '/members/notion',
                destination: 'https://www.notion.so/angeloreale/3ce9a1caba1e4f928b88ada939c73d02?pvs=4',
                permanent: false              
            },
            {
                source: '/members/calendar',
                destination: 'http://calendar.workspace.dreampip.com',
                permanent: false                
            },
            {
                source: '/members/chat',
                destination: 'https://dreampip.slack.com',
                permanent: false                
            },
            {
                source: '/members/mail',
                destination: 'http://mail.workspace.dreampip.com',
                permanent: false                
            },
            {
                source: '/members/storage',
                destination: 'http://storage.workspace.dreampip.com',
                permanent: false                
            },
            {
                source: '/home',
                destination: '/',
                permanent: true,
            },
            {
                source: '/chat',
                destination: '/subscribe',
                permanent: true,
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
                source: '/subscribe',
                destination: 'http://store.dreampip.com/',                
            },
            {
                source: '/members/calendar',
                destination: 'https://chat.workspace.dreampip.com',                
            },
            {
                source: '/members/chat',
                destination: 'https://chat.workspace.dreampip.com',                
            },
            {
                source: '/members/mail',
                destination: 'https://mail.workspace.dreampip.com',                
            },
            {
                source: '/members/storage',
                destination: 'https://storage.workspace.dreampip.com',                
            },
            {
                source: '/api/nexus/audio/0',
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
                destination: 'https://radio.media.infra.dreampip.com/3',
            },
            {
                source: '/api/nexus/audio/5',
                destination: 'https://radio.media.infra.dreampip.com/4',
            },
            {
                source: '/api/nexus/audio/6',
                destination: 'https://radio.media.infra.dreampip.com/5',
            },
            {
                source: '/api/nexus/audio/7',
                destination: 'https://radio.media.infra.dreampip.com/6',
            },
            {
                source: '/api/nexus/audio/8',
                destination: 'https://radio.media.infra.dreampip.com/7',
            },
            {
                source: '/api/nexus/audio/9',
                destination: 'https://radio.media.infra.dreampip.com/8',
            },
            {
                source: '/api/nexus/audio/10',
                destination: 'https://radio.media.infra.dreampip.com/9',
            },
            {
                source: '/api/nexus/audio/11',
                destination: 'https://radio.media.infra.dreampip.com/10',
            },
            {
                source: '/api/nexus/audio/12',
                destination: 'https://radio.media.infra.dreampip.com/12',
            },
            {
                source: '/api/nexus/audio/13',
                destination: 'https://radio.media.infra.dreampip.com/12',
            },
            {
                source: '/api/nexus/audio/14',
                destination: 'https://radio.media.infra.dreampip.com/13',
            },
            {
                source: '/api/nexus/audio/15',
                destination: 'https://radio.media.infra.dreampip.com/14',
            },
            {
                source: '/api/nexus/audio/16',
                destination: 'https://radio.media.infra.dreampip.com/15',
            },
            {
                source: '/api/nexus/audio/17',
                destination: 'https://radio.media.infra.dreampip.com/16',
            },
        ]
    }
}

module.exports = withBundleAnalyzer(config)