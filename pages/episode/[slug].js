import { useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { AppContext } from '../../context'
import Head from 'next/head'
import Link from 'next/link';
import { Button, Chip, Skeleton } from '@mui/material';
import { useRouter } from 'next/router'
import { getEpisode, getEpisodes } from '../../lib/api'
import { Template } from '../../templates';
import Image from '../../components/ImageBlock';
import { EpisodeLocale } from '../../locale';
import { localeMap } from '../../lib/constants';
import { addLocaleData, getCountry } from '../../lib/intl-locales';
import { isPast } from '../../lib/helpers';
import EventIcon from '@mui/icons-material/Event';
import ReactPlayer from 'react-player';
import VideoPlayer from '../../components/VideoPlayer';
import { addPlaceholders } from '../../lib/server-helpers';
import { useAsync } from '../../hooks/useAsync';
const ics = require('ics')

const TitleWrapper = styled.div`
  max-width: 768px;
  flex-basis: 100%;

  @media screen and (min-width: 768px) {
     margin-left: 24px;
     flex-basis: 60%;
  }

  @media screen and (min-width: 1920px) {
    margin-left: 48px;
    flex-basis: 75%;
 }

  p {
    white-space: pre-wrap;
  }
`;

const ImageWrapper = styled.div`
  height: auto;
  max-width: 320px;
  flex-basis: 100%;

  @media screen and (min-width: 375px) {
    height: auto;
    flex-basis: 100%;
    max-width: 520px;
  }

  @media screen and (min-width: 768px) {
    height: auto;
    flex-basis: 30%;
    max-width: 768px;
    margin: 16px;
  }

  @media screen and (min-width: 1920px) {
    height: auto;
    flex-basis: 25%;
    max-width: 768px;
    margin: 64px;
  }
`

export const isNow = (start, end) => {
  const now = new Date()
  const endTime = new Date(end)
  const startTime = new Date(start)

  //if (!episode?.isLive) return false

  if (!endTime) return false

  if (now > startTime && now <= endTime) {
    return true
  }

  return false
}

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

        if (entry.__typename === "LiveStreams") {
          const isYoutube = entry.url.includes("youtube")
          return (
            <div>
              {isYoutube && (
                <div style={{ paddingBottom: "56.25%", position: "relative" }}>
                  <iframe style={{ position: "absolute", width: "100%", height: "100%" }} src={entry.url} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
              )}
              {!isYoutube && (
                <VideoPlayer
                  slug={entry.url}
                />
              )}
            </div>
          );
        }
      },
    }
  }
}

export default function Episode({ episode, preview }) {
  const now = new Date().getTime()
  const end = new Date(episode?.end || episode?.date).getTime()
  const start = new Date(episode?.date).getTime()
  const [live, setLive] = useState(false)
  const [countdownString, setCountdownString] = useState("")
  const [overdue, setOverdue] = useState(false)
  const title = `${episode?.title} — Remometro`

  const { locale: orig, pathname } = useRouter()
  const locale = orig === "default" ? "en" : orig

  const url = `https://www.remometro.com/${orig !== 'default' ? `${locale}/` : ''}episode/${episode?.url}`

  const localization = EpisodeLocale[locale] || EpisodeLocale["default"]

  const downloadEventCalendar = async () => {
    const cal = await import('../../lib/cal')
    const createICal = cal.createICal
    const download = cal.download
    const eventCal = {
      start: episode?.date,
      end: episode?.end,
      title: episode?.title,
      url: url,
      location: url,
      locale
    }

    const ical = await createICal(eventCal)
    await download(`purizu-${episode?.url}.ics`, ical, true)
  }

  const artists = useMemo(() => {
    let names = new Set()
    names.add(episode?.artist?.name)
    episode?.guestsCollection?.items?.forEach((guest) => names.add(guest?.name))
    return [...names.values()].join(', ')
  }, [episode])


  const loadCountry = async () => {
    await addLocaleData(locale)
    return getCountry(episode?.artist?.country, locale)
  }

  const [country, loading] = useAsync(loadCountry)

  const heroContent = <Image eager={true} video={episode?.video?.url} videoMp4={episode?.videoMp4?.url} shim={episode?.placeholderUrl} placeholder={episode?.placeholder?.url} width={500} height={500} customStyles={{ width: '100%', height: 'auto' }} className="square" alt={title + " image"} src={episode?.image?.url + "?fm=webp"} />

  const context = useContext(AppContext)

  useEffect(() => {
    if (context?.setContext && episode) {
      const mixcloud = now > end ? episode?.mixcloud : undefined
      context.setContext({ ...context, episode: { ...episode, mixcloud } })
    }
  }, [JSON.stringify(context), JSON.stringify(episode)])

  useEffect(() => {
    const distance = start - now;
    if (distance < 0) {
      setCountdownString(null)
    }
    const countdown = () => {
      const newNow = new Date().getTime()
      const distance = start - newNow;

      if (!!end && now > end && !overdue) {
        setOverdue(true)
      }

      if (now > start && now < end) {
        if (!live) {
          setLive(true)
        }
      } else if (live) {
        setLive(false)
      }

      if (distance < 0) {
        if (countdownString !== null) setCountdownString(null)
        return
      }


      // Time calculations for days, hours, minutes and seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (days || hours || minutes || seconds) setCountdownString(`${days}d ${hours}h ${minutes}m ${seconds}s`)
    }

    const interval = setInterval(countdown, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [episode]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:site_name" content="Remometro" />
        <meta property="og:url" content={url} />
        <meta property="og:description" content={`${localization['listen']} ${artists}.`} />
        <meta name="description" content={`${localization['listen']} ${artists}.`} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={`${(episode?.placeholder?.url || episode?.image?.url || "https:`//www.remometro.com/og-image.png") + "?fm=jpg&w=512"}`}
        />
        <meta property="twitter:image" content={`${(episode?.placeholder?.url || episode?.image?.url || "https://www.remometro.com/og-image.png") + "?fm=jpg&w=512"}`} />
        <meta
          property="og:image:secure_url"
          content={`${(episode?.placeholder?.url || episode?.image?.url || "https://www.remometro.com/og-image.png") + "?fm=jpg&w=512"}`}
        />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <link rel="canonical" href={url} />
        <link rel="alternate" hrefLang="x-default" href={`https://www.remometro.com/episode/${episode?.url}`} />
        {Object.keys(localeMap).map((locale) => {
          return <link key={locale} rel="alternate" hrefLang={locale} href={`https://www.remometro.com/${locale}/episode/${episode?.url}`} />
        })}
      </Head>
      <div className="content content-single">
        {!overdue && isNow(episode?.date, episode?.end) && episode?.isLive && (
          <>
            <div
              style={{
                position: 'relative',
                width: '100%',
                zIndex: 2,
                backgroundColor: "#1a1a1a"
              }}>
              <ReactPlayer
                url="https://live.infra.purizu.com/main.m3u8"
                controls={true}
                width="100%"
                height="auto"
                playsInline
              />
            </div>
          </>
        )}
        {episode?.title && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#1a1a1a", padding: "32px", flexWrap: 'wrap' }}>
            <ImageWrapper className="square" style={{ position: 'relative', alignSelf: 'flex-start', justifySelf: 'flex-start' }} >
              {heroContent}
              {/* <Image placeholder={episode?.placeholder?.url} fill alt="Episode art" src={episode?.image?.url + "?fm=webp"} /> */}
            </ImageWrapper>
            <TitleWrapper>
              <Chip label="Live Now!" color="success" sx={{ marginRight: 1, marginY: "16px", display: live ? 'inline-flex' : 'none' }} />
              {episode?.genres?.map((genre, index) => {
                return (
                  <Chip key={genre + index} label={genre} sx={{ marginLeft: index > 0 ? 1 : 0, marginY: "16px" }} />
                )
              })}
              <h1 style={{ fontWeight: "300", color: "white" }}>{episode?.title}</h1>
              <div style={{ color: "white" }}>{localization["artist"]}: {artists}</div>
              {
                !!episode?.show?.url && (
                  <div style={{ color: "white" }}>{localization["show"]}: <Link href={`/show/${episode?.show?.url}`} style={{ color: "white" }}>{episode?.show?.title}</Link></div>
                )
              }
              {
                !!episode?.event?.url && (
                  <div style={{ color: "white" }}>{localization["event"]}: <Link href={`/event/${episode?.event?.url}`} style={{ color: "white" }}>{episode?.event?.title}</Link></div>
                )
              }
              {!!episode?.artist?.country && (
                <div style={{ color: "white" }} >{localization["country"]}: {country}</div>
              )}
              {!!countdownString ? (
                <div style={{ color: "white", height: 32, marginBottom: "16px", marginTop: "16px", display: 'flex', flexWrap: 'wrap', height: '100%', alignItems: 'center' }}>{localization["countdown"]}: {countdownString + " "}
                  <Button sx={{ marginY: "4px" }} startIcon={<EventIcon />} onClick={downloadEventCalendar}>{localization["calendar"]}</Button>
                </div>
              ) : !isPast(episode?.date) ? (<Skeleton variant="rectangular" width="100%" height={32} sx={{ marginY: 2 }} />) : undefined}
              {
                !!episode?.body?.json?.data ? (
                  <div style={{ color: "white", marginTop: '32px' }}>
                    {/* eslint-disable-next-line react/no-danger */}
                    {documentToReactComponents(episode?.body?.json, renderOptions(episode?.body?.links))}
                  </div>
                ) : (
                  <div style={{ color: "white", marginTop: '32px' }}>
                    {/* eslint-disable-next-line react/no-danger */}
                    {documentToReactComponents(episode?.show?.bioRich?.json, renderOptions(episode?.show?.bioRich?.links))}
                  </div>
                )
              }
              <hr />
              <Link href="/episodes" style={{ color: "white" }}>{localization["back"]}</Link>
            </TitleWrapper>
          </div>
        )}
      </div>
    </>)
}

export async function getStaticProps({ params, preview = false, locale }) {
  const source = await getEpisode(params.slug, preview, locale)
  const data = source?.post

  if (!data) {
    return {
      notFound: true
    }
  }

  const newData = await addPlaceholders(data)

  return {
    props: {
      preview,
      episode: newData ?? null,
    },
  }
}

export async function getStaticPaths() {
  const episodes = await getEpisodes()

  return {
    paths: episodes?.map(({ url }) => `/episode/${url}`) ?? [],
    fallback: 'blocking',
  }
}

Episode.getLayout = function getLayout(page) {
  return (
    <Template>
      {page}
    </Template>
  )
}
