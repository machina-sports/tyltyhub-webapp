import { NextResponse, NextRequest } from "next/server"

export async function GET() {
  const api_url = process.env.MACHINA_CLIENT_URL
  const bearer = process.env.MACHINA_API_KEY

  const body = {
    "filters": {
      "metadata.sid": "sr:season:126393"
    },
    "sorters": [
      "_id",
      -1
    ],
    "page": 1,
    "page_size": 1,
  }

  try {
    const response = await fetch(`${api_url}/document/search`, {
      method: "POST",
      headers: {
        "X-Api-Token": `${bearer}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      next: { revalidate: 0 },
    })

    const payload = await response.json()

    const data = payload.data


    if (data && data[0]) {
      return NextResponse.json({ standings: data[0] })
    }

    return NextResponse.json({ error: "Standings not found" }, { status: 404 })

  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
} 