import React, { useState } from 'react'
import LibCal from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid' // a plugin!
import dayGridPlugin from '@fullcalendar/daygrid'
import { EventLocale } from '../locale'
import { Box, Button, Modal } from '@mui/material'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


export const FullCalendar = ({ data, locale, initialView = "timeGridWeek", headerToolbar = { start: 'title' }, nowIndicator = false }) => {
  const [open, setOpen] = useState(false)
  const [modalPrompt, setModalPrompt] = useState("")
  const [askedCal, setAskedCal] = useState(false)
  const [info, setInfo] = useState({})
  const localization = EventLocale[locale] || EventLocale["default"]

  const redirectConsent = () => {
    setModalPrompt(localization['redirectPrompt'])
    setOpen(true)
  }

  const handleOKModalClick = async () => {
    if(!askedCal) {
      const cal = await import('../lib/cal')
      const createICal = cal.createICal
      const download = cal.download
      const invite = await createICal({ start: info.event.start, end: info.event.end, title: info.event.title, url: info.event.url, location: info.event.extendedProps.location, locale });
      await download(`purizu-external-${info.event.title}.ics`, invite)
      setAskedCal(true)
      setTimeout(() => {
        redirectConsent()
      }, 1000)
    }
    setOpen(false)
    if(askedCal) {
      window.open(info.event.url)
      setAskedCal(false)
    }
  }

  const handleCancelModalClick = (info) => {
    setOpen(false)
    if(!askedCal) {
      setAskedCal(true)
      setTimeout(() => {
        redirectConsent()
      }, 1000)
    } else {
      setAskedCal(false)
    }
  }
  
  return (

    <div>
      <LibCal
        plugins={[timeGridPlugin, dayGridPlugin]}
        headerToolbar={headerToolbar}
        initialView={initialView}
        nowIndicator={nowIndicator}
        locale={locale}
        events={data}
        height={400}
        firstDay={1}
        buttonText={{
          today: localization['T'],
          month: localization['M'],
          week: localization['W'],
          day: localization['D'],
          list: localization['L'],
        }}
        allDayText={localization['allDay']}
        eventColor="#fff"
        eventTextColor="#1b1b1b"
        eventClick={function (info) {
          info.jsEvent.preventDefault(); // don't let the browser navigate
          setModalPrompt(localization['calendarPrompt'])
          setOpen(true)
          setInfo(info)
          
        }}
        viewDidMount={(info) => {
          try {
            info?.view?.calendar?.scrollToTime((new Date() - info?.view?.calendar?.currentData?.dateProfile?.renderRange?.start));
          } catch(e) {
            return
          }
        }}
      />
      <Modal
        open={open}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, maxWidth: 400, width: '90%' }}>
          {/* <h2 id="parent-modal-title">1/2</h2> */}
          <p id="parent-modal-description">
            {modalPrompt}
          </p>
          <Button onClick={handleCancelModalClick}>Cancel</Button>
          <Button onClick={handleOKModalClick}>OK</Button>
        </Box>
      </Modal>
    </div>
  )
}