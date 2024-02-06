import { useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Hero } from '../../components';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { AppContext } from '../../context'
import Head from 'next/head'
import Link from 'next/link';
import { getEvent, getEvents } from '../../lib/api';
import { Template } from '../../templates';
import Image from '../../components/ImageBlock';
import { Button, Chip, Modal, TextField, Skeleton } from '@mui/material';
import { useRouter } from 'next/router';
import moment from 'moment';
import momentTZ from 'moment-timezone';
import { EventLocale } from '../../locale'
import { localeMap } from '../../lib/constants';
import { addTimezoneLocaleData, getCountry } from '../../lib/intl-locales';
import { isPast, pzTrack } from '../../lib/helpers';
import { ShowGrid } from '../../components/ShowGrid';
import EventIcon from '@mui/icons-material/Event';
import VideoPlayer from '../../components/VideoPlayer';
import { addPlaceholders } from '../../lib/server-helpers';
import { addLocaleData } from '../../lib/intl-locales';
import { useAsync } from '../../hooks/useAsync';
const ics = require('ics')

const timezone = {
  "BR": "America/Bahia",
  "IT": "Europe/Rome"
}

const eventStatusSchema = {
  "scheduled": "https://schema.org/EventScheduled",
  "cancelled": "https://schema.org/EventCancelled",
  "postponed": "https://schema.org/EventPostponed",
  "movedonline": "https://schema.org/EventMovedOnline"
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
          let view, autoplay
          if (!isYoutube) {
            view = entry.url.replaceAll('preview', 'view')
            autoplay = `${entry.url}?autoplay=1`
          }
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


export default function Event(props) {
  const { event } = props

  const { locale: orig, pathname } = useRouter()
  const locale = orig === "default" ? "en" : orig

  const title = `${event?.title} — DreamPip`

  const url = `https://www.dreampip.com/${orig !== 'default' ? `${locale}/` : ''}event/${event?.url}`

  const localization = EventLocale[locale] || EventLocale["default"]
  const localTime = event?.localTimezone || timezone[event?.country] || "Europe/Rome"

  const loadCountry = async () => {
    await addLocaleData(locale)
    await addTimezoneLocaleData(locale)
    return getCountry(event?.country, locale)
  }

  const [country, loading] = useAsync(loadCountry, event?.country)


  const context = useContext(AppContext)

  const [countdownString, setCountdownString] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [invalidPhone, setInvalidPhone] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState("")

  moment.locale(locale)
  momentTZ.updateLocale(locale, moment.localeData()._config);
  momentTZ.locale(locale);
  const momentUntil = momentTZ(event?.end).tz(moment.tz.guess())
  const momentWhen = momentTZ(event?.date).tz(moment.tz.guess())
  const momentLocalWhen = momentTZ(event?.date).tz(localTime)
  const localUntil = momentTZ(event?.end).tz(localTime).format("H:mm A")

  const until = momentUntil.format("H:mm A").toString()
  const when = momentWhen.format(`LLLL-${!!until && `[${until}]`} zz`).toString()
  const localWhen = localTime ? momentLocalWhen.format(`LLLL-${!!localUntil && `[${localUntil}]`} ([${localTime}])`).toString() : when

  const artists = useMemo(() => {
    let names = new Set()
    event?.artistsCollection?.items?.forEach((artist) => {
      names.add(artist?.name)
    })
    return [...names.values()].join(', ')
  }, [event])

  const downloadEventCalendar = async () => {
    const cal = await import('../../lib/cal')
    const createICal = cal.createICal
    const download = cal.download
    const eventCal = {
      start: event?.start,
      end: event?.end,
      title: event?.title,
      url: url,
      timezone: localTime,
    }

    const ical = await createICal(eventCal)
    await download(`purizu-${event?.url}.ics`, ical, mobileApp)
  }

  useEffect(() => {
    if (context?.setContext) {
      context.setContext({ ...context, event })
    }
  }, [context?.setContext])

  useEffect(() => {
    const countDownDate = new Date(event?.date).getTime()
    const now = new Date().getTime()
    const distance = countDownDate - now;
    let countdown = () => { }
    if (distance < 0) {
      setCountdownString(null)
    } else {
      countdown = () => {
        const countDownDate = new Date(event?.date).getTime()
        const now = new Date().getTime()
        const distance = countDownDate - now;

        if (distance < 0) {
          setCountdownString(null)
          return
        }

        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (days || hours || minutes || seconds) setCountdownString(`${days}d ${hours}h ${minutes}m ${seconds}s`)
      }
    }


    const interval = setInterval(countdown, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [context?.event, event]);

  const isNow = (start, end) => {
    const now = new Date()
    const endTime = new Date(end)
    const startTime = new Date(start)

    if (!event?.isLive) return false

    if (!endTime) return false

    if (now > startTime && now <= endTime) {
      return true
    }

    return false
  }
  const handleOnSubmit = async (e) => {
    //e.preventDefault()
    const formData = new FormData(e.target)
    const dataObj = Object.fromEntries(formData.entries())
    const validPhone = validatePhone(dataObj["MERGE4"])
    if (!validPhone) {
      setInvalidPhone(true)
      return
    }
    const data = new URLSearchParams(formData);
    const url = 'https://purizu.us10.list-manage.com/subscribe/post'

    const res = await fetch(url, {
      mode: 'no-cors',
      method: 'post',
      body: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    if (event?.tickets) window.open(event?.tickets)
    setSubscribed(true)
    window.localStorage.setItem(event?.url, true)

    pzTrack('form_submitted', {
      email: dataObj['MERGE0'],
      name: dataObj['MERGE1'],
      event: dataObj['MERGE2'],
      phone: dataObj['MERGE4'],
      mId: dataObj['id'],
      mU: dataObj['u']
    })
  }

  useEffect(() => {
    if (!!window.localStorage.getItem(event?.url)) setSubscribed(true)
  }, [])

  const validatePhone = (number) => {
    const reg = new RegExp("\\+[0-9]*");
    return reg.test(number)
  };

  const FORM = () => {
    if (subscribed) return (<div>
      <Chip color="success" label={localization["already"]} />
      {event?.tickets && (<Button sx={{ marginTop: 1 }} fullWidth variant="outlined" target="_blank" href={event?.tickets}>{localization["buy"]}</Button>)}
    </div>)
    return <form onSubmit={handleOnSubmit} action="https://purizu.us10.list-manage.com/subscribe/post" method="POST" style={{ display: 'flex', flexDirection: 'column' }} target="dummyframe">
      {event?.ungatedTicket && (<Button sx={{ marginY: 2 }} fullWidth variant="outlined" target="_blank" href={event?.tickets}>{localization["buy"]}</Button>)}
      {event?.ungatedTicket && <p>{localization['or']}</p>}
      <input type="hidden" name="u" value="eef41a522049e21e6befd040e" />
      <input type="hidden" name="id" value="80a6fc44a4" />
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap' }}>
        <TextField fullWidth sx={{ marginY: 1 }} required label={localization["email"]} type="email" autocapitalize="none" autocorrect="off" name="MERGE0" size="25" placeholder="youremail@gmail.com" />
        <TextField fullWidth sx={{ marginY: 1 }} required label={localization["name"]} type="text" name="MERGE1" size="25" />
        <TextField fullWidth sx={{ marginY: 1 }} required label={localization["phone"]} error={invalidPhone} type="text" name="MERGE4" size="25" helperText={localization["phone-helper"]} />
      </div>
      <input type="hidden" name="MERGE2" id="MERGE2" size="25" value={event?.url}></input>
      <Button type="submit" sx={{ marginTop: 1 }} fullWidth variant="outlined">{localization["register"]}</Button>
    </form>
  }

  const heroContent = <Image width={1080} height={1920} customStyles={{ width: '100%', height: 'auto' }} eager={true} video={event?.video?.url} videoMp4={event?.videoMp4?.url} shim={event?.placeholderUrl} placeholder={event?.placeholder?.url}  className="a3" alt={title + " image"} src={event?.flier?.url + "?fm=webp"} />


  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:site_name" content="DreamPip" />
        <meta property="og:url" content={url} />
        <meta property="og:description" content={`${localization['when']}: ${localWhen}, ${localization['country']}: ${country}, ${localization['city']}: ${event?.city}, ${localization['artists']}: ${artists}` || "Upstreaming. 📡"} />
        <meta name="description" content={`${localization['when']}: ${localWhen}, ${localization['country']}: ${country}, ${localization['city']}: ${event?.city}, ${localization['artists']}: ${artists}` || "Upstreaming. 📡"} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={(event?.image?.url || "https://www.dreampip.com/og-image.png") + "?fm=jpg&w=512"}
        />
        <meta
          property="twitter:image"
          content={(event?.image?.url || "https://www.dreampip.com/og-image.png") + "?fm=jpg&w=512"}
        />
        <meta
          property="og:image:secure_url"
          content={(event?.image?.url || "https://www.dreampip.com/og-image.png") + "?fm=jpg&w=512"}
        />
        <meta property="og:image:type" content="image/jpeg" />
        <link rel="canonical" href={url} />
        <link rel="alternate" hrefLang="x-default" href={`https://www.dreampip.com/event/${event?.url}`} />
        {Object.keys(localeMap).map((locale) => {
          return <link key={locale} rel="alternate" hrefLang={locale} href={`https://www.dreampip.com/${locale}/event/${event?.url}`} />
        })}
        <script type="application/ld+json">
          {event?.structuredData}
        </script>
      </Head>
      <article className="content content-single">
        <iframe name="dummyframe" id="dummyframe" style={{ display: 'none' }}></iframe>
        {isNow(event?.date, event?.end) && (
          <Hero
            title={"Loading live stream..."}
          />
        )}
        {event?.title && (
          <section style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#1a1a1a", flexWrap: "wrap", padding: "32px" }}>
            <section className="a3" style={{ maxHeight: '100%', flexBasis: '33.333%', flexGrow: 1, maxWidth: '500px', position: 'relative', alignSelf: "flex-start" }} >
              {heroContent}
            </section>
            <TitleWrapper>
              <section>
                <h1 style={{ fontWeight: "300", color: "white" }}>{event?.title}</h1>
                {!!countdownString ? (
                  <p style={{ color: "white", height: 32, marginBottom: "16px", marginTop: "16px", display: 'flex', flexWrap: 'wrap', height: '100%', alignItems: 'center' }}>{localization["countdown"]}: {countdownString + " "}
                    <Button sx={{ marginY: "4px" }} startIcon={<EventIcon />} onClick={downloadEventCalendar}>{localization["calendar"]}</Button>
                  </p>
                ) : !isPast(event?.date) ? (<Skeleton variant="rectangular" width="100%" height={32} sx={{ marginY: 2 }} />) : undefined}
                {!isPast(event?.date) && FORM()}
              </section>
              <section>
                {event?.photosCollection?.items?.length > 0 && (
                  <>
                    <hr />
                    <p style={{ color: "white" }}><strong>{localization["photos"]}:</strong></p>
                    <ShowGrid {...{ items: event?.photosCollection?.items, locale, onClick: setSelectedPhoto }} />
                    <Modal
                      open={!!selectedPhoto}
                      onClose={() => { setSelectedPhoto("") }}
                      aria-labelledby="envent-photo-modal"
                      aria-describedby="event-photo-modal"
                    >
                      <PhotoWrapper style={{ ...modalStyle, position: 'relative', outline: "none" }}>
                        <Image fill className="landscape" alt="Event photo expanded" src={selectedPhoto + "?fm=webp"} />
                      </PhotoWrapper>
                    </Modal>
                  </>
                )}
              </section>
              <section>
                {event?.episodesCollection?.items?.length > 0 && (
                  <>
                    <hr />
                    <p style={{ color: "white" }}><strong>{localization["episodes"]}:</strong></p>
                    <ShowGrid {...{ items: event?.episodesCollection?.items, locale, directory: '/episode' }} />
                  </>
                )}
              </section>
              <section>
                <hr />
                {
                  !!artists && (
                    <p><strong>{localization["artists"]}</strong>: <span>{artists}</span></p>
                  )
                }
                {
                  !!country && (
                    <p><strong>{localization["country"]}</strong>: <span>{country}</span></p>
                  )
                }
                {
                  !!event?.city && (
                    <p><strong>{localization["city"]}</strong>: <span>{event?.city}</span></p>
                  )
                }
                {
                  !!when && (
                    <p><strong>{localization["when"]}</strong>: <span suppressHydrationWarning>{when}</span></p>
                  )
                }
                {
                  !!localWhen && (
                    <p><strong>{localization["local"]}</strong>: <span suppressHydrationWarning>{localWhen}</span></p>
                  )
                }
              </section>
              <section style={{ color: "white" }}>
                <hr />
                {/* eslint-disable-next-line react/no-danger */}
                {documentToReactComponents(event?.body?.json, renderOptions(event?.body?.links))}
              </section>
              <section>
                {event?.warmUpCollection?.items?.length > 0 && (
                  <>
                    <hr />
                    <p style={{ color: "white" }}><strong>{localization["related"]}:</strong></p>
                    <ShowGrid {...{ items: event?.warmUpCollection?.items, locale, directory: '/episode' }} />
                  </>
                )}
              </section>
              {!isPast(event?.date) && FORM()}
              <hr style={{ marginBottom: "32px" }} />
              <Link href="/events" style={{ color: "white" }}>{localization["back"] + '.'}</Link>
            </TitleWrapper>
          </section>
        )}
      </article>
    </>
  );
}

export async function getStaticProps({ params, preview = false, locale }) {
  const source = await getEvent(params.slug, preview, locale)
  const data = source?.event
  if (!data) {
    return {
      notFound: true
    }
  }
  const newData = await addPlaceholders(data)

  return {
    props: {
      preview,
      event: newData ?? null,
    },
  }
}

export async function getStaticPaths() {
  const episodes = await getEvents()

  return {
    paths: episodes?.map(({ url }) => `/event/${url}`) ?? [],
    fallback: 'blocking'
  }
}

Event.getLayout = function getLayout(page) {
  return (
    <Template>
      {page}
    </Template>
  )
}