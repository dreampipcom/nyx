import { getServerSideSitemapLegacy } from "next-sitemap"
import { getAllPages, getEpisodes, getEvents, getHomePosts, getShows } from "./api"
import { BASE_PAGES, BASE_URL } from "./constants"
import { ALTERNATE } from "./helpers"

export const GenerateSitemap = async (locale, ctx) => {
    const episodes = await getEpisodes()
    const posts = await getHomePosts({ limit: 100 })
    const events = await getEvents()
    const shows = await getShows()
    const pages = await getAllPages({})
    const paths = []
    BASE_PAGES?.forEach((item) => {
        const path = item
        paths.push({
            loc: BASE_URL + locale + path,
            changefreq: 'daily',
            priority: 1,
            lastmod: new Date().toISOString(),
            alternateRefs: ALTERNATE(path),
        });
    })
    pages?.forEach((item) => {
        const path = '/' + item?.url
        paths.push({
            loc: BASE_URL + locale + path,
            changefreq: 'daily',
            priority: 1,
            lastmod: new Date().toISOString(),
            alternateRefs: ALTERNATE(path),
        });
    })
    shows?.forEach((item) => {
        const path = '/show/' + item?.url
        paths.push({
            loc: BASE_URL + locale + path,
            changefreq: 'daily',
            priority: 0.7,
            lastmod: new Date().toISOString(),
            alternateRefs: ALTERNATE(path),
        });
    })

    events?.forEach((item) => {
        const path = '/event/' + item?.url
        paths.push({
            loc: BASE_URL + locale + '/' + path,
            changefreq: 'daily',
            priority: 0.7,
            lastmod: new Date().toISOString(),
            alternateRefs: ALTERNATE(path),
        });
    })
    episodes?.forEach((item) => {
        const path = '/episode/' + item?.url
        paths.push({
            loc: BASE_URL + locale + path,
            changefreq: 'daily',
            priority: 0.7,
            lastmod: new Date().toISOString(),
            alternateRefs: ALTERNATE(path),
        });
    })
    posts?.forEach((item) => {
        const path = '/post/' + item?.url
        paths.push({
            loc: BASE_URL + locale + path,
            changefreq: 'daily',
            priority: 0.7,
            lastmod: new Date().toISOString(),
            alternateRefs: ALTERNATE(path),
        });
    })
    return getServerSideSitemapLegacy(ctx, paths)
}
