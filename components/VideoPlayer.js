import { forwardRef, useCallback, useEffect, useRef, useState } from "react"
import { useContext } from "react"
import { AppContext } from "../context"
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

const VideoPlayer = ({ customStyles, placeholder, url, slug, onError = () => {}, needsConsent = true, autoPlay = false, playing = undefined, onReady = () => { } }, ref) => {
  const context = useContext(AppContext)
  const { consent, setContext, reconsent } = context
  const [ready, setReady] = useState(false)
  const PlayerRef = useRef()

  const handleReady = () => {
    setReady(true)
    if(onReady) onReady()
  }

  useEffect(() => {
    if(ready && (autoPlay || playing)) {
      PlayerRef?.current?.player?.play && PlayerRef?.current?.player?.play().catch((e) => onError(e))
    }
  }, [playing, autoPlay, ready])

  const isAudio = slug?.includes('audio')

  const finalUrl = url || (isAudio ? `https://media.infra.dreampip.com/${slug}` : `https://media.infra.dreampip.com/videos/${slug}/main.m3u8`)

  const consented = consent

  const forceReconsent = useCallback(() => {
    if (!needsConsent) return
    if (setContext) setContext({ ...context, reconsent: !reconsent })
  }, [setContext])

  if (isAudio) return <audio controls loop autoPlay src={(!needsConsent || consented) ? finalUrl : "https://archive.org/download/9unlikelytales_cs_lv2/9unlikelytales_4_nesbit_64kb.mp3" } />

  return <span style={{ position: 'relative' }}>
    <ReactPlayer
      ref={PlayerRef}
      onError={onError}
      onReady={handleReady}
      key={`player-${needsConsent || consented}--${finalUrl}`}
      url={(!needsConsent || consented) ? finalUrl : 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
      controls={!autoPlay}
      width="100%"
      height="auto"
      playsinline={autoPlay}
      loop={autoPlay}
      poster={autoPlay && placeholder}
      light={needsConsent && !consented}
      onPlay={(e) => {
        if (needsConsent && !consented) {
          forceReconsent()
          return
        }
      }}
      playing={playing || (typeof playing === 'undefined' && autoPlay)}
      autoPlay={autoPlay}
      volume={autoPlay ? 0 : 1}
      muted={autoPlay}
      playIcon={!autoPlay && <span style={{ paddingBottom: "56.25%", display: 'flex', alignItems: 'center' }}>
        <img src="/images/button-play.png" style={{ filter: 'invert(100%)', transform: 'translateY(-50%)', position: 'absolute', top: '50%' }} onClick={(e) => {
          if (needsConsent && !consented) {
            forceReconsent()
            return
          }
        }} />
      </span>}
    />
  </span>
}

export default forwardRef(VideoPlayer)
