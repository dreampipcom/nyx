import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';
import { generateTheme } from '../scss/theme'
import { Footer, Header } from '../components';
import { AppContext } from '../context';
import GlobalStyle from '../scss/global'
import { useRouter } from 'next/router';
import { Box } from '@mui/material';
import { Comfortaa } from 'next/font/google';
import dynamic from 'next/dynamic'
import { useFirstInteraction } from '../hooks/useFirstInteraction';
import Bugsnag from '@bugsnag/js';

const GlowReact = dynamic(() =>
  import('../components/GlowReact').then((mod) => mod)
)

const comfortaa = Comfortaa({ subsets: ['latin'], display: 'swap' })

export const theme = generateTheme({ fontFamily: comfortaa.style.fontFamily })

export function Template({ children }) {
  const { locale: orig, pathname } = useRouter()
  const locale = orig === "default" ? "en" : orig
  const [rootContext, setRootContext] = useState({ locale })
  const [rootAgenda, setRootAgenda] = useState({})
  const [rootCities, setRootCities] = useState([])
  const [loadGlow, setLoadGlow] = useState("")

  useEffect(() => {
    function getQueryVariable(variable) {
      try {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
          var pair = vars[i].split('=');
          if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
          }
        }
      } catch (e) {
        Bugsnag.notify(e)
      }
    }
    const mobileApp = getQueryVariable('mobileApp')
    const nextImage = getQueryVariable('nextImage')

    if (!rootContext?.setContext) {
      setRootContext({
        ...rootContext,
        setContext: setRootContext,
        agendaData: rootAgenda,
        agendaCities: rootCities,
        facetedAgenda: {},
        setAgendaData: setRootAgenda,
        setAgendaCities: setRootCities,
        mobileApp: !!mobileApp,
        nextImage: !!nextImage,
        consent: undefined,
        reconsent: undefined,
        episode: undefined
      })
    }
  }, []);

  useFirstInteraction(() => {
    setLoadGlow(true)
  }, [], [true], [loadGlow !== ""])

  return (
    <div suppressHydrationWarning className={comfortaa.className}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Head>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <CssBaseline />
        <AppContext.Provider value={rootContext}>
          {!rootContext.mobileApp && (<Header title="DreamPip" description="Upstreaming. 📡" />)}
          <main className={"thebigbody"} sx={{ minHeight: !!rootContext.mobileApp ? pathname === '/chat' ? 'calc(100vh - 64px)' : '100vh' : 'initial' }}>
            {children}
          </main>
          <Footer />
          {loadGlow ? <GlowReact locale={locale} /> : undefined}
        </AppContext.Provider>
      </ThemeProvider>
    </div >
  );
}
