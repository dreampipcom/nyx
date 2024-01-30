import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import EventIcon from '@mui/icons-material/Event';
import { createICal } from '../lib/helpers';
import {Popup as GLPop} from 'react-map-gl'
import { download } from '../lib/helpers';
import { MapLocale } from '../locale/map';

// localization and ical and other dependencies should be imported too

function Popup({ feature, locale, mobile, key, onClose = () => {}, onOpen }) {
  const { name, starttime, endtime, link, location } = feature.properties;
  const coordinates = feature.geometry
  const [lng, lat] = coordinates
  const start = new Date(starttime).toLocaleString(locale || "en-US", {});
  const end = new Date(endtime).toLocaleString(locale || "en-US", {});
  
  const localization = MapLocale[locale] || MapLocale['default']
// style={{ zIndex: 99999, width: '300px', position: 'absolute', bottom: '-128px', backgroundColor: '#1b1b1b', padding: '8px' }
  return (<GLPop longitude={lng} latitude={lat} className='mapbox-purizu-custom' onClose={onClose}>
    <div style={{ display: 'flex' }}>
      <span style={{ flex: "1 0 60%" }}>{name}</span>
      <span onClick={(e) => {
        onClose()
      }}>
        <IconButton size="small" sx={{ padding: '4px', width: '32px', height: '32px' }}>
          <CloseIcon fontSize='small' />
        </IconButton>
      </span>
    </div>
    <div>
      {start} - {end}
    </div>
    <div>
      <a href={link} target="_blank" rel="noreferrer noopener">{localization['view']}</a>
    </div>
    <div>
      <Button sx={{ marginY: "4px" }} startIcon={<EventIcon />} onClick={async() => {
        const cal = await import('../lib/cal')
        const createICal = cal.createICal
        const download = cal.download
        const invite = await createICal({ start: starttime, end: endtime, title: name, url: link, location, locale });
        await download(`purizu-external-${name}.ics`, invite, mobile)}
        }>{localization['calendar']}</Button>
    </div>
  </GLPop>)
}

export default Popup;
