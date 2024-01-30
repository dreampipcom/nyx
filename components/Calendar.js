import { useRouter } from "next/router"
import styled from "styled-components"
import { useContext } from "react"
import { AppContext } from "../context"

import dynamic from 'next/dynamic';

const Spinner = () => {
  return (<p>Loading</p>)
}
const FullCalendar = dynamic(() => import('./FullCalendar').then((mod) => mod.FullCalendar))
const MapBox = dynamic(() => import("./MapBox").then((mod) => mod.MapBox))  


const Agenda = styled.div`
  display: block;
  min-height: 500px;
  ${({ mode }) => mode === 'space' ? `display:none;` : ``}

  @media screen and (min-width: 768px) {
    display: none;
  }
`

const Week = styled.div`
  display: none;

  @media screen and (min-width: 768px) {
    display: block;
    ${({ mode }) => mode === 'space' ? `display:none;` : ``}
  }
`

const DesktopMapDiv = styled.section`
  height: calc(100vh - 300px);
  position: relative;
  ${({ mode }) => mode === 'space' ? `display:block;` : `display:none;`}

  @media screen and (min-width: 768px) {
    display: block;
    ${({ mode }) => mode === 'space' ? `display:block;` : `display:none;`}
  }
`

const Calendar = ({ mode = "time", mapData, calData, city = "Bologna", calendar, timeframe = 'W' }) => {
  const { mobileApp } = useContext(AppContext)
  const { locale: orig, pathname } = useRouter()
  const locale = orig === "default" ? "en" : orig

  const googleLocale = {
    'default': 'en_GB',
    'en': 'en_GB',
    'it-it': 'it',
    'pt-br': 'pt_BR',
    'de-de': 'de_DE',
    'fr-fr': 'fr_FR',
    'es-es': 'es_ES',
    'ro': 'ro'
  }[locale]

  const mobileTools = {
    start: 'title', // will normally be on the left. if RTL, will be on the right
    center: '',
    end: 'today prev,next' // will normally be on the right. if RTL, will be on the left
  }

  const desktopTools = {
    start: 'title', // will normally be on the left. if RTL, will be on the right
    center: 'timeGridWeek,dayGridMonth',
    end: 'today prev,next' // will normally be on the right. if RTL, will be on the left
  }


  return <section>
    {mode === 'time' ? (
      <section>
        <Agenda key={`agenda--${mode}`} mode={mode}>
          <FullCalendar data={calData} locale={locale} initialView="timeGridDay" headerToolbar={mobileTools} nowIndicator />
        </Agenda>
        <Week key={`week--${mode}`} mode={mode}>
          <FullCalendar data={calData} locale={locale} headerToolbar={desktopTools} nowIndicator />
        </Week>
      </section>
    ) : (
      <DesktopMapDiv key={`map--${mode}`} mode={mode}>
        <MapBox data={mapData} mode={mode} locale={locale} mobile={mobileApp} city={city} settings={calendar} timeframe={timeframe} />
      </DesktopMapDiv>
    )}
  </section>
}

export default Calendar
