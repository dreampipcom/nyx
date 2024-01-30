import { get, set } from "lodash"

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

var wait = false

const shimMemo = {

}

const lock = new WeakMap();
async function using(resource, then) {
  while (lock.has(resource)) {
    try {
      await lock.get(resource);
    } catch { }
  }

  const promise = Promise.resolve(then(resource));
  lock.set(resource, promise);

  try {
    return await promise;
  } finally {
    lock.delete(resource);
  }
}

export async function fetchWithRetry(url, options = { cache: 'force-cache', next: { revalidate: 3600 } }, retries = 3, retryDelay = 1000, parentUrl) {
  for (let i = 0; i < retries; i++) {
    let wasWaiting = false
    if (!!wait) {
      await delay(1000)
      wasWaiting = true
    }
    if (wasWaiting) {
    }
    try {
      if (shimMemo[parentUrl] || shimMemo[url]) {
        return shimMemo[url] || shimMemo[parentUrl]
      } else {
      }
      const response = await fetch(url);
      const shim = await response.arrayBuffer()
      shimMemo[url] = shim
      shimMemo[parentUrl] = shim

      if (!response.ok) { // if you want to retry on specific HTTP status codes
        throw new Error('Response was not ok');
      }

      return shim; // or whatever you want to return
    } catch (error) {
      if (i < retries - 1) {  // if not the last retry attempt
        wait = true
        await delay(retryDelay * (i + 2 / 2)); // wait before next attempt
        wait = false
      } else {
        throw error;  // if the last retry attempt, throw the error
      }
    }
  }
}

export async function addPlaceholders(data) {
  if (!data) return data
  const { getPlaiceholder } = await import("plaiceholder");

  const addToItem = async (item, data, index, key) => {
    const url = item?.placeholder?.url || item?.flier?.url || item?.image?.url || item?.featuredImage?.url
    if (!url) return data
    const src = url + "?fm=jpg&q=1";
    const buffer = await using(shimMemo, async () => {
      return await fetchWithRetry(src, {}, 10, 1001, item?.url).then(async (res) => {
        const buffer2 = Buffer.from(res)
        return buffer2
      }).catch(e => console.error(e));
    })



    const { base64 } = await getPlaiceholder(buffer);
    set(data[index], `placeholderUrl`, base64)

    return data
  }

  const add = async (data, key) => {
    try {
      let coarsed = []
      if (!data.length) coarsed = [{ ...data }]
      else coarsed = [...data]
      let updated = []
      let promises = []
      for (const [index, item] of coarsed.entries()) {
        let clone = [...coarsed]
        if (key) {
          clone = { ...item }
          let nested = get(clone, key)
          if(!nested.length) return coarsed
          for (const [indexN, itemN] of nested.entries()) {
            promises.push(async () => {
              let _key = key
              let _clone = clone
              let _nested = nested
              let _itemN = itemN
              let _indexN = indexN
              const result = await addToItem(_itemN, _nested, _indexN)
              set(_clone, _key, _nested)
              updated = _clone
              return updated
            })
          }
        } else {
          promises.push(async () => {
            let _item = item
            let _clone = clone
            let _index = index
            const result = await addToItem(_item, _clone, _index)
            if (!data.length) updated = result
            else updated[_index] = result[_index]
            return updated
          })
        }
      }
      const chunked = chunk(promises, 75);
      for (const [index, group] of chunked.entries()) {
        await Promise.all(group.map(func => func()));
        if (chunked.length > 1 && index < chunked.length - 1) {
          wait = true
          setTimeout(() => { wait = false }, 1000)
        }
      }
      return updated
    } catch (err) {
      console.log(err);
    }
  }
  try {
    let response = await add(data)

    const nested1 = data?.warmUpCollection?.items
    const nested2 = data?.episodesCollection?.items
    const nested3 = data?.linkedFrom?.episodesCollection?.items

    if (nested1) response = await add(response, "warmUpCollection.items")
    if (nested2) response = await add(response, "episodesCollection.items")
    if (nested3) response = await add(response, "linkedFrom.episodesCollection.items")

    if (Array.isArray(response) && !data.length) return response[0]
    return response


  } catch (err) {
    console.log(err);
  }
}