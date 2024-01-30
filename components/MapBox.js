import React, { useContext, useEffect, useRef, useState } from 'react';
import { Map, Source, Layer, Popup as GLPop } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAP_CENTRES } from '../lib/constants';
import Popup from './Popup';
import { checkAgenda } from '../lib/helpers';
import { AppContext } from '../context';
import bbox from '@turf/bbox'

export const clusterLayer = {
  id: 'clusters',
  type: 'circle',
  source: 'earthquakes',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': ['step', ['get', 'point_count'], '#fff', 10, '#22cc00', 30, '#cc2200'],
    'circle-radius': ['step', ['get', 'point_count'], 20, 5, 30, 10, 40]
  }
};

export const clusterCountLayer = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'earthquakes',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    // 'text-font': ['Comfortaa', 'Arial Unicode MS Bold'],
    'text-size': 12
  }
};

export const unclusteredPointLayer = {
  id: 'point',
  type: 'circle',
  source: 'earthquakes',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': '#fff',
    'circle-radius': 10,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff'
  }
};

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYW5nZWxvcmVhbGUiLCJhIjoiY2tobDk2bHd2MDh3cTJ6cXRja3RtN3RhdCJ9.iqcyq19xPQhIYuAWIi4VZQ'; // Set your mapbox token here

export const MapBox = ({ mode, data, locale, mobile, city, settings, timeframe }) => {
  const context = useContext(AppContext)
  const { setContext, agendaData, facetedAgenda, setAgendaCities, agendaCities, setAgendaData } = context
  const mapRef = useRef(null)
  const popup = useRef({ open: false, feature: undefined })
  const hoverPopup = useRef()
  const [popupOpen, setPopupOpen] = useState(false)
  const [hoverPopupOpen, setHoverPopupOpen] = useState(false)

  const onPopUpClose = () => {
    setPopupOpen(false)
    setHoverPopupOpen(false)
  }

  const fetchNewData = async (config) => {
    if (mode === "time") return
    if (!config.force) {
      if (city === 'global') return
    }
    if (mapRef?.current) {
      const bounds = mapRef.current.getBounds()
      const centres = Object.values(MAP_CENTRES)
      const newCities = []
      for (const centre of centres) {
        if (bounds.contains([centre.coordinates[1], centre.coordinates[0]]) && centre.slug !== 'global') {
          newCities.push(centre.slug)
        }
      }
      if (city === 'global') newCities.push('global')
      if (config?.force || !newCities.every((newCity) => agendaCities?.includes(newCity))) {
        const newData = await checkAgenda({ cities: newCities, timeframe })
        setContext({ ...context, agendaData: newData, agendaCities: newCities })
      }
    }
  }

  const onClick = event => {
    const [target] = event.features

    if (!target) return

    if (target.layer.id === 'clusters') {
      onClickCluster({ target, event })
    }
    if (target.layer.id === 'point') {
      onClickPoint({ target, event })
    }
  }

  const onMouseEnter = event => {
    const [target] = event.features
    const clusterId = target.properties.cluster_id;
    const mapboxSource = mapRef.current.getSource('earthquakes');
    mapboxSource.getClusterLeaves(clusterId, 5, 0, (err, features) => {
      if (err) return
      hoverPopup.current = features
      hoverPopup.current.coordinates = target.geometry.coordinates
      setHoverPopupOpen(true)
    })
  }

  const onMouseLeave = event => {
    setHoverPopupOpen(false)
  }

  const onClickCluster = ({ target, event }) => {
    if (popupOpen || hoverPopupOpen) {
      setPopupOpen(false)
      setHoverPopupOpen(false)
      return
    }
    const clusterId = target.properties.cluster_id;
    const mapboxSource = mapRef.current.getSource('earthquakes');
    mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) {
        return;
      }

      mapRef.current.easeTo({
        center: target.geometry.coordinates,
        zoom,
        duration: 500
      });
    });
  };

  const onClickPoint = ({ target, event }) => {
    if (popupOpen || hoverPopupOpen) {
      setPopupOpen(false)
      setHoverPopupOpen(false)
      return
    }
    const lngLat = event.lngLat
    const geometry = target.geometry.coordinates
    popup.current = { feature: { properties: target.properties, geometry, lngLat } }
    setPopupOpen(true)
  };

  useEffect(() => {
    if (data?.timeframe !== timeframe) {
      fetchNewData({ force: true })
    }
  }, [timeframe])

  useEffect(() => {
    if(!agendaData?.mapData) return
    if (mapRef?.current && agendaData?.mapData?.features?.length) {

      const bounds = bbox(agendaData?.mapData)

      if (bounds?.length) {
        try {
          mapRef.current.fitBounds(bounds, { padding: 200, maxZoom: 14 })
        } catch (e) {
          mapRef.current.fitBounds(bounds, { padding: 20, maxZoom: 14 })
        }
      }

    }
  }, [JSON.stringify(agendaData?.mapData)])

  const centre = [settings.where.lon, settings.where.lat] || [0, 0]
  const zoom = settings.zoom || 10

  return (
    <>
      <Map
        initialViewState={{
          latitude: centre[1],
          longitude: centre[0],
          zoom
        }}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={[clusterLayer.id, unclusteredPointLayer.id]}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onZoomEnd={fetchNewData}
        onDragEnd={fetchNewData}
        cursor='auto'
        ref={mapRef}
      >
        <Source
          id="earthquakes"
          type="geojson"
          data={facetedAgenda?.mapData || data}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>
        {popupOpen ? <Popup feature={popup.current.feature} locale={locale} mobile={mobile} city={city} onClose={onPopUpClose} /> : undefined}
        {hoverPopupOpen && hoverPopup.current ?
          (
            <GLPop onClose={onPopUpClose} className='mapbox-purizu-custom' latitude={hoverPopup.current.coordinates[1]} longitude={hoverPopup.current.coordinates[0]}>
              {hoverPopup.current.length && hoverPopup.current.map((feature) => {
                return <span>{feature.properties.name}<br /></span>
              })}
            </GLPop>
          ) : undefined}
      </Map>
    </>
  );
}