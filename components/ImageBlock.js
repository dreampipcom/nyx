import NextImage from 'next/image';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppContext } from '../context';
import VideoPlayer from './VideoPlayer';
import { useFirstInteraction } from '../hooks/useFirstInteraction';
import Bugsnag from '@bugsnag/js';

const contentfulLoader = ({ src, width, quality }) => {
  if (!src) return
  if (src.includes('jpg')) return src
  const newSrc = src.replace('&fm=webp', '').replace('?fm=webp', '')
  return `${newSrc}?q=${quality || 25}&w=${width || 480}&fm=webp`
}

const ImageWrapper = ({ visibilityImage, mobileApp, nextImage, imageProps }) => {
  const { q, eager, shim, placeholder, imgSrc: origImg, sizes, restProps, customStyles, alt } = imageProps
  const [imgSrc, setImgSrc] = useState(origImg)
  const [imgLoaded, setImgLoaded] = useState(false)
  const isSvg =  placeholder?.match('(.svg)', 'g') || imgSrc?.match('(.svg)', 'g')
  const imageRender = useMemo(() => {
    return mobileApp && !nextImage ? (
      <>
        <img alt={alt} fetchPriority={eager ? "high" : "auto"} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: !imgLoaded ? '0' : '1', transition: 'opacity1s ease-in-out' }} src={imgSrc} onLoad={() => { setImgLoaded(true) }} />
        <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={alt} src={shim} />
      </>
    ) : (
      <>
        <NextImage
          quality={q}
          loader={contentfulLoader}
          priority={eager}
          placeholder={!isSvg ? shim || 'data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjcwMCIgaGVpZ2h0PSI0NzUiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImciPgogICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMzMzIiBvZmZzZXQ9IjIwJSIgLz4KICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzIyMiIgb2Zmc2V0PSI1MCUiIC8+CiAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMzMzMiIG9mZnNldD0iNzAlIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjcwMCIgaGVpZ2h0PSI0NzUiIGZpbGw9IiMzMzMiIC8+CiAgPHJlY3QgaWQ9InIiIHdpZHRoPSI3MDAiIGhlaWdodD0iNDc1IiBmaWxsPSJ1cmwoI2cpIiAvPgogIDxhbmltYXRlIHhsaW5rOmhyZWY9IiNyIiBhdHRyaWJ1dGVOYW1lPSJ4IiBmcm9tPSItNzAwIiB0bz0iNzAwIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgIC8+Cjwvc3ZnPg==' : undefined}
          {...restProps}
          alt={alt}
          style={{ objectFit: 'cover', ...customStyles }}
          sizes={sizes || "(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 25vw"}
          src={placeholder || imgSrc}
          onLoad={() => { setImgLoaded(true) }}
          onError={(e) => {
            Bugsnag.notify(e)
            if (imgSrc?.includes('?fm=webp')) {
              setImgSrc(imgSrc?.replace('webp', 'jpg'))
            } else if (imgSrc?.includes('jpg')) {
              setImgSrc(shim)
            }
          }}
        />
      </>
    )
  }, [placeholder, imgSrc])

  return <span style={{ ...visibilityImage }}>{imageRender}</span>
}

const Image = (props) => {
  const { customStyles, q, placeholder: origPlaceholder, sizes, shim, video, videoMp4, eager, onVidError, alt, ...restProps } = props;
  const { mobileApp, nextImage } = useContext(AppContext)
  const originalSrc = props.src || "https://images.contentful.com/jbs68hjf5qms/7i8AhadYiUgWvW5D0mwGoH/ea3b4c2124d4217ced8891393c2f1a9e/logo-app-1024.png?fm=webp"
  const imgSrc = originalSrc
  // const isContentful = originalSrc?.match('(contentful|ctassets)', 'g')

  const [placeholder, setPlaceholder] = useState(origPlaceholder)

  const [loadVid, setLoadVid] = useState("")
  const [vidLoaded, setVidLoaded] = useState(false)
  const [vidAboutToLoad, setVidAboutToLoad] = useState(false)
  const [vidErr, setVidErr] = useState(false)
  const ready = useRef()

  const hasVid = !!video || !!videoMp4

  const videoSources = [
    { src: video, type: 'video/webm' },
    { src: videoMp4, type: 'video/mp4' }
  ]

  const mouseHandler = useCallback(() => {
    setLoadVid(true)
  }, [])

  useEffect(() => {
    if (vidErr) setPlaceholder(imgSrc)
  }, [vidErr])

  useFirstInteraction(mouseHandler, [hasVid, loadVid], [hasVid && !loadVid], [loadVid], [loadVid === false], { name: "IMAGE" })

  const visibilityImage = useMemo(() => {
    return hasVid ? {
      width: '100%',
      height: '100%',
      opacity: vidAboutToLoad && !vidErr ? '0' : '1',
      //zIndex: vidAboutToLoad && !vidErr ? '-1' : '0',
      position: vidAboutToLoad && !vidErr ? 'absolute' : 'relative',
      display: 'block',
      transition: 'opacity 1s ease-in-out'
    } : {}
  }, [vidLoaded, vidErr])

  const visibilityVideo = useMemo(() => {
    return hasVid ? {
      opacity: !vidLoaded || !vidAboutToLoad || vidErr ? '0' : '1',
      position: !vidLoaded || !vidAboutToLoad || vidErr ? 'absolute' : 'relative',
      transition: 'opacity 1s ease-in-out',
      zIndex: !vidAboutToLoad || vidErr ? -1 : 0
    } : {}
  }, [vidAboutToLoad, vidLoaded, vidErr])

  const getReady = () => {
    return ready.current
  }

  const videoRender = useMemo(() => {
    if (vidErr) return
    if (!hasVid || !loadVid || vidErr) return
    return hasVid && loadVid ? <>
      <VideoPlayer
        onReady={() => {
          const isReady = getReady()
          if (!vidAboutToLoad && !isReady) setVidAboutToLoad(true)
          const timeout = () => setTimeout(() => {
            setVidLoaded(true)
            ready.current = true
          }, 2000)
          if (!isReady) {
            timeout()
          }
        }}
        autoPlay
        playing={loadVid}
        needsConsent={false}
        url={videoSources}
        placeholder={placeholder}
        onError={(e) => {
          console.error(e)
          setVidErr(true)
        }}
      />
    </> : undefined
  }, [vidErr, loadVid, placeholder, vidAboutToLoad])

  const vidWrapper = () => {
    return <span style={{ width: '100%', ...visibilityVideo }}>{videoRender}</span>
  }

  return <span style={{ position: 'relative', width: '100%', height: '100%', display: 'block'}}>
    <ImageWrapper {...{  visibilityImage, mobileApp, nextImage, imageProps: { restProps, customStyles, sizes, shim, placeholder, imgSrc, eager, q, alt}}} />
    {vidWrapper()}
  </span>

}

export default Image