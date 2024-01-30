import { GenerateSitemap } from '../../../lib/sitemapGenerator'

const locale = 'ro'

export const getServerSideProps = async (ctx) => {
    return GenerateSitemap(locale, ctx)
}

// Default export to prevent next.js errors
export default function Sitemap() { }