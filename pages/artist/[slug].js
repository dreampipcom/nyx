import { useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Hero } from '../../components';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { AppContext } from '../../context'
import Head from 'next/head'
import Link from 'next/link';
import { getArtist, getArtists, getShow, getShows } from '../../lib/api';
import { Template } from '../../templates';
import Image from '../../components/ImageBlock';
import { Button, Modal, Skeleton } from '@mui/material';
import moment from 'moment-timezone';
import { useRouter } from 'next/router';
import { ArtistLocale } from '../../locale';
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

const PhotoWrapper = styled.div`
  width: 320px;
  height: 240px;

  @media screen and (min-width:375px) {
    width: 480px;
    height: 320px; 
  }

  @media screen and (min-width:768px) {
    width: 768px;
    height: 480px; 
  }

  @media screen and (min-width:1280px) {
    width: 1024px;
    height: 580px; 
  }
`

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

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

const Content = styled.div`
  max-width: 768px;
  width: 100%;
  p {
    white-space: pre-wrap;
  }

  @media screen and (min-width: 768px) {
    margin-left: 48px;
  }
`;


export default function Artist(props) {
  const { artist } = props
  const { locale: orig, pathname, isFallback } = useRouter()
  const [selectedPhoto, setSelectedPhoto] = useState("")
  const locale = orig === "default" ? "en" : orig

  const url = `https://www.remometro.com/${orig !== 'default' ? `${locale}/` : ''}artist/${artist?.url}`

  const localization = ArtistLocale[locale] || ArtistLocale["default"]

  const episodes = artist?.linkedFrom?.episodesCollection?.items

  const title = `${artist?.name} — Remometro`

  const context = useContext(AppContext)

  const lastShows = useMemo(() => artist?.linkedFrom?.episodesCollection?.items, [])

  const [countdown, setCountdown] = useState(false)
  const [live, setLive] = useState(false)
  const [nextUp, setNextUp] = useState(false)

  const loadCountry = async (country) => {
    await addLocaleData(locale)
    if (!artist?.country && !country) return "International"
    return getCountry(country || artist?.country, locale)
  }

  const [country, loading] = useAsync(loadCountry)
  const otherCountries = artist?.otherCountries?.length ? artist?.otherCountries?.map((country) => useAsync(async () => await loadCountry(country))[0]) : []
  const countries = [country, ...otherCountries].join(', ')

  const heroContent = <Image width={500} height={380} customStyles={{ width: '100%', height: 'auto' }} eager={true} video={artist?.video?.url} videoMp4={artist?.videoMp4?.url} shim={artist?.placeholderUrl} placeholder={artist?.placeholder?.url} className="landscape" alt={title + " image"} src={artist?.image?.url + "?fm=webp"} />

  const aliases = artist?.aliases?.join(', ')

  const guestArtists = useMemo(() => {
    let names = new Set()
    episodes?.forEach((episode) => {
      names.add(episode?.artist?.name)
      episode?.guestsCollection?.items?.forEach((guest) => names.add(guest?.name))
    })
    return [...names.values()].join(', ')
  }, [episodes])

  useEffect(() => {
    if (context?.setContext) {
      context.setContext({ ...context, artist })
    }
  }, [context?.setContext])

  useEffect(() => {
    const now = new Date()
    const start = new Date(artist?.date)
    const momentStart = moment(artist?.date)
    const startDST = momentStart.isDST()
    const nowDST = moment().isDST()
    const DOW = start.getDay()
    const hour = start.getHours()

    const rotation = artist?.rotationWeeks
    const nextDOW = DOW + (rotation > 1 ? (rotation - 1) * 7 : 7)
    const aboutNext = moment().day(nextDOW).hour(hour).minute(0).seconds(0).milliseconds(0)
    const nextDST = aboutNext.isDST()

    // if (nextDST !== nowDST) {
    //   if (nowDST) aboutNext.add(1, 'hour')
    //   if (nextDST) aboutNext.subtract(1, 'hour')
    // }

    var fallback = false
    if (artist) {
      artist?.linkedFrom?.episodesCollection?.items?.forEach((episode) => {
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

    if (!artist?.isLive) return false

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
        <meta property="og:site_name" content="Remometro" />
        <meta property="og:url" content={url} />
        <meta property="og:description" content={`${localization['country']}: ${countries}, ${localization['aliases']}: ${aliases}` || "Purity, light, groove."} />
        <meta name="description" content={`${localization['country']}: ${countries}, ${localization['aliases']}: ${aliases}` || "Purity, light, groove."} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={(artist?.image?.url || "https://www.remometro.com/og-image.png") + "?fm=jpg&w=800&h=418&fit=fill"}
        />
        <meta
          property="twitter:image"
          content={(artist?.image?.url || "https://www.remometro.com/og-image.png") + "?fm=jpg&w=800&h=418&fit=fill"}
        //content={(artist?.image?.url || "https://www.remometro.com/og-image.png") + "?fm=filljpg&w=512"}
        />
        <meta
          property="og:image:secure_url"
          content={(artist?.image?.url || "https://www.remometro.com/og-image.png") + "?fm=jpg&w=800&h=418&fit=fill"}
        //content={(artist?.image?.url || "https://www.remometro.com/og-image.png")}
        />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="418" />
        <link rel="canonical" href={url} />
        <link rel="alternate" hrefLang="x-default" href={`https://www.remometro.com/artist/${artist?.url}`} />
        {Object.keys(localeMap).map((locale) => {
          return <link key={locale} rel="alternate" hrefLang={locale} href={`https://www.remometro.com/${locale}/artist/${artist?.url}`} />
        })}
      </Head>
      <article className="content content-single">
        {isNow(artist?.date, artist?.end) && (
          <Hero
            title={"Loading live stream..."}
          />
        )}
        {artist?.name && (
          <section style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#1a1a1a", flexWrap: "wrap", padding: "32px" }}>
            <section className="landscape" style={{ maxHeight: '100%', flexBasis: '33.333%', flexGrow: 1, maxWidth: '500px', position: 'relative', alignSelf: "flex-start" }} >
              {heroContent}
            </section>
            <Content>
              <section>
                <h1 style={{ fontWeight: "300", color: "white" }}>{artist?.name}</h1>
                {artist?.imagesCollection?.items?.length > 0 && (
                  <section style={{ marginTop: '16px' }}>
                    <h2>{localization['gallery']}</h2>
                    <ShowGrid {...{ items: artist?.imagesCollection?.items, locale, onClick: setSelectedPhoto }} />
                    <Modal
                      open={!!selectedPhoto}
                      onClose={() => { setSelectedPhoto("") }}
                      aria-labelledby="envent-photo-modal"
                      aria-describedby="event-photo-modal"
                    >
                      <PhotoWrapper style={{ ...modalStyle, position: 'relative', outline: "none" }}>
                        <Image fill className="landscape" alt="Artist photo expanded" src={selectedPhoto + "?fm=webp"} />
                      </PhotoWrapper>
                    </Modal>
                  </section>
                )}
              </section>
              <section>
                {
                  !!aliases ? (
                    <p style={{ color: "white" }}><strong>{localization['aliases']}</strong>: {aliases}</p>

                  ) : null
                }
                {
                  !!country ? (
                    <p style={{ color: "white" }}><strong>{localization['country']}</strong>: {countries}</p>

                  ) : null
                }
                {countdown ? <CountdownComponent url={url} event={artist} locale={locale} mobileApp={context?.mobileApp} countStart={countdown} localization={localization} /> : !!artist?.rotationWeeks ? (<Skeleton variant="rectangular" width="100%" height={32} sx={{ marginY: 2 }} />) : undefined}
              </section>

              <section style={{ color: "white" }}>
                {/* eslint-disable-next-line react/no-danger */}
                {documentToReactComponents(artist?.content?.json, renderOptions(artist?.content?.links))}
              </section>
              {artist?.highlightsCollection?.items?.length > 0 && (
                <section>
                  <hr />
                  <p style={{ color: "white" }}><strong>{localization['highlights']}:</strong></p>
                  <ShowGrid key={""} {...{ items: artist?.highlightsCollection?.items, live, nextUp, locale, directory: '/episode' }} />
                </section>
              )}
              {lastShows.length > 0 && (
                <section>
                  <hr />
                  <p style={{ color: "white" }}><strong>{localization['episodes']}:</strong></p>
                  <ShowGrid key={""} {...{ items: lastShows, live, nextUp, locale, directory: '/episode' }} />
                </section>
              )}
              {/* <hr style={{ marginBottom: "32px" }} />
              <Link href="/shows" style={{ color: "white" }}>{localization['back']}.</Link> */}
            </Content>
          </section>
        )}
      </article>
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
      title: event?.title + ' at Remometro',
      url: url || 'https://www.remometro.com',
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
  const source = await getArtist(params.slug, preview, locale)
  const data = source?.artist

  if (!data) {
    return {
      notFound: true
    }
  }

  const newData = await addPlaceholders(data)

  return {
    props: {
      preview,
      artist: newData ?? null,
    },
  }
}

export async function getStaticPaths() {
  const artists = await getArtists()

  return {
    paths: artists?.map(({ url }) => `/artist/${url}`) ?? [],
    fallback: 'blocking',
  }
}

Artist.getLayout = function getLayout(page) {
  return (
    <Template>
      {page}
    </Template>
  )
}