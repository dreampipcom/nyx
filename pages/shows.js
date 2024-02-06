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
import { getShows } from '../lib/api';
import Head from 'next/head';
import { Template } from '../templates';
import { useRouter } from 'next/router';
import { ShowGrid } from '../components/ShowGrid';
import { ShowLocale } from '../locale';
import { localeMap } from '../lib/constants';
import { addLocaleData, getCountry } from '../lib/intl-locales';
import { addPlaceholders } from '../lib/server-helpers';

const useStyles = makeStyles((theme) => ({
  font: {
    textDecoration: 'none',
    fontStyle: 'italic',
  },
}));

export default function Shows(props) {
  const { shows } = props;
  const classes = useStyles();
  const context = useContext(AppContext);
  const { locale: orig, pathname, isFallback } = useRouter()
  const locale = orig === "default" ? "en" : orig

  const url = `https://www.dreampip.com/${orig !== 'default' ? `${locale}/` : ''}shows`

  const localization = ShowLocale[locale] || ShowLocale["default"]

  const title = `Dream, Vibe, ...Pip! — ${localization.shows}`;
  const ogTitle = `${localization.shows} — Dream, Vibe, ...Pip!`;
  const ogDescription = localization.showsDescription;
  const ogImageUrl = 'https://www.dreampip.com/og-image.png'; // Replace with your actual image URL
  const defaultUrl = 'https://www.dreampip.com/shows';
  const canonicalUrl = url;

  const [allcountries, setAllcountries] = useState(new Set());
  const [selectedcountries, setSelectedcountries] = useState(context?.selectedcountries || []);
  const [onlyFeatured, setOnlyFeatured] = useState(context?.onlyFeatured || false);

  useEffect(() => {
    addLocaleData(locale)
    const allCountriesSet = new Set(shows?.map((show) => show?.country || "Worldwide"));
    setAllcountries(allCountriesSet);
  }, []);

  const feed = useMemo(() => {
    const parsed = shows?.filter((show) => {
      return show;
    }).sort((a, b) => new Date(b?.date) - new Date(a?.date));

    return parsed;
  }, [context?.shows, shows]);

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
      filtered = feed?.filter((show) => {
        if (!!show?.featured) {
          return true;
        }
        return false;
      });
    }

    if (selectedcountries.length) {
      filtered = filtered?.filter((show) => selectedcountries.includes(show?.country));
    }

    setFilteredevents(filtered);
  };

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
            href={`https://www.dreampip.com/${locale}/shows`}
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
              label="countries"
              renderValue={(selected) => selected.map((country) => getCountry(country, locale)).join(', ')}
              onChange={(e) => {
                const value = e?.target?.value
                setSelectedcountries(typeof value === 'string' ? value.split(',') : value)
              }}
              input={<Input label="countries" />}
            >
              {[...allcountries].map((name) => (
                <MenuItem
                  key={`${name}-${locale}`}
                  value={name}
                >
                  <Checkbox checked={selectedcountries.indexOf(name) > -1} />
                  <ListItemText primary={getCountry(name, locale)} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1 }}>
            <Button onClick={() => {
              setSelectedcountries([])
              setOnlyFeatured(false)
            }}>{localization.reset}</Button>
          </FormControl>
        </section>
        <ShowGrid even {...{ items: filteredevents, locale, directory: '/show' }} />
      </article>
    </>
  );
}

export async function getStaticProps({ params, preview = false }) {
  const data = await getShows()

  const newData = await addPlaceholders(data)

  return {
    props: {
      preview,
      shows: newData ?? null,
    },
  }
}

export const maxDuration = 30;

Shows.getLayout = function getLayout(page) {
  return (
    <Template>
      {page}
    </Template>
  )
}
