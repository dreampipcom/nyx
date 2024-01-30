import Bugsnag from "@bugsnag/js";
import { EventLocale } from "../locale";
import { generateApiCall } from "./helpers";

export const createICalFromText = ({ text }) => {
  const ical = ics.createEvent(text, (error, value) => {
    if (error) {
      Bugsnag.notify(error)
    }

    return value
  })

  return ical
}

export function download(filename, text, mobileApp = false, cb) {
  if (mobileApp) {
    try {
      ReactNativeWebView.postMessage(text)
      return
    } catch (e) {
      Bugsnag.notify(e)
    }
  }
  var element = document.createElement('a');
  element.href = generateApiCall(`/api/createInvite?text=${encodeURIComponent(text)}&filename=${encodeURIComponent(filename)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
  const endpoint = generateApiCall(`/api/log?text=CB`)
  if (cb) {
    fetch(endpoint)
    document.querySelector(".content-page").ontouchstart = () => {
      cb()
    }
  }
}

export const createICal = async ({ start, end, timezone = "Europe/Rome", description, title, url, location, locale = "en", recurrence }) => {
  const ics = require('ics')
  let moment = await import('moment');
  let momentTZ = await import('moment-timezone');
  moment = moment.default
  momentTZ = momentTZ.default

  moment.locale(locale)
  momentTZ.updateLocale(locale, moment.localeData()._config);
  momentTZ.locale(locale);
  let alarms = []
  const localization = EventLocale[locale] || EventLocale['default']

  const defaultDesc = description || `${url ? localization['know'] + " " + url + " \n \n" : ""}${localization['brought']} https://www.dreampip.com.`

  alarms.push({
    action: 'audio',
    description: 'Reminder',
    trigger: { hours: 0, minutes: 10, before: true },
    repeat: 1,
    attachType: 'VALUE=URI',
    attach: 'Glass'
  })
  alarms.push({
    action: 'audio',
    description: 'Reminder',
    trigger: { hours: 6, minutes: 0, before: true },
    repeat: 1,
    attachType: 'VALUE=URI',
    attach: 'Glass'
  })
  alarms.push({
    action: 'audio',
    description: 'Reminder',
    trigger: { hours: 48, minutes: 0, before: true },
    repeat: 1,
    attachType: 'VALUE=URI',
    attach: 'Glass'
  })

  let startEvent = momentTZ(start).tz(timezone).utc().format('YYYY-M-D-H-m').split("-").map((el) => Number(el))
  let endEvent = momentTZ(end).tz(timezone).utc().format("YYYY-M-D-H-m").split("-").map((el) => Number(el))

  const eventCal = {
    start: startEvent,
    end: endEvent,
    startInputType: 'utc',
    title: title,
    description: defaultDesc,
    location: location || url,
    url: url || "https://www.dreampip.com",
    status: 'CONFIRMED',
    busyStatus: 'BUSY',
    recurrenceRule: recurrence ? recurrence : undefined,
    alarms
  }

  const ical = ics.createEvent(eventCal, (error, value) => {
    if (error) {
      Bugsnag.notify(error)
    }

    return value
  })

  return ical
}