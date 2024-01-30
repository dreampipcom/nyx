import { NextResponse } from "next/server"
import { CALENDARS, TIMEFRAMES } from "../../../lib/constants"

const apiKey = process.env.GOOGLE_API_KEY

function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;  
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options = { cache: 'force-cache', next: { revalidate: 3600 } }, retries = 10, retryDelay = 1000, parentUrl) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) { // if you want to retry on specific HTTP status codes
        throw new Error('Response was not ok');
      }

      return response; // or whatever you want to return
    } catch (error) {
      if (i < retries - 1) {  // if not the last retry attempt
        await delay(retryDelay * (i + 2 / 2)); // wait before next attempt
      } else {
        throw error;  // if the last retry attempt, throw the error
      }
    }
  }
}


export function parseGCalSummary(str) {
  try {
    const first = str?.split(/[\[\]]/)

    first?.splice(0, 1)
    const terms = first[0]?.split(',')?.map(s => s.trim()) || []
    //const city = terms?.slice(-1)[0]?.toLowerCase() || ""
    //terms.pop()

    const second = first[1]?.split(/\s*-\s*/)
    const artists = second[0]?.split(',')?.map(s => s?.trim()) || []
    const project = second[1]?.split(',')?.map(s => s?.trim()) || ""

    const data = {
      terms,
      artists,
      project
    };

    return data
  } catch (e) {
    return {
      terms: [],
      artists: [],
      project: ""
    }
  }

}

export function stripHtmlTags(inputStr) {
  try {
    // Replace <br> and <br/> (case insensitive) with \n
    inputStr = inputStr.replace(/<br\s*\/?>/gi, '\n');

    // Strip out all other HTML tags
    return inputStr.replace(/<\/?[^>]+(>|$)/g, "");
  } catch (e) {
    return ""
  }
}

function maskValue(obj, maskForKey, maskForValue) {
  // Base condition: If it's not an object or array, return the object itself
  if (typeof obj !== 'object' || obj === null) return obj;

  // If it's an array, iterate and recursively mask each item
  if (Array.isArray(obj)) {
    return obj.map(item => maskValue(item, maskForKey, maskForValue));
  }

  // Create a new object to store the masked values
  let maskedObj = {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      // If the key matches the condition, mask the value
      if (maskForKey(key)) {
        maskedObj[key] = '*****';  // or any masking logic you prefer
      }
      // If the value matches the condition, mask it
      else if (maskForValue(obj[key])) {
        maskedObj[key] = '*****';  // or any masking logic you prefer
      } else {
        // If neither the key nor the value matches, just continue the recursive masking
        maskedObj[key] = maskValue(obj[key], maskForKey, maskForValue);
      }
    }
  }

  return maskedObj;
}

// Function to fetch data from a given URL
const fetchData = async (cal, i) => {
  const url = typeof cal === 'string' ? cal : cal?.url
  const response = await fetchWithRetry(url);
  const data = await response.json(); // assuming server responds with json
  data.city = cal.city
  return data;
};

const fetchAllData = async (cals) => {
  const results = await Promise.allSettled(cals.map(fetchData));

  const data = results.map((result) => {
    if (result.status === 'fulfilled') {
      return result.value
    }
  });

  return data
};

const decorateAgenda = (calendars, meta) => {
  const mapData = {
    type: "FeatureCollection",
    features: [],
    timeframe: meta?.timeframe
  }
  const calData = calendars.flatMap((calendar, i) => {
    return calendar?.items?.flatMap((event, index) => {
      try {
        const { summary: title, description, location, start, end } = event

        const parsed = parseGCalSummary(title)

        const { terms, city, artists, project } = parsed
        const [latlng, link] = stripHtmlTags(description).replace(/^\n+|\n+$/,"").split('\n')
        const { dateTime: starttime } = start
        const { dateTime: endtime } = end

        const allDay = new Date(endtime).getTime() - new Date(starttime).getTime() > 86400000
        const [x, y] = latlng.split(', ')

        const lat = Number(y)
        const lng = Number(x)

        const destination = isValidURL(link) ? link : ""

        const mapProps = {
          name: title,
          terms,
          city: calendar?.city || "",
          artists,
          project,
          starttime,
          endtime,
          location: location || "",
          link: destination,
          timeframe: meta?.timeframe
        }

        if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
          const geo = {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [Number(lat), Number(lng)]
            },
            properties: mapProps,
          }
          mapData.features.push(geo)
        }

        return {
          id: title,
          title,
          url: destination,
          location: location || "",
          start: starttime,
          end: endtime,
          classNames: [...terms],
          allDay: allDay || false,
          terms: terms || [],
          city: calendar?.city || "",
          artists: artists || [],
          project: project || "",
          timeframe: meta?.timeframe
        }
      } catch (e) {
        console.error(e)
      }
    })
  }).sort((a, b) => new Date(a.start) - new Date(b.start)) || []

  return { calData, mapData }
}

const generateGCalUrl = ({ key, cal, min, max }) => {
  return `https://www.googleapis.com/calendar/v3/calendars/${cal}/events?key=${key}&orderBy=starttime&singleEvents=true&timeMin=${min}&timeMax=${max}`
}

export const config = {
  runtime: 'edge',
};


export default async function (req, res) {
  try {
    const { searchParams } = new URL(req.url);
    let cities = searchParams.get('cities')?.split(',')
    let all = false

    cities = cities.map((city) => city.replace(/\ /g, '-'))

    if (!cities || cities.includes('global') || cities.includes('')) {
      cities = ['global']
      all = true
    }

    const timeframe = searchParams.get('timeframe') || 'W'

    const frame = TIMEFRAMES[timeframe]

    const min = new Date().toISOString();
    const max = new Date(Date.now() + frame).toISOString();

    if (!all && (cities.some((city) => !Object.keys(CALENDARS).includes(city)) || !Object.keys(TIMEFRAMES).includes(timeframe))) {
      throw new Error("Invalid API")
    }


    const sources = []

    if (cities[0] === 'global') {
      Object.values(CALENDARS).forEach((cal) => {
        sources.push(generateGCalUrl({ key: apiKey, cal, min, max }))

      })
    } else {
      cities.forEach((city) => {
        if (!CALENDARS[city]) {
          throw new Error("Unknown city")
        } else {
          const url = generateGCalUrl({ key: apiKey, cal: CALENDARS[city], min, max })
          sources.push({ url, city })
        }
      })
    }

    if (!sources?.length) {
      throw new Error("Can't figure where to get the data from")
    }

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    }

    const data = await fetchAllData(sources, options);

    const decorated = decorateAgenda(data, { cities, timeframe })

    // decorated.timeframe = timeframe
    // decorated.mapData.timeframe = timeframe

    // const masked = maskValue(json,
    //   key => ['email', 'htmlLink', 'iCalUID'].includes(key),  // keys to mask
    //   value => typeof value === 'string' && value.includes('secret')  // values to mask
    // );
    const headers = {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': 'https://www.dreampip.com',
      'Cache-Control': 'maxage=0, s-maxage=300, stale-while-revalidate=300'
    }
    return NextResponse.json({ data: decorated }, { status: 200, headers })
  } catch (error) {
    console.log({ error })
    return NextResponse.json({ error: "Invalid API call" }, { status: 500 })
  }
}