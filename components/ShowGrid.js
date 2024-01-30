import { Chip, Tooltip } from '@mui/material';
import Link from 'next/link';
import { relative } from 'path';
import styled from 'styled-components';
import { localizeUrl } from '../lib/helpers';
import Image from './ImageBlock';
import { useState } from 'react';

const EpisodesWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 32px; 

  @media screen and (min-width: 375px) {
    grid-template-columns: 1fr 1fr;
  }

  ${({ even }) => !even ? `@media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
  }` : `  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }`}


`

const Episode = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  cursor: pointer;
  &:hover:after {
    content: "";
    background-color: rgba(0,0,0,0.4);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1;
    height: 100%;
    cursor: pointer;
  }

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
        cursor: pointer;
      }`
        }
    }}
`

export const ShowGrid = ({ items, locale, live, nextUp, directory, past, onClick, even }) => {

    const getUrl = (item) => {
        return item?.url
    }
    const getTitle = (item) => {
        return item?.title || item?.title
    }
    const getImageUrl = (item) => {
        return item?.image?.url || item?.url
    }
    const getVideoUrl = (item) => {
        return item?.video?.url
    }
    const getMP4Url = (item) => {
        return item?.videoMp4?.url
    }
    const getShim = (item) => {
        return item?.placeholderUrl
    }
    const getPlaceholder = (item) => {
        return item?.placeholder?.url
    }


    const idPast = (item) => {
        if (!past) return false
        const now = new Date()
        const eventDate = new Date(item?.date)

        if (now > eventDate) {
            return true
        }
        return false
    }

    const itemsJSX = items?.map((item, index) => {
        const url = getUrl(item)
        const title = getTitle(item)
        const image = getImageUrl(item)
        const video = getVideoUrl(item)
        const mp4 = getMP4Url(item)
        const placeholder = getPlaceholder(item)
        const shim = getShim(item)


        const content = <Image sizes="(max-width: 768px) 50vw, (max-width: 1024px) 20vw, 20vw" eager={index <= 6 ? true : false} video={video} videoMp4={mp4} shim={shim} placeholder={placeholder} width={500} height={500} customStyles={{ width: '100%', height: 'auto' }} className="square" alt={title + " image"} src={image} />

        return (
            <article key={title + image} style={{ aspectRatio: "1", position: 'relative', cursor: 'pointer' }}>
                <Chip label="Live Now!" color="success" sx={{ marginLeft: 1, marginY: "16px", position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'center', zIndex: 3, display: live === url ? 'flex' : 'none' }} />
                <Chip label="Next Up!" color="warning" sx={{ marginLeft: 1, marginY: "16px", position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'center', zIndex: 3, display: nextUp === url ? 'flex' : 'none' }} />
                {!onClick ?
                    (
                        <Tooltip title={title}>
                            <Link href={`${directory}/${url}`} prefetch={false} >
                                <Episode past={idPast(item)} >
                                    <span style={{ position: 'relative', aspectRatio: 1 / 1 }}>
                                        {content}
                                    </span>
                                </Episode>
                            </Link>
                        </Tooltip>
                    ) : (
                        <div key={url} style={{ aspectRatio: "1", height: "100%", overflow: "hidden" }} onClick={() => {
                            onClick(image)
                        }}>
                            <Episode>
                                {content}
                            </Episode>
                        </div>
                    )}
            </article>
        )
    }) || <></>

    return (
        <section style={{ display: 'grid' }}>
            {<EpisodesWrapper even={even}>
                {itemsJSX}
            </EpisodesWrapper>}
        </section>

    )
}