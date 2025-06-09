import { NextResponse, NextRequest } from "next/server"

export async function GET() {
  const api_url = process.env.MACHINA_CLIENT_URL
  const bearer = process.env.MACHINA_API_KEY

  try {
    const response = await fetch(`${api_url}/document/6846fc54836fbc9505c05fe4`, {
      headers: {
        "X-Api-Token": `${bearer}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 },
    })

    const data = await response.json()

    if (data) {
      return NextResponse.json({ standings: data })
    }

    return NextResponse.json({ error: "Standings not found" }, { status: 404 })

  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
} 