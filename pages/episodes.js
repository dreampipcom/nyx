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
  FormControlLabel,
  ListItemText,
  Button,
  Autocomplete,
  TextField,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { getHomeEpisodes } from '../lib/api';
import Head from 'next/head';
import { Template } from '../templates';
import { useRouter } from 'next/router';
import { ShowGrid } from '../components/ShowGrid';
import { EpisodeLocale } from '../locale';
import { localeMap } from '../lib/constants';
import { addPlaceholders } from '../lib/server-helpers';

const useStyles = makeStyles((theme) => ({
  font: {
    textDecoration: 'none',
    fontStyle: 'italic',
  },
}));

export default function Episodes({ episodes }) {
  const classes = useStyles();
  const context = useContext(AppContext);
  const { locale: orig } = useRouter();
  const locale = orig === "default" ? "en" : orig;
  const localization = EpisodeLocale[locale] || EpisodeLocale["default"];

  const url = `https://www.remometro.com/${orig !== 'default' ? `${locale}/` : ''}shows`
  const title = `Remometro — ${localization.episodes}`;
  const ogTitle = `${localization.episodes} — Remometro`;
  const ogDescription = localization.episodesDescription;
  const ogImageUrl = 'https://www.remometro.com/og-image.png'; // Replace with your actual image URL
  const defaultUrl = 'https://www.remometro.com/episodes';
  const canonicalUrl = url;

  const [genres, setGenres] = useState(new Set())
  const [artists, setArtists] = useState([])
  const [allArtists, setAllArtists] = useState(new Set())
  const [selectedArtist, setSelectedArtist] = useState("")
  const [selectedGenres, setSelectedGenres] = useState(context?.selectedGenres || [])
  const [onlyFeatured, setOnlyFeatured] = useState(context?.onlyFeatured || false)

  function addArtist(artist) {
    setAllArtists(allArtists?.add(artist))
  }

  const artistsOrig = (_episodes) => {
    setAllArtists(allArtists?.clear())
    setArtists([])
    _episodes?.forEach((episode) => {
      addArtist(episode?.artist?.name)
      episode?.artist?.aliases?.forEach((alias) => addArtist(alias))
      episode?.guestsCollection?.items?.forEach((guest) => addArtist(guest?.name))
      addArtist(episode?.title)
    })
    const namesArr = !!allArtists && [...allArtists.values()].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())).map((name) => ({ label: name })) || allArtistsMemo
    setArtists(namesArr)
  }

  const allArtistsMemo = useMemo(() => {
    const artists = new Set()
    episodes?.forEach((episode) => {
      artists.add(episode?.artist?.name)
      episode?.artist?.aliases?.forEach((alias) => artists.add(alias))
      episode?.guestsCollection?.items?.forEach((guest) => artists.add(guest?.name))
      artists.add(episode?.title)
    })
    const sorted = [...artists].sort().map((art) => ({ label: art }))
    return sorted
  }, [episodes])

  const allGenresMemo = useMemo(() => {
    const genres = new Set()
    episodes?.forEach((episode) => {
      episode?.genres?.forEach((genre) => {
        genres.add(genre)
      })
    })
    const sorted = [...genres].sort()
    return sorted
  }, [episodes])

  const feed = useMemo(() => {
    const parsed = episodes?.map((episode) => {
      const now = new Date()
      const episodeDate = new Date(episode.date)

      if (now < episodeDate) {
        return
      }

      return episode
    }).filter((e) => e).sort((a, b) => {
      return new Date(b?.date) - new Date(a?.date)
    })

    return parsed
  }, [episodes])

  const [filteredEpisodes, setFilteredEpisodes] = useState(feed)

  useEffect(() => {
    setFilteredEpisodes(feed)
  }, [feed])

  useEffect(() => {
    if (context?.setContext) context?.setContext({ ...context, onlyFeatured, selectedGenres, selectedArtist })
    handleFacet()
  }, [onlyFeatured, selectedGenres.length, selectedArtist, locale])

  const handleFacet = () => {
    let filtered = feed

    if (onlyFeatured) {
      setGenres(genres.clear())
      filtered = feed?.filter((episode) => {
        if (!!episode.featured) {
          episode.genres?.forEach((genre) => setGenres(genres.add(genre)))
          return true
        }
        return false
      })
    } else {
      [...allGenresMemo].forEach((genre) => setGenres(genres.add(genre)))
    }
    if (selectedGenres.length) {
      filtered = filtered?.filter((episode) => {
        return selectedGenres.some((genre) => episode.genres?.includes(genre))
      })
    }
    if (selectedArtist.length) {
      setGenres(genres.clear())

      const genCondition = (episode) => {
        return episode?.title?.toLowerCase().includes(selectedArtist) || episode?.artist?.name?.toLowerCase().includes(selectedArtist) || episode?.artist?.aliases?.some((alias) => alias.toLowerCase().includes(selectedArtist)) || episode?.guestsCollection?.items?.some((guest) => guest?.name?.toLowerCase().includes(selectedArtist))
      }

      // re-filter genres
      episodes?.forEach((episode) => {
        const condition = genCondition(episode)

        if (!!condition && ((onlyFeatured && episode.featured) || !onlyFeatured)) {
          episode?.genres?.forEach((genre) => setGenres(genres.add(genre)))
        }
      })

      // filter episodes
      filtered = filtered?.filter((episode) => {
        const condition = genCondition(episode)

        return condition
      })
    } else {
      [...allGenresMemo].forEach((genre) => setGenres(genres.add(genre)))
    }

    setFilteredEpisodes(filtered)
  }

  useEffect(() => {
    artistsOrig(filteredEpisodes)
  }, [filteredEpisodes])

  useEffect(() => {
    if (!genres) setGenres(new Set())
  }, [genres])

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={ogTitle} />
        <meta property="og:site_name" content="Remometro" />
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
            href={`https://www.remometro.com/${locale}/events`}
          />
        ))}
      </Head>
      <article className="content-page">
        <section style={{ backgroundColor: "#1a1a1a", color: "white", textAlign: 'center', padding: '16px', fontSize: '12px' }}>
          <FormControl sx={{ m: 1 }}>
            <FormControlLabel value={onlyFeatured} className={classes.font} control={<Checkbox type="checkbox" onChange={(e) => setOnlyFeatured(e?.target?.checked)} checked={onlyFeatured} style={{ marginRight: '8px' }} />} label={localization.featured}/>
          </FormControl>
          <FormControl sx={{ marginRight: 0, marginBottom: 3, '@media screen and (min-width: 768px)': { marginRight: 4, marginBottom: 0 } }}>
            <Autocomplete
              disablePortal
              id="artists-shows-filter"
              options={artists}
              freeSolo
              sx={{ width: 300 }}
              onChange={(e, input, reason) => {
                const value = input?.label || input || ""
                if (reason === 'clear') { setSelectedArtist("") }
                else { setSelectedArtist(value.toLowerCase()) }
              }}
              renderInput={(params) => <TextField variant="standard" {...params} label={localization['artistsShows']} />}
            />
          </FormControl>
          {!!genres ?
            <FormControl sx={{ width: "300px" }}>
              <InputLabel id="genres-label" className={classes.font}>{localization.genres}</InputLabel>
              <Select
                labelId="genres"
                id="genres"
                multiple
                value={selectedGenres}
                label={localization.genres}
                renderValue={(selected) => selected.join(', ')}
                onChange={(e) => {
                  const value = e?.target?.value
                  setSelectedGenres(typeof value === 'string' ? value.split(',') : value)
                }}
                input={<Input label={localization.genres} />}
              >
                {[...genres].map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                  >
                    <Checkbox checked={selectedGenres.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl> : null}
          <FormControl sx={{ m: 1 }}>
            <Button onClick={() => {
              setSelectedGenres([])
              setOnlyFeatured(false)
              setSelectedArtist("")
            }}>{localization['reset']}</Button>
          </FormControl>
        </section>
        <ShowGrid even {...{ items: filteredEpisodes, locale, directory: '/episode' }} />
      </article>
    </>

  );
}

export async function getStaticProps({ params, preview = false }) {
  const data = await getHomeEpisodes(100, false)

  const newData = await addPlaceholders(data)

  return {
    props: {
      preview,
      episodes: newData ?? null,
    },
  }
}

export const maxDuration = 30;

Episodes.getLayout = function getLayout(page) {
  return (
    <Template>
      {page}
    </Template>
  )
}