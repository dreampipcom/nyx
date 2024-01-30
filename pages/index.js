import { useContext, useEffect, useState } from 'react';
import { Hero, Posts } from '../components';
import Head from 'next/head'
import { AppContext } from '../context';
import Link from 'next/link';
import { getHeros, getHomeEpisodes, getHomePosts } from '../lib/api';
import { Template } from '../templates';
import { useRouter } from 'next/router';
import { localizeUrl } from '../lib/helpers';
import { ShowGrid } from '../components/ShowGrid';
import { HomeLocale } from '../locale/home';
import ReactPlayer from 'react-player';
import { addPlaceholders } from '../lib/server-helpers';
import Bugsnag from '@bugsnag/js';

const DEFAULT = {
  title: 'DreamPip — Upwards streaming. 📡',
  description: `DreamPip is a community-oriented vibe modulation platform based now in Barcelona, and established on Sep. 2012.`
}

// Translation
const IT = {
  title: 'DreamPip — Upwards streaming. 📡',
  description: `DreamPip è una piattaforma di modulazione delle vibrazioni orientata alla comunità, ora con sede a Barcellona e fondata nel settembre 2012.`
}

const PT = {
  title: 'DreamPip — Upwards streaming. 📡',
  description: `DreamPip é uma plataforma de modulação de vibração orientada para a comunidade, agora sediada em Barcelona, e estabelecida em setembro de 2012.`
}

const ES = {
  title: 'DreamPip — Upwards streaming. 📡',
  description: `DreamPip es una plataforma de modulación de vibraciones orientada a la comunidad, ahora con sede en Barcelona, y establecida en septiembre de 2012.`
}

const DE = {
  title: 'DreamPip — Upwards streaming. 📡',
  description: `DreamPip ist eine gemeinschaftsorientierte Vibe-Modulationsplattform, die jetzt in Barcelona ansässig ist und im Sep. 2012 gegründet wurde.`
}

const FR = {
  title: 'DreamPip — Upwards streaming. 📡',
  description: `DreamPip est une plateforme de modulation de vibe orientée communauté, désormais basée à Barcelone, et fondée en septembre 2012.`
}

const RO = {
  title: 'DreamPip — Upwards streaming. 📡',
  description: `DreamPip este o platformă de modulare a vibrațiilor orientată către comunitate, acum cu sediul în Barcelona și înființată în septembrie 2012.`
}

const PL = {
  title: 'DreamPip — Upwards streaming. 📡',
  description: `DreamPip to platforma modulacji wibracji zorientowana na społeczność, obecnie z siedzibą w Barcelonie i założona we wrześniu 2012 roku.`
}

const CZ = {
  title: 'DreamPip — Upwards streaming. 📡',
  description: `DreamPip je komunitně orientovaná platforma modulace vibe, nyní s působištěm v Barceloně a založená v září 2012.`
}

const SE = {
  title: 'DreamPip — — Upwards streaming. 📡',
  description: `DreamPip är en samhällsorienterad vibe-moduleringsplattform som nu är baserad i Barcelona och etablerades i sep. 2012.`
}

const EE = {
  title: 'DreamPip — — Upwards streaming. 📡',
  description: `DreamPip on kogukonnakeskne vibe modulatsiooni platvorm, mis nüüd asub Barcelonas ja asutati septembris 2012.`
}

const JP = {
  title: 'DreamPip — Upwards streaming. 📡',
  description: `DreamPipは、現在バルセロナを拠点としたコミュニティ志向のバイブモジュレーションプラットフォームで、2012年9月に設立されました。`
}



export default function Home(props) {
  const { posts: parsedPosts, hero: parsedHeros, episodes } = props;
  const [live, setLive] = useState()
  const [feed, setFeed] = useState(!!episodes?.length ? [...episodes] : [].slice(0, 4))
  const [isStreamingVideo, setIsStreamingVideo] = useState(false);
  const { consent } = useContext(AppContext);

  const checkLive = async () => {
    if (!consent) return
    try {
      const auth = `https://www.dreampip.com/api/checklive`;
      const token = await fetch(auth)
      const json = await token.json()
      const status = json.data?.status
      if (status === 'RUNNING') {
        setIsStreamingVideo(true)
      } else {
        setIsStreamingVideo(false)
      }
    } catch (e) {
      Bugsnag.notify(e)
    }
  }

  useEffect(() => {
    if(!consent) return
    checkLive()
  }, [consent])

  const { locale: orig, pathname } = useRouter()
  const locale = orig === "default" ? "en" : orig

  const localeMap = {
    "it-it": IT,
    "pt-br": PT,
    "en": DEFAULT,
    "es-es": ES,
    "de-de": DE,
    "fr-fr": FR,
    "ro": RO,
    "pl-pl": PL,
    "cs-cz": CZ,
    "et-ee": EE,
    "ja-jp": JP
  }

  const meta = localeMap[locale] || localeMap['en']
  const localization = HomeLocale[locale] || HomeLocale['default']

  const url = `https://www.dreampip.com${orig !== 'default' ? `/${locale}` : '/'}`

  useEffect(() => {
    const parsed = episodes?.length && [...episodes].map((episode) => {
      const now = new Date()
      const episodeDate = new Date(episode?.date)


      if (now < episodeDate) {
        return
      }

      return episode
    }).filter((e) => e?.featured).sort((a, b) => {
      return new Date(b?.date) - new Date(a?.date)
    }).slice(0, 4)

    setFeed(parsed)
  }, [live])

  useEffect(() => {
    if(!consent) return
    const liveCheckInterval = setInterval(checkLive(), 60000 * 15);

    const countdown = () => {
      
      episodes?.length && [...episodes]?.map((episode) => {
        const countDownDate = new Date(episode?.date).getTime()
        const now = new Date().getTime()
        const end = new Date(episode?.end).getTime()

        if (now > countDownDate && now < end) {
          if (!live || live !== episode?.url) {
            setLive(episode?.url)
          }
        } else if (live && live === episode?.url) {
          setLive(undefined)
        }
      })
    }

    const interval = setInterval(countdown, 1000)
    return () => {
      clearInterval(interval)
      clearInterval(liveCheckInterval)
    }
  }, [consent])

  return (
    <div>
      <Head>
        <title>{meta.title}</title>
        <meta property="og:title" content={meta.title} />
        <meta property="og:site_name" content="DreamPip" />
        <meta property="og:url" content={url} />
        <meta property="og:description" content={meta.description} />
        <meta name="description" content={meta.description} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://www.dreampip.com/og-image.png"
        />
        <meta
          property="og:image:secure_url"
          content="https://www.dreampip.com/og-image.png"
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <link rel="canonical" href={url} />
        <link rel="alternate" hrefLang="x-default" href={`https://www.dreampip.com/`} />
        {Object.keys(localeMap).map((locale) => {
          return <link key={locale} rel="alternate" hrefLang={locale} href={`https://www.dreampip.com/${locale}`} />
        })}
      </Head>
      <article className="content content-page">
        {parsedHeros?.length ? (
          <Hero
            title={parsedHeros?.title}
            bgImage={parsedHeros?.image?.url}
            buttonText={parsedHeros?.ctaText}
            buttonURL={parsedHeros?.ctaLink}
            isStreamingVideo={isStreamingVideo}
          >
            <p>{parsedHeros?.subTitle}</p>
          </Hero>
        ) : undefined}
        {isStreamingVideo && (
          <>
            <section
              style={{
                position: 'relative',
                width: '100%',
                zIndex: 2,
                backgroundColor: "#1a1a1a"
              }}>
              <ReactPlayer
                url="https://live.infra.dreampip.com/main.m3u8"
                controls={true}
                width="100%"
                height="auto"
                playsInline
              />
            </section>
          </>
        )}
        <section style={{ display: 'block', position: 'relative' }}>
          <ShowGrid even {...{ items: feed, locale, live, directory: '/episode' }} />
          {/* <Link href="/episodes"><span style={{ display: "block", textAlign: "center", margin: 32, width: "100%" }}>View all episodes</span></Link> */}
        </section>
        <section style={{ display: 'block', position: 'relative' }} className='wrap'>
          <Posts
            posts={parsedPosts}
            heading="Posts"
            headingLevel="h2"
            postTitleLevel="h3"
          />
          <Link href={localizeUrl("/blog", locale)}><span style={{ display: "block", textAlign: "center", margin: '32px 0', width: "100%" }}>{localization['view']}</span></Link>
        </section>
      </article>
    </div>
  );
}

export async function getStaticProps({ params, preview = false, locale }) {
  const data = await getHomeEpisodes(20, true)
  const hero = await getHeros(locale)
  const posts = await getHomePosts({ locale, limit: 6 })

  const newData = await addPlaceholders(data)
  const newPosts = await addPlaceholders(posts)
  const newHeroes = await addPlaceholders(hero)

  return {
    props: {
      preview,
      hero: newHeroes ?? null,
      posts: newPosts ?? null,
      episodes: newData ?? null,
    },
  }
}
export const maxDuration = 30;

Home.getLayout = function getLayout(page) {
  return (
    <Template>
      {page}
    </Template>
  )
}




