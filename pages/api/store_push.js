import { NextResponse } from "next/server"

const apiKey = process.env.CLOUD_API_KEY

export const config = {
  runtime: 'edge',
};


export default async function (req, res) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('data')
    const project = searchParams.get('project') || "test"
    const locale = searchParams.get('locale') || "en_US"
    
    const endpoint = `https://eu-west-1.aws.data.mongodb-api.com/app/application-0-pdnug/endpoint/add_push?authplusadvancedextra=${process.env.CLOUD_SECRET}&project=${project}&data=${encodeURIComponent(token)}&locale=${locale}`;
    
    if (!token.includes("ExponentPushToken")) {
     throw new Error("Missing token")
    }

    const options = {
      method: 'GET',
      headers: {
        'api-key': apiKey
      }
    }

    const res = (await fetch(endpoint, options))

    const headers = {
      'content-type': 'application/json',
      //'Access-Control-Allow-Origin': 'https://www.remometro.com',
      //'Cache-Control': 'maxage=0, s-maxage=300, stale-while-revalidate=300'
    }
    return NextResponse.json({ token, ok: res.ok }, { status: 200, headers })
  } catch (error) {
    console.log({ error })
    return NextResponse.json({ error: "Invalid API call" }, { status: 500 })
  }
}