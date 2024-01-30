
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useState } from 'react';
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { Template } from '../../templates';
import { MAP_CENTRES, TIMEFRAMES, localeMap } from '../../lib/constants';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';
import Calendar from '../../components/Calendar';
import { getAllPages, getCalData, getPage } from '../../lib/api';
import { Box, Button, Checkbox, FormControl, IconButton, Input, MenuItem, Select, Snackbar, Switch } from '@mui/material';
import { InputLabel, ListItemText } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { EventLocale } from '../../locale';
import { checkAgenda, pzTrack } from '../../lib/helpers';
import styled from 'styled-components';
import VideoPlayer from '../../components/VideoPlayer';
import { AppContext } from '../../context';
import CloseIcon from '@mui/icons-material/Close';


const Controls = styled.div`
 display: flex;
 flex-direction: column;
 
 @media screen and (min-width: 768px) {
   flex-direction: row;
   display: block;
 }
`

const renderOptions = (content, params) => {
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

        if (entry.__typename === "Calendars") {
          return (
            <Calendar mode={params?.mode} mapData={params?.mapData} calData={params?.calData} city={params?.city} calendar={params?.calendar} timeframe={params?.timeframe} />
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
                <VideoPlayer
                  slug={entry.url}
                />
              )}
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

const useStyles = makeStyles((theme) => ({
  font: {
    textDecoration: 'none',
    fontStyle: 'italic',
  },
}));

export default function Page({ page, agenda, generatedIn, cal }) {
  const context = useContext(AppContext)
  const { setContext, agendaData, agendaCities, setAgendaData, setAgendaCities } = context
  const { url: slug, title: metaTitle, description, metaImage, content } = page
  const { city: serverCity, where, zoom, center } = cal
  if (!agenda?.calData || !agenda.mapData) return
  const { locale: orig, pathname, query } = useRouter()
  const city = serverCity.toLowerCase() || query?.slug || 'global'
  const classes = useStyles();
  // const [calData, setCalData] = useState(agendaData?.calData || agenda.calData)
  // const [mapData, setMapData] = useState(agendaData?.mapData || agenda.mapData)
  // const [cities, setCities] = useState(agendaCities || [city])
  const [cities, setCities] = useState(agendaCities?.length ? agendaCities : [city])
  const [mapMode, setMapMode] = useState('space')
  const [ctaOpen, setCtaOpen] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState('W')
  const [lastUpdate, setLastUpdate] = useState(undefined)
  const locale = orig === "default" ? "en" : orig

  const [selectedFacets, setSelectedFacets] = useState({ cities });

  const handleClick = () => {
    pzTrack("INTENT: ADD TO CALENDAR")
    window.open('https://www.remometro.com/chat')
  }
  const handleClose = () => {
    setCtaOpen(false)
  }

  const toggleFacetOption = (facetName, option) => {
    setSelectedFacets(prev => {
      return { ...prev, [facetName]: option };
    });
  };

  const terms = useMemo(() => {
    let names = new Set()
    agendaData?.calData?.forEach((event) => {
      event?.terms.forEach((term) => {
        names.add(term)
      })
    })
    return [...names.values()]
  }, [JSON.stringify(agendaData?.mapData), selectedTimeframe, cities])

  useEffect(() => {
    let newTerms = selectedFacets?.terms
    if (selectedFacets?.terms?.length) {
      newTerms = selectedFacets?.terms?.reduce((acc, term) => {
        if (terms?.includes(term)) return [...acc, term]
        else return acc
      }, []) || selectedFacets?.terms || []
    }
    if (agendaCities?.length) {
      setCities(agendaCities)
      setSelectedFacets({ ...selectedFacets, terms: newTerms, cities: agendaCities })
    }
  }, [terms, cities])

  const fetchNewData = async () => {
    if (setContext) {
      const res = await checkAgenda({ timeframe: selectedTimeframe, cities: selectedFacets.cities })
      setContext({ ...context, agendaData: res, agendaCities: selectedFacets.cities })
      setLastUpdate(new Date().toISOString())
    }
  }

  useEffect(() => {
    if (!agendaCities && !agendaData) return
    const now = new Date().getTime()
    const delta = now - new Date(lastUpdate || generatedIn).getTime()
    const needsRefreshing = delta >= (5 * 60 * 1000)
    if ((lastUpdate && needsRefreshing) || (selectedTimeframe !== agendaData?.timeframe) || (!agendaData?.calData && city !== 'global')) {
      if ((cities?.length && !agendaData?.calData)) {
        fetchNewData()
      } else {
        setContext({ ...context, agendaCities: cities })
      }
    }
  }, [setContext])

  useEffect(() => {
    if (selectedFacets?.cities?.length && (city !== 'global')) {
      fetchNewData()
    } else {
      if (city === 'global' && !(selectedFacets?.cities?.length || !agendaCities.length)) {
        setContext({ ...context, agendaCities: [], agendaData: { calData: [], mapData: {...agendaData.mapData, features: []}} })
      }
    }
  }, [JSON.stringify(selectedFacets?.cities)])

  const facetedCalData = useMemo(() => {
    if (!agendaData?.calData?.length) return []
    if (!selectedFacets["terms"]?.length) return agendaData?.calData
    const filtered = agendaData?.calData.filter(event => {
      const assertion2 = Object.entries(selectedFacets).some(
        ([facet, options]) => {
          const assertionTerms = options.length === 0 || options.some((option) => event?.terms?.includes(option))
          const assertionCities = mapMode === 'space' || options?.length === 0 || options.some((option) => selectedFacets?.cities?.includes(event?.city) || option === 'global' || cities.includes('global'))
          return assertionTerms && assertionCities
        }
      )
      return assertion2
    }
    );
    return filtered
  }, [JSON.stringify(selectedFacets?.terms), JSON.stringify(selectedFacets?.cities), JSON.stringify(agendaData), lastUpdate])

  const facetedMapData = useMemo(() => {
    let collection = { ...agendaData?.mapData }
    if (!agendaData?.mapData?.features?.length) return collection
    if (!selectedFacets) return collection
    if (!selectedFacets["terms"]?.length) return collection
    if (!selectedFacets["cities"]?.length) return collection
    const filtered = agendaData?.mapData.features.filter(event => {
      const assertion2 = Object.entries(selectedFacets).some(
        ([facet, options]) => {
          const assertionTerms = options?.length === 0 || options.some((option) => event?.properties?.terms?.includes(option))
          const assertionCities = mapMode === 'space' || options?.length === 0 || options.some((option) => selectedFacets?.cities?.includes(event.properties.city) || option === 'global' || cities.includes('global'))
          return assertionTerms && assertionCities
        }
      )
      return assertion2
    }
    );
    collection.features = filtered

    return collection
  }, [JSON.stringify(selectedFacets?.terms), JSON.stringify(selectedFacets?.cities), JSON.stringify(agendaData?.mapData), lastUpdate])

  useEffect(() => {
    if (setContext) {
      setContext({ ...context, facetedAgenda: { mapData: facetedMapData, calData: facetedCalData } })
    }
  }, [JSON.stringify(facetedCalData), JSON.stringify(facetedMapData), lastUpdate])


  const image = metaImage?.url
  const title = `Remometro — ${metaTitle}`

  const actualSlug = query?.slug ? slug : 'agenda'

  const url = `https://www.remometro.com${orig !== 'default' ? `/${locale}` : ''}/${actualSlug}`

  const localization = EventLocale[locale] || EventLocale["default"]

  const parsed = documentToReactComponents(content?.json, renderOptions(content?.links, { mode: mapMode, mapData: facetedMapData, calData: facetedCalData, city: city?.toLowerCase(), calendar: cal, timeframe: selectedTimeframe }))
  const snippet = documentToPlainTextString(content?.json).substring(0, 252) + "..."

  const label = { inputProps: { 'aria-label': localization[mapMode] } };

  const toggleMode = () => {
    const newMode = mapMode === 'space' ? 'time' : 'space'
    if (newMode === 'time') {
      setContext({...context, agendaCities: [city], agendaData: agenda})
      setCities([city])
      setSelectedTimeframe('Q')
    } else {
      setSelectedTimeframe('W')
    }
    setMapMode(newMode)
  }

  const action = (
    <div>
      <Button size="small" onClick={handleClick} sx={{ color: 'black' }} color="primary">
        {localization['sendEmail']}
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        onClick={handleClose}
        color='primary'
        sx={{ color: 'black' }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </div>
  );


  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:site_name" content="Remometro" />
        <meta property="og:url" content={url} />
        <meta property="og:description" content={description || snippet} />
        <meta name="description" content={description || snippet} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={image || "https://www.remometro.com/og-image.png" + "?fm=jpg&w=512"}
        />
        <meta
          property="og:image:secure_url"
          content={image || "https://www.remometro.com/og-image.png" + "?fm=jpg&w=512"}
        />
        <meta
          property="twitter:image"
          content={image || "https://www.remometro.com/og-image.png" + "?fm=jpg&w=512"}
        />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <link rel="canonical" href={url} />
        <link rel="alternate" hrefLang="x-default" href={`https://www.remometro.com/${actualSlug}`} />
        {Object.keys(localeMap).map((locale) => {
          return <link key={locale} rel="alternate" hrefLang={locale} href={`https://www.remometro.com/${locale}/${actualSlug}`} />
        })}
      </Head>
      <article className="content-page">
        <Controls style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: "#1a1a1a", color: "white", textAlign: 'center', padding: '16px', fontSize: '12px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '16px' }}>
            <InputLabel id="mode" className={classes.font}>{localization.mode}</InputLabel>
            <FormControl sx={{ justifyContent: 'center', alignItems: 'center', marginX: '16px' }}>
              <Switch id="mode" {...label} onClick={toggleMode} />{mapMode === 'space' ? localization['space'] : localization['time']}
            </FormControl>
          </Box>
          <FormControl sx={{ width: "300px", marginY: ["16px", null, null, 0], marginX: '16px' }}>
            <InputLabel id="terms" className={classes.font}>{localization.terms}</InputLabel>
            <Select
              labelId="terms"
              id="terms"
              multiple
              value={selectedFacets["terms"] || []}
              label={localization.terms} // Label for the form control
              renderValue={(selected) => {
                return selected.map((term) => term).join(', ')
              }} // Display selected values
              onChange={(e) => {
                const value = e?.target?.value;
                toggleFacetOption('terms', value);
              }}
              input={<Input label={localization.terms} />} // Input label
            >
              {/* Mapping through the available countries */}
              {terms && [...terms].map((name) => (
                <MenuItem
                  key={`${name}-${locale}`}
                  value={name}
                >
                  {/* Checkbox and country name */}
                  <Checkbox checked={selectedFacets['terms']?.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>

          </FormControl>
          {mapMode === 'space' ? (
            <FormControl sx={{ width: "300px", marginY: ["16px", null, null, 0], marginX: '16px' }}>
              <InputLabel id="timeframe" className={classes.font}>{localization.timeframe}</InputLabel>
              <Select
                labelId="timeFrame"
                id="timeFrame"
                value={selectedTimeframe}
                label={localization.timeframe} // Label for the form control
                onChange={(e) => {
                  const value = e?.target?.value;
                  setSelectedTimeframe(value);
                }}
                input={<Input label={localization.timeframe} />} // Input label
              >
                {/* Mapping through the available countries */}
                {Object.keys(TIMEFRAMES).map((name) => (
                  <MenuItem
                    key={`${name}-${locale}`}
                    value={name}
                  >
                    {/* Checkbox and country name */}
                    {/* <Checkbox checked={selectedcountries.indexOf(name) > -1} /> */}
                    <ListItemText primary={localization[name]} />
                  </MenuItem>
                ))}
              </Select>

            </FormControl>
          ) : (
            <FormControl sx={{ width: "300px", marginY: ["16px", null, null, 0], marginX: '16px' }}>
              <InputLabel id="cities" className={classes.font}>{localization.city}</InputLabel>
              <Select
                labelId="cities"
                id="cities"
                multiple
                value={selectedFacets["cities"] || []}
                label={localization.terms} // Label for the form control
                renderValue={(selected) => selected.map((city) => MAP_CENTRES[city]?.city).join(', ')} // Display selected values
                onChange={(e) => {
                  const value = e?.target?.value;
                  toggleFacetOption('cities', value);
                }}
                input={<Input label={localization.city} />} // Input label
              >
                {/* Mapping through the available countries */}
                {Object.keys(MAP_CENTRES) && Object.values(MAP_CENTRES).filter((agenda) => agenda.slug).map((name) => (
                  <MenuItem
                    key={`${name.slug}-${locale}`}
                    value={name.slug}
                  >
                    {/* Checkbox and country name */}
                    <Checkbox checked={selectedFacets['cities']?.indexOf(name.slug) > -1} />
                    <ListItemText primary={name.city} />
                  </MenuItem>
                ))}
              </Select>

            </FormControl>
          )}
        </Controls>
        <section className='wrap content content-single'>
          {parsed}
        </section>
        <Snackbar
          open={ctaOpen}
          message={localization['ctaMessage']}
          position="bottom-center"
          action={action}
        />
      </article>
    </>
  );
}

export async function getStaticProps({ params, preview = false, locale }) {
  const slug = params?.slug ? params?.slug : 'global'
  const data = await getPage(`agenda/${slug}`, preview, locale)
  const cal = await getCalData(slug, preview, locale)

  const agenda = (await checkAgenda({ cities: slug || 'global' })) || {}

  if (!data?.page || !agenda || !cal?.cal) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      agenda,
      preview,
      generatedIn: new Date().toISOString(),
      page: data?.page,
      cal: cal?.cal
    },
  }
}

export async function getStaticPaths() {
  const pages = await getAllPages({})
  const agendas = pages?.filter(({ url }) => {
    return url.startsWith('agenda/') || url === 'agenda'
  })

  if (!agendas) return

  return {
    //paths: episodes?.map(({ url }) => `/episode/${url}`) ?? [],
    paths: agendas?.map(({ url }) => `/${url}`),
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