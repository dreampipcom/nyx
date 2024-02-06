import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ReactAudioPlayer from 'react-audio-player';
import { isVideoConsented } from '../lib/helpers';
import { AppContext } from '../context';

const VolumeWrapper = styled.div`
  display: none;

  @media screen and (min-width: 768px) {
    display: flex;
  }
`

const Wrapper = styled.section`
  padding: 8px 16px;
  display: flex;
  background: ${(props) => (props.theme === 'dark' ? '#1a1a1a' : 'white')};
  justify-content: center;
  box-sizing: border-box;
  flex-direction: column;

  width: 100%;
  flex: 100%;
  min-width: 100%;
  max-width: 100%;

  // @media screen and (min-width: 768px) {
  //   width: 50%;
  //   flex: 50%;
  //   min-width: 50%;
  //   max-width: 50%;
  // }
`;

const VolumeIcon = <svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M24 12C24 16.4183 20.4183 20 16 20V18C19.3137 18 22 15.3137 22 12C22 8.68629 19.3137 6 16 6V4C20.4183 4 24 7.58172 24 12Z"
    fill="currentColor"
  />
  <path
    d="M20 12C20 14.2091 18.2091 16 16 16V14C17.1046 14 18 13.1046 18 12C18 10.8954 17.1046 10 16 10V8C18.2091 8 20 9.79086 20 12Z"
    fill="currentColor"
  />
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M9 16L15 20V4L9 8H5C2.79086 8 1 9.79086 1 12C1 14.2091 2.79086 16 5 16H9ZM5 10H9L13 7.5V16.5L9 14H5C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10Z"
    fill="currentColor"
  />
</svg>

const Control = styled.span`
  background-image: url(${(props) =>
    !props.isPlaying
      ? `/${process.env.NEXT_PUBLIC_SUBPATH_PREFIX
        ? `${process.env.NEXT_PUBLIC_SUBPATH_PREFIX}/`
        : ''
      }images/button-play.png`
      : `/${process.env.NEXT_PUBLIC_SUBPATH_PREFIX
        ? `${process.env.NEXT_PUBLIC_SUBPATH_PREFIX}/`
        : ''
      }images/button-stop.png`});
  min-width: 16px;
  height: 16px;
  background-size: contain;
  display: flex;
  margin: 0 8px;
  filter: ${(props) => (props.theme === 'dark' ? 'invert(100%)' : 'none')};
`;

const Title = styled.h5`
font-size: 14px;
margin: 0;
color: ${(props) => (props.theme === 'dark' ? 'white' : 'black')};
font-style: italic;
overflow-wrap: break-word;
padding-right: 4px;
max-width: 100%;
`;

const StationWrapper = styled.div`
display: none;

@media screen and (min-width: 768px) {
  display: block;
}
`

function Player({
  title,
  url,
  theme = 'light',
  playing = false,
  switchPlaying,
  status,
}) {
  const playerRef = useRef();
  const [isPlaying, setisPlaying] = useState(playing)
  const [volume, setVolume] = useState(1)
  const [showVolume, setShowVolume] = useState(false)
  const [decodedStatus, setDecodedStatus] = useState("")
  const context = useContext(AppContext)
  const [Purl, setPUrl] = useState('https://archive.org/download/9unlikelytales_cs_lv2/9unlikelytales_4_nesbit_64kb.mp3')
  const { setContext, consent, reconsent } = context

  useEffect(() => {
    if(consent) setPUrl(url)
    if(isPlaying) {
      switchPlaying()
      togglePlaying()
    }
  }, [consent])

  const togglePlaying = () => {
    const player = playerRef?.current
    let play = Purl
    if (!consent) {
      setContext({ ...context, reconsent: !reconsent })
    }
    if (!isPlaying) {
      player.src = play + ``
      player.load()
      player.play()
      setisPlaying(true)
    } else {
      player.pause()
      player.src = "about:blank"
      player.load()
      setisPlaying(false)
    }
  }

  useEffect(() => {
    const htmlDecode = (innerHTML) =>
      Object.assign(document.createElement('textarea'), { innerHTML }).value;

    setDecodedStatus(htmlDecode(status));
  }, [status])
  return (
    <Wrapper {...{ theme }}>
      <div style={{ margin: 'auto', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              backgroundColor: 'green',
              borderRadius: '50%',
              width: 12,
              height: 12,
              marginRight: 8,
            }}
          />
        </div>
        <StationWrapper>
          <Title style={{ minWidth: 15 }} {...{ theme }} />
        </StationWrapper>
{/*        <VolumeWrapper style={{ position: 'relative' }}>
          <span style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }} onClick={() => setShowVolume(!showVolume)}>{VolumeIcon}</span>
          <div style={{ position: 'absolute', left: '-16px', bottom: '32px', height: '100px', display: 'flex', alignContent: 'center', justifyContent: 'center', flexDirection: 'column', maxHeight: showVolume ? '200px' : '0px', margin: 'auto', overflow: 'hidden', transition: 'max-height 1s ease-in-out' }}>

            <input
              name='volume'
              type='range'
              min='0'
              max='100'
              className='volume'
              id='volume'
              value={volume * 100}
              style={{ width: '80px', transform: 'rotate(-90deg)', accentColor: 'green' }}
              onChange={(e) => {
                setVolume(e.target.value / 100)
              }
              } />
            <label htmlFor='volume' style={{ fontSize: '8px' }}>Volume:</label>
          </div>
        </VolumeWrapper>*/}
        <Control
          {...{ isPlaying: playing, theme }}
          onClick={() => {
            switchPlaying()
            togglePlaying()
          }}
        />
        <Title {...{ theme }}>{decodedStatus || 'Rotations Portal'}</Title>
        <audio
          ref={playerRef}
          preload={playing ? "auto" : "none"}
          width={0}
          height={0}
          src={url}
          volume={volume}
          type="audio/mp3"
        />
      </div>
    </Wrapper>
  );
}

export default Player;
