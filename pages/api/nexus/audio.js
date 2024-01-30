// // // nexing things up
// import httpProxy from 'http-proxy'

// const API_URL = process.env.AUDIO_URL || 'https://stream.0.radio.media.infra.remometro.com/main' // The actual URL of your API

// const proxy = httpProxy.createProxyServer()

// export default async function handler(req, res) {
//   	return new Promise((resolve, reject) => {

//   const options = {
// 	host: 'https://stream.0.radio.media.infra.remometro.com', // Replace with your target host
// 	path: '/main',
//     method: 'GET',
// 	headers: req.headers,
// 	rejectUnauthorized: false,
//   }

//   		proxy.web(req, res, { target: API_URL, changeOrigin: true, toProxy: true }, (err) => {
// 			if (err) {
// 				return reject(err)
// 			}
// 			resolve()
// 		})

//   	})
// }

// import { NextApiRequest, NextApiResponse } from 'next'
// import httpProxyMiddleware from '../../../lib/server/next-proxy.ts'

// export const config = {
//     api: {
//         externalResolver: true,
//         bodyParser: false
//     }
// }

// export const dynamic = 'force-dynamic';

// export const maxDuration =  256


// export default (req, res) => {
// httpProxyMiddleware(req, res, {
//         changeOrigin: true,
//         target: 'https://stream.0.radio.media.infra.remometro.com',
//         pathRewrite: [
//             {
//                 patternStr: '/api/nexus/audio', // this url is the one we are using on client side
//                 replaceStr: '/main' // remove above pattern from target url
//             }
//         ],
//         onProxyInit: proxy => { // This is optional
//             proxy.on('proxyReq', proxyReq => {
//             		//proxyReq.setHeader('Accept', 'application/ogg')
//                     proxyReq.setHeader('Accept', 'application/ogg')
//                     req.pipe(proxyReq, { end: true });
//                     //res.setHeader('Content-Type', 'application/ogg,audio/ogg')
//             })
//         }
//     })
// return
// }

// export default (oreq, ores) => {
// const options = {
//     // host to forward to
//     host: 'www.google.com',
//     // port to forward to
//     port: 80,
//     // path to forward to
//     path: '/api/BLABLA',
//     // request method
//     method: 'POST',
//     // headers to send
//     headers: oreq.headers,
//   };

//     console.log({ oreq: oreq.headers })

// const https = require('https')

// const options = {
//  host: 'stream.0.radio.media.infra.remometro.com', // Replace with your target host
//  path: '/main',
//  port: 443,
//  method: 'GET',
//  headers: { 'Accept': 'application/ogg'},
//  rejectUnauthorized: false,
// }

// const creq = https
//  .request(options, pres => {
//       console.log(pres)
//       // set encoding
//       pres.setEncoding('utf8');

//       // set http status code based on proxied response
//       ores.writeHead(pres.statusCode);

//       // wait for data
//       pres.on('data', chunk => {
//         ores.write(chunk);
//       });

//       pres.on('close', () => {
//         // closed, let's end client request as well
//         ores.end();
//       });

//       pres.on('end', () => {
//         // finished, let's finish client request as well
//         ores.end();
//       });
//  })
//  .on('error', e => {
//       // we got an error
//       console.log(e.message);
//       try {
//         // attempt to set error message and http status
//         ores.writeHead(500);
//         ores.write(e.message);
//       } catch (e) {
//         // ignore
//       }
//       ores.end();
//  });

//  ores.writeHead(200)
//  return

// }

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 3000 } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal  
  });
  clearTimeout(id);

  return response;
}


export const generateApiCall = (path) => {
  if (process.env.NEXT_PUBLIC_DEV) {
    if (process.env.NEXT_PUBLIC_LOCAL) {
      return `http://localhost:8080` + path
    }
    return `https://beta.remometro.com` + path
  }
  return 'https://www.remometro.com' + path
}

// // nexing things up

export default async function handler(req, res) {

    const POOL_SIZE = 17
    const CHUNK_SIZE = 2
    const BACKUP = "/api/nexus/audio/3"

    const checkSource = async (source) => {
        if(!source) return false
        console.log({ source })
        try {
          const response = await fetchWithTimeout(source)
          if (response.status === 200) return source
          return false
        } catch (e) {
          return false
        }
    }

      for (let i = 0; i <= POOL_SIZE; i++) {
          const sources = []
          let counter = 0
          const working = []
          if (i % counter !== 0) {
            const check = checkSource(generateApiCall(`/api/nexus/audio/${i + counter}`))
            if(check) sources.push(check)

            const promises = await Promise.allSettled(sources)
            promises.forEach(source => {
              if(!!source?.value) {
                working.push(source)
              }
            })
            console.log({ sources, promises, working })

            if(working[0]?.value) return res.redirect(working[0].value)
            counter += 3
          }
      }

      console.log("trying backup", e)
      const response = await fetchWithTimeout(generateApiCall(BACKUP))
      if (response.status === 200) res.redirect(BACKUP)
      else return res.end("ERROROR")
    
    return res.end("no donut")
}