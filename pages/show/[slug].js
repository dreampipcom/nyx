import { useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Hero } from '../../components';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { AppContext } from '../../context'
import Head from 'next/head'
import Link from 'next/link';
import { getShow, getShows } from '../../lib/api';
import { Template } from '../../templates';
import Image from '../../components/ImageBlock';
import { Button, Skeleton } from '@mui/material';
import moment from 'moment-timezone';
import { useRouter } from 'next/router';
import { ShowLocale } from '../../locale';
import { localeMap } from '../../lib/constants';
import { getCountry } from '../../lib/intl-locales';
import { ShowGrid } from '../../components/ShowGrid';
import EventIcon from '@mui/icons-material/Event';
import VideoPlayer from '../../components/VideoPlayer';
import { addPlaceholders } from '../../lib/server-helpers';
import { addLocaleData } from '../../lib/intl-locales';
import { useAsync } from '../../hooks/useAsync';

const ONE_HOUR = 3600000
const TWO_HOURS = ONE_HOUR * 2

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
            <span>
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
            </span>
          );
        }
      },
    }
  }
}

const TitleWrapper = styled.div`
  max-width: 768px;
  width: 100%;
  p {
    white-space: pre-wrap;
  }

  @media screen and (min-width: 768px) {
    margin-left: 48px;
  }
`;


export default function Show(props) {
  const { show } = props
  const { locale: orig, pathname, isFallback } = useRouter()
  const locale = orig === "default" ? "en" : orig

  const url = `https://www.dreampip.com/${orig !== 'default' ? `${locale}/` : ''}show/${show?.url}`

  const localization = ShowLocale[locale] || ShowLocale["default"]

  const episodes = show?.linkedFrom?.episodesCollection?.items

  const title = `${show?.title} — DreamPip`

  const context = useContext(AppContext)

  const lastShows = useMemo(() => show?.linkedFrom?.episodesCollection?.items, [])

  const [countdown, setCountdown] = useState(false)
  const [live, setLive] = useState(false)
  const [nextUp, setNextUp] = useState(false)

  const loadCountry = async () => {
    await addLocaleData(locale)
    if (!show?.country) return "International"
    return getCountry(show?.country, locale)
  }

  const [country, loading] = useAsync(loadCountry)

  const heroContent = <Image width={500} height={380} customStyles={{ width: '100%', height: 'auto' }} eager={true} video={show?.video?.url} videoMp4={show?.videoMp4?.url} shim={show?.placeholderUrl} placeholder={show?.placeholder?.url}  className="landscape" alt={title + " image"} src={show?.image?.url + "?fm=webp"} />


  const artists = useMemo(() => {
    let names = new Set()
    episodes?.forEach((episode) => {
      names.add(episode?.artist?.name)
      episode?.guestsCollection?.items?.forEach((guest) => names.add(guest?.name))
    })
    return [...names.values()].join(', ')
  }, [episodes])

  useEffect(() => {
    if (context?.setContext) {
      context.setContext({ ...context, show })
    }
  }, [context?.setContext])

  useEffect(() => {
    const now = new Date()
    const start = new Date(show?.date)
    const momentStart = moment(show?.date)
    const startDST = momentStart.isDST()
    const nowDST = moment().isDST()
    const DOW = start.getDay()
    const hour = start.getHours()

    const rotation = show?.rotationWeeks
    const nextDOW = DOW + (rotation > 1 ? (rotation - 1) * 7 : 7)
    const aboutNext = moment().day(nextDOW).hour(hour).minute(0).seconds(0).milliseconds(0)
    const nextDST = aboutNext.isDST()

    // if (nextDST !== nowDST) {
    //   if (nowDST) aboutNext.add(1, 'hour')
    //   if (nextDST) aboutNext.subtract(1, 'hour')
    // }

    var fallback = false
    if (show) {
      show?.linkedFrom?.episodesCollection?.items?.forEach((episode) => {
        const nextEpisode = new Date(episode?.date).getTime()
        const end = new Date(episode?.end).getTime() || nextEpisode + TWO_HOURS
        if (now > nextEpisode && now < end) {
          if (!live || live !== episode?.url) {
            setLive(episode?.url)
          }
        } else if (now < nextEpisode) {
          if (!nextUp || nextUp !== episode?.url) {
            setNextUp(episode?.url)
            setCountdown(new Date(episode?.date).getTime())
            fallback = true
          }
        } else if (live === episode?.url || nextUp === episode?.url) {
          setLive(undefined)
          setNextUp(undefined)
        }
      })
    }
  }, []);

  const isNow = (start, end) => {
    const now = new Date()
    const endTime = new Date(end)
    const startTime = new Date(start)

    if (!show?.isLive) return false

    if (!endTime) return false

    if (now > startTime && now <= endTime) {
      return true
    }

    return false
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:site_name" content="DreamPip" />
        <meta property="og:url" content={url} />
        <meta property="og:description" content={`${localization['country']}: ${country}, ${localization['artist']}: ${artists}` || "Upwards streaming. 📡"} />
        <meta name="description" content={`${localization['country']}: ${country}, ${localization['artist']}: ${artists}` || "Upwards streaming. 📡"} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={(show?.image?.url || "https://www.dreampip.com/og-image.png") + "?fm=jpg&w=800&h=418&fit=fill"}
        />
        <meta
          property="twitter:image"
          content={(show?.image?.url || "https://www.dreampip.com/og-image.png") + "?fm=jpg&w=800&h=418&fit=fill"}
        //content={(show?.image?.url || "https://www.dreampip.com/og-image.png") + "?fm=filljpg&w=512"}
        />
        <meta
          property="og:image:secure_url"
          content={(show?.image?.url || "https://www.dreampip.com/og-image.png") + "?fm=jpg&w=800&h=418&fit=fill"}
        //content={(show?.image?.url || "https://www.dreampip.com/og-image.png")}
        />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="418" />
        <link rel="canonical" href={url} />
        <link rel="alternate" hrefLang="x-default" href={`https://www.dreampip.com/show/${show?.url}`} />
        {Object.keys(localeMap).map((locale) => {
          return <link key={locale} rel="alternate" hrefLang={locale} href={`https://www.dreampip.com/${locale}/show/${show?.url}`} />
        })}
      </Head>
      <div className="content content-single">
        {isNow(show?.date, show?.end) && (
          <Hero
            title={"Loading live stream..."}
          />
        )}
        {show?.title && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#1a1a1a", flexWrap: "wrap", padding: "32px" }}>
            <div className="landscape" style={{ maxHeight: '100%', flexBasis: '33.333%', flexGrow: 1, maxWidth: '500px', position: 'relative', alignSelf: "flex-start" }} >
              {heroContent}
            </div>
            <TitleWrapper>
              <div>
                <h1 style={{ fontWeight: "300", color: "white" }}>{show?.title}</h1>
                {
                  !!artists ? (
                    <p style={{ color: "white" }}><strong>{localization['artist']}</strong>: {artists}</p>

                  ) : null
                }
                {
                  !!country ? (
                    <p style={{ color: "white" }}><strong>{localization['country']}</strong>: {country}</p>

                  ) : null
                }
                {countdown ? <CountdownComponent url={url} event={show} locale={locale} mobileApp={context?.mobileApp} countStart={countdown} localization={localization} /> : !!show?.rotationWeeks ? (<Skeleton variant="rectangular" width="100%" height={32} sx={{ marginY: 2 }} />) : undefined}
              </div>
              <div style={{ color: "white" }}>
                {/* eslint-disable-next-line react/no-danger */}
                {documentToReactComponents(show?.bioRich?.json, renderOptions(show?.bioRich?.links))}
              </div>
              {lastShows.length > 0 && (
                <div>
                  <hr />
                  <p style={{ color: "white" }}><strong>{localization['episodes']}:</strong></p>
                  <ShowGrid key={""} {...{ items: lastShows, live, nextUp, locale, directory: '/episode' }} />
                </div>
              )}
              <hr style={{ marginBottom: "32px" }} />
              <Link href="/shows" style={{ color: "white" }}>{localization['back']}.</Link>
            </TitleWrapper>
          </div>
        )}
      </div>
    </>
  );
}

const CountdownComponent = ({ mobileApp, countStart, localization, event, locale, url }) => {
  const [countdownString, setCountdownString] = useState("")


  const handleIcs = async () => {
    const now = new Date()
    const start = new Date(event?.date)
    const momentStart = moment(event?.date)
    const startDST = momentStart.isDST()
    const nowDST = moment().isDST()
    const DOW = start.getDay()
    const hour = start.getHours()

    const rotation = event?.rotationWeeks
    const nextDOW = DOW + (rotation > 1 ? (rotation - 1) * 7 : 7)
    const aboutNext = moment().day(nextDOW).hour(hour).minute(0).seconds(0).milliseconds(0)
    const nextDST = aboutNext.isDST()


    const cal = await import('../../lib/cal')
    const createICal = cal.createICal
    const download = cal.download

    let alarms = []

    let startEvent = aboutNext.tz("Europe/Rome").utc().format('YYYY-M-D-H-m').split("-").map((el) => Number(el))
    let endEvent = aboutNext.tz("Europe/Rome").utc().add({ 'hours': 1, "minutes": 0 }).format("YYYY-M-D-H-m").split("-").map((el) => Number(el))

    const eventData = {
      start: startEvent,
      end: endEvent,
      title: event?.title + ' at DreamPip',
      url: url || 'https://www.dreampip.com',
      location: undefined,
      locale,
      recurrence: event?.rotationWeeks ? `FREQ=WEEKLY;INTERVAL=${event?.rotationWeeks}` : undefined,
      alarms
    }

    const ical = await createICal(eventData)
    await download(`purizu-${event?.url}.ics`, ical, mobileApp)
  }

  useEffect(() => {
    let countdown = () => {
      const distance = countStart - new Date().getTime()

      if (distance <= 0) setCountdownString("")

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
  }, [])
  return countdownString ? (
    <p style={{ color: "white", height: 32, marginBottom: "16px", marginTop: "16px", display: 'flex', flexWrap: 'wrap', height: '100%', alignItems: 'center' }}>{localization["next"]}: {countdownString + " "}
      <Button sx={{ marginY: "4px" }} startIcon={<EventIcon />} onClick={handleIcs}>{localization["calendar"]}</Button>
    </p>
  ) : undefined
}

export async function getStaticProps({ params, preview = false, locale }) {
  const source = await getShow(params.slug, preview, locale)
  const data = source?.show

  if (!data) {
    return {
      notFound: true
    }
  }

  const newData = await addPlaceholders(data)

  return {
    props: {
      preview,
      show: newData ?? null,
    },
  }
}

export async function getStaticPaths() {
  const episodes = await getShows()

  return {
    paths: episodes?.map(({ url }) => `/show/${url}`) ?? [],
    fallback: 'blocking',
  }
}

Show.getLayout = function getLayout(page) {
  return (
    <Template>
      {page}
    </Template>
  )
}