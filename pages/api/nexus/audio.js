async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 3000 } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const promise = await fetch(resource, {
    ...options,
    signal: controller.signal  
  });

  const response = promise
  clearTimeout(id);

  return response;
}


export const generateRadioApiCall = (path) => {
  const coercedPath = path || 0
  if (process.env.NEXT_PUBLIC_DEV) {
    if (process.env.NEXT_PUBLIC_LOCAL) {
      return `http://localhost:8080/api/nexus/audio/` + coercedPath
    }
    return `https://beta.dreampip.com/api/nexus/audio/` + coercedPath
  }
  return 'https://www.dreampip.com/api/nexus/audio/' + coercedPath
}

// // nexing things up

export default async function handler(req, res) {
    console.log("RUNTIME")
    const POOL_SIZE = 17
    const CHUNK_SIZE = 2
    const BACKUP = 3
    const memo = {
      found: false
    }

    const checkSource = async (source) => {
        if(!source) return false
        try {
          const response = await fetchWithTimeout(source)
          if (response.status === 200) return source
          return false
        } catch (e) {
          console.log(e)
        }
    }

    const BASE = `https://www.dreampip.com/api/nexus/audio/`

    const sourcesUrl = []
      for (let i = 0; i <= POOL_SIZE; i++) {
          const sources = []

          let counter = 0
          const working = []
          if (i % counter !== 0) {
            const url = generateRadioApiCall(`${i + counter}`)
            const check =  checkSource(url)
            if(check) {
              sourcesUrl.push(url)
              sources.push(check)
            }

            const promises = await Promise.allSettled(sources)
  
            for (const source of promises) {
              if(!!source) {
                console.log("SOURCE")
                // res.setHeader('Referrer-Policy', "same-origin")
                if (!memo?.found) {
                memo.found = true
                return res.redirect(303, sourcesUrl[i])
                }
              }
            }

            counter += 3
          }
      }

      console.log("trying backup")
      const response = await fetchWithTimeout(BASE + '0')
      // res.setHeader('Referrer-Policy', "same-origin")
      if (response.status === 200) return res.redirect(303, BASE + '0');
    
    return res.end("no donut")
}