
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { Template } from '../templates';
import { getAllPages, getPage } from '../lib/api';
import { localeMap } from '../lib/constants';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';
import Calendar from '../components/Calendar';


const renderOptions = (content) => {
  // create an entry map
  const entryMap = new Map();
  // loop through the block linked entries and add them to the map

  if (content?.entries?.block) {
    for (const entry of content?.entries?.block) {
      entryMap.set(entry.sys.id, entry);
    }
  }

  // loop through the inline linked entries and add them to the map
  if (content?.entries?.inline) {

    for (const entry of content?.entries?.inline) {
      entryMap.set(entry.sys.id, entry);
    }
  }

  return {
    renderNode: {
      [INLINES.HYPERLINK]: (node, children) => {
        return <a target="_blank" rel="noopener noreferrer" href={node.data.uri}>{children}</a>
      },
      [BLOCKS.EMBEDDED_ENTRY]: (node, children) => {
        // find the entry in the entryMap by ID
        const entry = entryMap.get(node.data.target.sys.id)

        const [playing, togglePlaying] = useState(false)


        if (entry.__typename === "Calendars") {
          return (
               <Calendar /> 
          );
        }

        if (entry.__typename === "LiveStreams") {
          const isYoutube = entry.url.includes("youtube")
          let view, autoplay
          return (
            <div>
              {isYoutube && (
                <div style={{ paddingBottom: "56.25%", position: "relative" }}>
                  <iframe style={{ position: "absolute", width: "100%", height: "100%" }} src={entry.url} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
              )}
              {!isYoutube && (
                <>
                  <div style={{ position: 'relative' }}>
                    <ReactPlayer
                      key={`player-${playing}`}
                      url={playing ? `https://media.infra.dreampip.com/videos/${entry.url}/main.m3u8` : 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                      controls={true}
                      width="100%"
                      height="auto"
                      playsInline
                      light
                      onPlay={(e) => {
                        if (!isVideoConsented()) {
                          return
                        } else {
                          togglePlaying(true)
                          return
                        }
                      }}
                      playIcon={<div style={{ paddingBottom: "56.25%", display: 'flex', alignItems: 'center' }}>
                        <img src="/images/button-play.png" style={{ filter: 'invert(100%)', transform: 'translateY(-50%)', position: 'absolute', top: '50%' }} onClick={(e) => {
                          if (!isVideoConsented()) {
                            return
                          } else {
                            togglePlaying(true)
                            return
                          }
                        }} />
                      </div>}
                    />
                  </div>
                </>)}
            </div>
          );
        }
      },
    },
    renderText: text => {
      return text.split('\n').reduce((children, textSegment, index) => {
        return [...children, index > 0 && <br key={index} />, textSegment];
      }, []);
    }
  }
}

export default function Page({ url: slug, title: metaTitle, description, metaImage, content }) {
  const { locale: orig, pathname } = useRouter()
  const locale = orig === "default" ? "en" : orig

  const image = metaImage?.url
  const title = `DreamPip — ${metaTitle}`

  const url = `https://www.dreampip.com${orig !== 'default' ? `/${locale}` : ''}/${slug}`

  const parsed = documentToReactComponents(content?.json, renderOptions(content?.links))
  const snippet = documentToPlainTextString(content?.json).substring(0, 252) + "..."

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:site_name" content="DreamPip" />
        <meta property="og:url" content={url} />
        <meta property="og:description" content={description || snippet}  />
        <meta name="description" content={description || snippet} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={image || "https://www.dreampip.com/og-image.png"}
        />
        <meta
          property="og:image:secure_url"
          content={image || "https://www.dreampip.com/og-image.png"}
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <link rel="canonical" href={url} />
        <link rel="alternate" hrefLang="x-default" href={`https://www.dreampip.com/${slug}`} />
        {Object.keys(localeMap).map((locale) => {
          return <link key={locale} rel="alternate" hrefLang={locale} href={`https://www.dreampip.com/${locale}/${slug}`} />
        })}
      </Head>
      <article className="content-page">
        <div className="wrap bg-gray" style={{ marginBottom: '80px' }}>
          {parsed}
        </div>
      </article>
    </>
  );
}

export async function getStaticProps({ params, preview = false, locale }) {
  const data = await getPage(params.page.join('/'), preview, locale)

  if (!data?.page) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      preview,
      ...data?.page,
    },
  }
}

export async function getStaticPaths() {
  const pages = await getAllPages({})

  const DIRECTORIES = [
    'agenda'
  ]

  return {
    paths: pages?.filter(({url}) => {
      !DIRECTORIES.includes(url.split('/')[0])
    }).map(({ url }) => {
    return `/${url}`
  }) ?? [],
    fallback: 'blocking',
  }
}

Page.getLayout = function getLayout(page) {
  return (
    <Template>
      {page}
    </Template>
  )
}