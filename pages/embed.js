import dynamic from 'next/dynamic';
import React, { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';

export default function Embed() {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
        backgroundColor: '#1a1a1a',
        zIndex: 2,
      }}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: 0,
        paddingBottom: '56.25%'
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          height: 'auto'
        }}>
          <ReactPlayer
            url="https://live.infra.purizu.com/main.m3u8"
            controls={true}
            width="100%"
            height="auto"
            playsInline
          />,
        </div>
      </div>

    </div>
  );
}
