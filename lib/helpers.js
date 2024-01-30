export function setCookie(name, value, days) {
  const consent = window.localStorage.getItem('GlowCookies')
  if (consent != 1) return
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
export function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
// export function hasConsented() {
//   if (window.localStorage.getItem('GlowCookies') != 1) {
//     window?.glowCookies?.openSelector()
//     return false
//   }
//   return true
// }

export function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

export const ALTERNATE = (path) => [
  {
    href: process.env.SITE_URL || 'https://www.dreampip.com' + path,
    hreflang: 'x-default',
  },
  {
    href: process.env.SITE_URL || 'https://www.dreampip.com/en' + path,
    hreflang: 'en',
  },
  {
    href: process.env.SITE_URL || 'https://www.dreampip.com/it-it' + path,
    hreflang: 'it-it',
  },
  {
    href: process.env.SITE_URL || 'https://www.dreampip.com/pt-br' + path,
    hreflang: 'pt-br',
  },
  {
    href: process.env.SITE_URL || 'https://www.dreampip.com/es-es' + path,
    hreflang: 'es-es',
  },
  {
    href: process.env.SITE_URL || 'https://www.dreampip.com/de-de' + path,
    hreflang: 'de-de',
  },
  {
    href: process.env.SITE_URL || 'https://www.dreampip.com/fr-fr' + path,
    hreflang: 'fr-fr',
  },
  {
    href: process.env.SITE_URL || 'https://www.dreampip.com/es-es' + path,
    hreflang: 'es-es',
  },
  {
    href: process.env.SITE_URL || 'https://www.dreampip.com/ro' + path,
    hreflang: 'ro',
  },
  {
    href: process.env.SITE_URL || 'https://www.dreampip.com/pl-pl' + path,
    hreflang: 'pl-pl',
  },
  {
    href: process.env.SITE_URL || 'https://www.dreampip.com/cs-cz' + path,
    hreflang: 'cs-cz',
  },
  {
    href: process.env.SITE_URL || 'https://www.dreampip.com/sv-se' + path,
    hreflang: 'sv-se',
  },
  {
    href: process.env.SITE_URL || 'https://www.dreampip.com/et-ee' + path,
    hreflang: 'et-ee',
  },
  {
    href: process.env.SITE_URL || 'https://www.dreampip.com/ja-jp' + path,
    hreflang: 'ja-jp',
  },
]

export const invertObject = (object) => Object.keys(object).reduce((acc, key) => {
  acc[object[key]] = key
  return acc
}, {})






export const generateApiCall = (path) => {
  if (process.env.NEXT_PUBLIC_DEV) {
    if (process.env.NEXT_PUBLIC_LOCAL) {
      return `http://localhost:8080` + path
    }
    return `https://beta.dreampip.com` + path
  }
  return 'https://www.dreampip.com' + path
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export const checkAgenda = async (params) => {
  const timeframe = params?.timeframe || 'W'
  const cities = Array.isArray(params?.cities) && params?.cities.join(',') || params?.cities || 'global'

  try {
    const auth = generateApiCall(`/api/v2/agenda?${cities ? `cities=${cities}` : ''}${timeframe ? `&timeframe=${timeframe}` : ''}`);
    const res = await fetch(auth);
    const status = res?.status
    const data = await res?.json()

    if (status === 200) {
      return data.data
    } else {
      return []
    }
  } catch (e) {
    console.log(e)
  }
}

export function isVideoConsented() {
  const urlParams = new URLSearchParams(window.location.search);
  const tracking = urlParams.get('tracking') === 'true';
  const mobile = urlParams.get('mobileApp') === 'true';
  if (!!mobile && !tracking) return true
  return hasConsented()
}
export function eraseCookie(name) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export const localizeUrl = (path, locale) => {
  if (locale === 'default') return path
  return `/${locale}${path}`
}

export const pzTrack = (name, props) => {
  const consent = window?.localStorage.getItem('GlowCookies')
  if (consent != 1 || !window?.gtag) return
  window.gtag('event', name, props)
}



export const isPast = (date) => {
  const now = new Date()
  const eventDate = new Date(date)

  if (now > eventDate) {
    return true
  }
  return false
}

export const isNow = (date, end) => {
  const now = new Date()
  const eventDate = new Date(date)
  const eventEnd = new Date(end)

  if (now > eventDate && now < eventEnd) {
    return true
  }
  return false
}