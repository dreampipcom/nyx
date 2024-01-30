import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import HeadStyle from '../scss/hero'
import ReactPlayer from 'react-player';

function Hero({
  title = 'Hero Title',
  id,
  bgImage,
  buttonText,
  buttonURL,
  isStreamingVideo,
  button2Text,
  button2URL,
  children,
}) {
  return (
    <section
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...(id && { id })}
      style={{
        backgroundImage: bgImage ? `url(${bgImage + "?fm=webp"}), url(${bgImage + "?fm=jpg"})` : 'none',
        overflow: 'hidden',
      }}
      className="hero"
    >
      <HeadStyle />
      {isStreamingVideo && (
        <>
          <div
            style={{
              position: 'relative',
              width: '100%',
              zIndex: 2,
              backgroundColor: "#1a1a1a"
            }}>
            <ReactPlayer
              url="https://live.infra.dreampip.com/main.m3u8"
              controls={true}
              width="100%"
              height="auto"
              playsInline
            />
          </div>
        </>
      )}

      {!isStreamingVideo && (
        <div style={{ padding: '7em 1em 9em' }} className="wrap">
          <h1 style={{ fontWeight: 200, padding: '0' }}>{title}</h1>
          <div>
            <div>{children}</div>
            {buttonText && buttonURL && (
              <p>
                <Link href={buttonURL} >
                  <span href={buttonURL} className="button">{buttonText}</span>
                </Link>
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default Hero;
