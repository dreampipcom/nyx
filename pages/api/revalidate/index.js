// /pages/api/revalidate-post.js
import { revalidatePath } from 'next/cache'
import { LOCALES } from '../../../lib/cjs-constants'

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// export const config = {
//   maxDuration: 40,
// };

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

export default async function (req, res) {
  const promises = []
  async function revalidate(paths) {
    const willRevalidate = paths.filter(path => typeof path === 'string')
    for (const path of willRevalidate) {
      for (const locale of LOCALES) {
        promises.push(async () => {
          const dest = `/${locale}${path}`
          res.revalidate(dest)
          await delay(10000)
          return dest
        })
      }
    }
    return await Promise.all(promises.map((func) => func())).then((result) => {
      return res.json({ willRevalidate: result });
    }).catch((e) => {
      console.error(e)
      //return res.status(500).send('Couldnt Revalidate All')
    })
    //return res.json({ toRevalidate: willRevalidate });
  }

  if (req.query.secret !== process.env.REVALIDATE_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const toRevalidate = []
  try {
    const body = req.body

    let pageToRevalidate = "";
    let catToRevalidate = "";
    const directories = {
      'episodes': '/episode/',
      'posts': '/post/',
      'shows': '/show/',
      'pages': '/',
      'events': '/event/',
      'artists': '/artist/'
    }
    const directoriesMap = {
      'episodes': '/episodes',
      'posts': '/blog',
      'shows': '/shows',
      'pages': '',
      'events': '/events',
      'artists': '/artists'
    }

    const checkForLinked = async (id) => {
      if (!id) return
      const res = await fetchWithRetry(
        `https://preview.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENVIRONMENT}/entries/${id}?access_token=${process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN}`
      ).catch(e => { throw new Error(e) });
      if (res.ok) {
        const data = await res.json();
        return { type: data?.sys?.contentType?.sys?.id, url: data.fields.url, ...data }
      }
    }

    if (body?.sys?.type === "DeletedEntry") {
      const unpublishedData = await checkForLinked(body?.sys?.id);
      const type = unpublishedData.type
      const fullPath = directories[type] + unpublishedData.url
      pageToRevalidate = fullPath;
      catToRevalidate = directoriesMap[type]

      // await revalidate(pageToRevalidate);
      toRevalidate.push(pageToRevalidate)

      if (!!catToRevalidate) {
        // await revalidate(catToRevalidate);
        toRevalidate.push(catToRevalidate)
      }

      if (type === 'episodes') {
        if (!!unpublishedData?.fields?.show) {
          const show = checkForLinked(unpublishedData.fields.show['en-US']?.sys?.id)
          // // await revalidate(show.url);
          if (show) toRevalidate.push(show.url)
        }
        if (!!unpublishedData?.fields?.event) {
          const event = checkForLinked(unpublishedData.fields.event['en-US']?.sys?.id)
          // await revalidate(event.url);
          if (event) toRevalidate.push(event.url)
        }
        // await revalidate('');
        toRevalidate.push('')
      }

      if (type === 'posts') {
        // await revalidate('');
        toRevalidate.push('')
      }
    } else {
      let type = body?.sys?.contentType?.sys?.id
      catToRevalidate = directoriesMap[type] || ""
      pageToRevalidate = directories[type] + `${body.fields.url['en-US']}`;

      // await revalidate(pageToRevalidate);
      toRevalidate.push(pageToRevalidate)

      if (!!catToRevalidate) {
        // await revalidate(catToRevalidate);
        toRevalidate.push(catToRevalidate)
      }

      if (type === 'episodes') {
        if (!!body?.fields?.show) {
          const show = checkForLinked(body.fields.show['en-US'].sys?.id)
          // await revalidate(show.url);
          if (show) toRevalidate.push(show.url)
        }
        if (!!body?.fields?.event) {
          const event = checkForLinked(body.fields.event['en-US'].sys?.id)
          // await revalidate(event.url);
          if (event) toRevalidate.push(event.url)
        }
        // // await revalidate('');
        toRevalidate.push('')
      }

      if (type === 'posts') {
        // // await revalidate('');
        toRevalidate.push('')
      }
    }
    return await revalidate(toRevalidate);
  } catch (err) {
    console.log(err)
    return res.status(500).send(`Error revalidating: ${err.toString()}`);
  }
}