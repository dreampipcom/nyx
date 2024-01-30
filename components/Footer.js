import Image from '../components/ImageBlock';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AppContext } from '../context';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useRouter } from 'next/router';
import { setCookie } from '../lib/helpers';
import { HeaderLocale } from '../locale';
import Link from 'next/link';

const Social = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  justify-self: self-end;
  margin: 24px;
  & img {
    max-height: 32px;

    margin-left: 4px;
  }
`

const Apps = styled.section`
  display: none;
  justify-content: center;
  @media screen and (min-width: 768px) {
    display: flex;
    justify-content: space-between;
  }
  width: 250px;
  margin: 24px;
`

const Wrapper = styled.div`
  display: flex;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex-wrap: wrap;

  @media screen and (min-width: 768px) {
    place-items: center;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
`

function Footer({ copyrightHolder = 'Company Name' }) {
  const year = new Date().getFullYear();
  const context = useContext(AppContext);
  const [locale, setLocale] = useState(context?.locale)
  const router = useRouter()

  const localization = HeaderLocale[locale] || HeaderLocale["default"]

  const [hasPlayer, setHasPlayer] = useState(false)

  useEffect(() => {
    if(context?.episode?.mixcloud) {
      setHasPlayer(true)
    } else {
      setHasPlayer(false)
    }
  }, [JSON.stringify(context?.episode)])

  const handleChange = (e) => {
    const value = e.target.value

    if (value !== context?.locale) {
      context.setContext({ ...context, locale: value })
      setLocale(value)
      router.push({ pathname: router.pathname, query: router.query }, router.asPath, { locale: value })
      setCookie("NEXT_LOCALE", value, 90)
    }
  }

  return (
    <>
      {(hasPlayer || !!context.mobileApp) && (
        <section key={`${context?.episode?.mixcloud}+${!!context.mobileApp}`} style={{ bottom: 0, position: "sticky", bottom: 0, zIndex: 3, backgroundColor: '#1a1a1a' }}>
          {hasPlayer && (
            <iframe key={context?.episode?.mixcloud} width="100%" style={{ marginBottom: "-9px" }} height="60" src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&hide_artwork=1&feed=%2Fremometro%2F${encodeURIComponent(context.episode?.mixcloud?.split('/purizu/')[1])}`} frameBorder="0" ></iframe>
          )}
          <div style={{ display: !!context?.mobileApp ? 'flex' : 'none', justifyContent: 'center', padding: '8px' }}>
            <FormControl sx={{ w: 200 }} variant="standard">
              <InputLabel id="locale-switcher">{localization["locale"]}</InputLabel>
              <Select
                labelId="locale-switcher"
                id="locale"
                value={locale}
                label="Locale"
                onChange={handleChange}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="it-it">Italiano</MenuItem>
                <MenuItem value="pt-br">Português</MenuItem>
                <MenuItem value="es-es">Español</MenuItem>
                <MenuItem value="ro">Română</MenuItem>
                <MenuItem value="de-de">Deutsch</MenuItem>
                <MenuItem value="fr-fr">Français</MenuItem>
                <MenuItem value="pl-pl">Polski</MenuItem>
                <MenuItem value="cs-cz">Český</MenuItem>
                <MenuItem value="sv-se">Svenska</MenuItem>
                <MenuItem value="et-ee">Eesti</MenuItem>
                <MenuItem value="ja-jp">日本語</MenuItem> 
              </Select>
            </FormControl>
          </div>
        </section>
      )}

      {!context.mobileApp && (
        <footer className='content-page' style={{ paddingBottom: '32px' }}>
          <div className="wrap" style={{ height: '100%' }}>
            <Wrapper>
              <section style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                flexDirection: 'column',
                justifySelf: 'self-start',
              }}>
                <Link href="/privacy" style={{ fontSize: '12px', color: 'white', marginTop: '24px', justifySelf: 'self-start' }}>{`© 2012-${year} Purizu D.I. Angelo Reale`}</Link>
                <span style={{ display: 'block', fontSize: '12px', color: 'white', justifySelf: 'self-start', lineHeight: '16px' }}>VAT: IT02925300903</span>
                <span style={{ display: 'block', fontSize: '12px', color: 'white', justifySelf: 'self-start', lineHeight: '16px' }}>REA: 572763</span>
                <span style={{ display: 'block', fontSize: '12px', color: 'white', justifySelf: 'self-start', lineHeight: '16px' }}>SIAE License: 202300000075</span>
                <Link href="/impressum" style={{ fontSize: '12px', lineHeight: '16px', color: 'white', marginBottom: '24px', justifySelf: 'self-start' }}>{`Impressum.`}</Link>
                <FormControl fullWidth variant="standard">
                  <InputLabel id="locale-switcher">{localization["locale"]}</InputLabel>
                  <Select
                    labelId="locale-switcher"
                    id="locale"
                    value={locale}
                    label="Locale"
                    onChange={handleChange}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="it-it">Italiano</MenuItem>
                    <MenuItem value="pt-br">Português</MenuItem>
                    <MenuItem value="es-es">Español</MenuItem>
                    <MenuItem value="ro">Română</MenuItem>
                    <MenuItem value="de-de">Deutsch</MenuItem>
                    <MenuItem value="fr-fr">Français</MenuItem>
                    <MenuItem value="pl-pl">Polski</MenuItem>
                    <MenuItem value="cs-cz">Český</MenuItem>
                    <MenuItem value="sv-se">Svenska</MenuItem>
                    <MenuItem value="et-ee">Eesti</MenuItem>
                    <MenuItem value="ja-jp">日本語</MenuItem>
                  </Select>
                </FormControl>
              </section>
              <Apps>
                <a href='https://play.google.com/store/apps/details?id=com.angeloreale.purizumobile' style={{ marginRight: '8px', position: 'relative', display: 'block', height: 36, width: 124 }} >
                  <Image width={124} height={36} customStyles={{ width: '100%', height: 'auto' }} alt='Get it on Google Play' src='/images/googleplay.svg' />
                </a>
                <a style={{ position: 'relative', display: 'block', height: 36, width: 109 }} href='https://apps.apple.com/us/app/purizu/id1639022876'>
                  <Image width={109} height={36} customStyles={{ width: '100%', height: 'auto' }} alt='Download on App Store' src='/images/appstore.svg' />
                </a>
              </Apps>
              <Social>
                <a style={{ position: 'relative', display: 'flex', height: 36, width: 36, alignItems: 'center' }} href="https://facebook.com/remometrocom" target="_blank">
                  <Image q={100} width={36} height={36} customStyles={{ width: '100%', height: 'auto' }} alt="Facebook" src='https://images.ctfassets.net/jbs68hjf5qms/2v6UoLN0NM5ARkzN3fK1Sb/ca89ac953674e53062dcdc5b4ba4295f/facebook-icon-white.png?fm=webp' />
                </a>
                <a style={{ position: 'relative', display: 'flex', height: 36, width: 36, alignItems: 'center' }} href="https://instagram.com/remometrocom" target="_blank">
                  <Image q={100} width={36} height={36} customStyles={{ width: '100%', height: 'auto' }} alt="Instagram" src='https://images.contentful.com/jbs68hjf5qms/2LfvsXivHHfsWPCH88WoAk/5a5720411fffff7932d142fd3e409b62/instagram.png?fm=webp' />
                </a>
                <a style={{ position: 'relative', display: 'flex', height: 36, width: 36, alignItems: 'center' }} href="https://x.com/remometrocom" target="_blank">
                  <Image q={100} width={36} height={36} customStyles={{ width: '100%', height: 'auto' }} alt="Twitter" src='https://images.contentful.com/jbs68hjf5qms/41iVrTWnxF2hrgcSaq99Yg/6a03c41537424d03b7d672b6a1299243/twitter.png?fm=webp' />
                </a>
                {/* <a style={{ position: 'relative', display: 'flex', height: 36, width: 36, alignItems: 'center' }} href="https://soundcloud.com/remometrocom" target="_blank">
                  <Image width={36} height={36} customStyles={{ width: '100%', height: 'auto' }}  alt="Soundcloud" src='https://images.contentful.com/jbs68hjf5qms/3WqADRPPpNDFZhbWmkoW5c/d783b91b13e64f0018e8edc23c166e42/soundcloud.png?fm=webp' />
                </a> */}
                <a style={{ position: 'relative', display: 'flex', height: 36, width: 36, alignItems: 'center' }} href="https://mixcloud.com/remometro" target="_blank">
                  <Image q={100} width={36} height={36} customStyles={{ width: '100%', height: 'auto' }} alt="Mixcloud" src='https://images.contentful.com/jbs68hjf5qms/22Nni1aXvpHsFijjjudV8W/a52ae7d6120286357bb8df113388d2ca/mixcloud.png?fm=webp' />
                </a>
              </Social>
            </Wrapper>
          </div>
        </footer>
      )}
    </>
  );
}

export default Footer;