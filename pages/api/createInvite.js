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

export const config = {
  runtime: 'edge',
};
 

export default async function (req, res) {
  try {
    const { searchParams } = new URL(req.url);
    const text = decodeURIComponent(searchParams.get('text'))
    const filename = decodeURIComponent(searchParams.get('filename'))
    return new Response(
      text,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/calendar; charset=utf-8',
          'Content-Disposition': `inline; filename="${filename}"`,
          'Access-Control-Allow-Origin': 'https://www.remometro.com',
          'Cache-Control': 'maxage=0, s-maxage=300, stale-while-revalidate=300'
        },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({error: "uknown"}),
      {
        status: 500,
        headers: {
          'content-type': 'application/json',
        },
      },
    )
  }
}