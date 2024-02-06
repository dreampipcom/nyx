import { useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { AppContext } from '../context';
import {
  Select,
  MenuItem,
  Checkbox,
  Input,
  InputLabel,
  FormControl,
  ListItemText,
  Button,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { getEvents } from '../lib/api';
import Head from 'next/head';
import { Template } from '../templates';
import { useRouter } from 'next/router';
import { localeMap } from '../lib/constants';
import { addLocaleData, getCountry } from '../lib/intl-locales';
import { ShowGrid } from '../components/ShowGrid';
import { EventLocale } from '../locale';
import { addPlaceholders } from '../lib/server-helpers';

const EventsWrapper =styled.div`
display: grid;
grid-template-columns: 1fr;

@media screen and (min-width: 375px) {
  grid-template-columns: 1fr 1fr;
}

@media screen and (min-width: 768px) {
  grid-template-columns: 1fr 1fr 1fr;
}

@media screen and (min-width: 1280px) {
  grid-template-columns: 1fr 1fr 1fr 1fr;
}
`

const Event = styled.div`
position: relative;
overflow: hidden;

height: 100%;
width: 100%;

${(props) => {
  if (props.past) {
    return `
    &:after {
      content: "";
      background-color: rgba(0,0,0,0.7);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1;
      height: 100%;
    }`
  }
}}

&:hover:after {
  content: "";
  background-color: rgba(0,0,0,0.2);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  height: 100%;
  cursor: pointer;
}
`

const useStyles = makeStyles((theme) => ({
  font: {
    textDecoration: 'none',
    fontStyle: 'italic',
  },
}));

const getDefaultCountries = (events) => {
  const allCountriesSet = new Set(events?.map((event) => event?.country || "Worldwide"));
  return allCountriesSet;
};

export default function Events({ events }) {
  const classes = useStyles();
  const context = useContext(AppContext);
  const { locale: orig } = useRouter();
  const locale = orig === "default" ? "en" : orig;
  const localization = EventLocale[locale] || EventLocale["default"];

  const url = `https://www.dreampip.com/${orig !== 'default' ? `${locale}/` : ''}events`

  const title = `Dream, Vibe, ...Pip! — ${localization.events}`;
  const ogTitle = `${localization.events} — Dream, Vibe, ...Pip!`;
  const ogDescription = localization.eventsDescription;
  const ogImageUrl = 'https://www.dreampip.com/og-image.png'; // Replace with your actual image URL
  const defaultUrl = 'https://www.dreampip.com/events';
  const canonicalUrl = url;


  const [allcountries, setAllcountries] = useState(getDefaultCountries(events));
  const [selectedcountries, setSelectedcountries] = useState(context?.selectedcountries || []);
  const [onlyFeatured, setOnlyFeatured] = useState(context?.onlyFeatured || false);
  const feed = useMemo(() => {
    const parsed = events?.filter((event) => {
      return event;
    }).sort((a, b) => new Date(b?.date) - new Date(a?.date));

    return parsed;
  }, [context?.events, events]);

  const [filteredevents, setFilteredevents] = useState(feed);

  useEffect(() => {
    setFilteredevents(feed);
  }, [feed]);

  useEffect(() => {
    if (context?.setContext) context?.setContext({ ...context, onlyFeatured, selectedcountries });
    handleFacet();
  }, [onlyFeatured, selectedcountries.length]);

  const handleFacet = () => {
    let filtered = feed;

    if (onlyFeatured) {
      filtered = feed?.filter((event) => {
        filtered = feed?.filter((event) => event?.featured);
      });
    }

    if (selectedcountries.length) {
      filtered = filtered?.filter((event) => selectedcountries.includes(event?.country));
    }

    setFilteredevents(filtered);
  };

  useEffect(() => {
    addLocaleData(locale)
  },[])

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={ogTitle} />
        <meta property="og:site_name" content="DreamPip" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:description" content={ogDescription} />
        <meta name="description" content={ogDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:secure_url" content={ogImageUrl} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hrefLang="x-default" href={defaultUrl} />
        {Object.keys(localeMap).map((locale) => (
          <link
            key={locale}
            rel="alternate"
            hrefLang={locale}
            href={`https://www.dreampip.com/${locale}/events`}
          />
        ))}
      </Head>
      <article className="content-page">
        <section style={{ backgroundColor: "#1a1a1a", color: "white", textAlign: 'center', padding: '16px', fontSize: '12px' }}>
          <FormControl sx={{ minWidth: "300px" }}>
            <InputLabel id="countries" className={classes.font}>{localization.countries}</InputLabel>
            <Select
              labelId="countries"
              id="countries"
              multiple
              value={selectedcountries}
              label={localization.countries} // Label for the form control
              renderValue={(selected) => selected.map((country) => getCountry(country, locale)).join(', ')} // Display selected values
              onChange={(e) => {
                const value = e?.target?.value;
                setSelectedcountries(typeof value === 'string' ? value.split(',') : value);
              }}
              input={<Input label={localization.countries} />} // Input label
            >
              {/* Mapping through the available countries */}
              {[...allcountries].map((name) => (
                <MenuItem
                  key={`${name}-${locale}`}
                  value={name}
                >
                  {/* Checkbox and country name */}
                  <Checkbox checked={selectedcountries.indexOf(name) > -1} />
                  <ListItemText primary={getCountry(name, locale)} />
                </MenuItem>
              ))}
            </Select>

          </FormControl>
          <FormControl sx={{ m: 1 }}>
            <Button onClick={() => {
              setSelectedcountries([]);
              setOnlyFeatured(false);
            }}>{localization.reset}</Button>
          </FormControl>
        </section>
        <ShowGrid even {...{ items: filteredevents, locale, directory: '/event', past: true }} />
      </article>
    </>
  );
}

export async function getStaticProps({ params, preview = false }) {
  // Fetch events
  const data = await getEvents();

  const newData = await addPlaceholders(data)

  return {
    props: {
      preview,
      events: newData ?? null,
    },
  }
}

export const maxDuration = 30;

Events.getLayout = function getLayout(page) {
  return (
    <Template>
      {page}
    </Template>
  )
}
