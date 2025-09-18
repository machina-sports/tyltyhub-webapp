import { NextResponse, NextRequest } from "next/server"

export async function POST(req: NextRequest) {

  const { filters, pagination, sorters } = await req.json()

  const api_url = process.env.MACHINA_CLIENT_URL

  const bearer = process.env.MACHINA_API_KEY

  const headers = {
    "X-Api-Token": `${bearer}`,
    "Content-Type": "application/json",
  }

  try {
    const response = await fetch(`${api_url}/document/search`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        "filters": filters,
        "sorters": sorters,
        "page": pagination.page,
        "page_size": pagination.page_size
      }),
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`)
      // Return empty data structure instead of error to prevent UI breaking
      return NextResponse.json({
        data: [],
        total_documents: 0,
        page: 1,
        page_size: pagination.page_size
      })
    }

    const data = await response.json()

    return NextResponse.json(data)

  } catch (e: any) {
    console.error('Trending API Error:', e)
    // Return empty data structure instead of error to prevent UI breaking
    return NextResponse.json({
      data: [],
      total_documents: 0,
      page: 1,
      page_size: pagination.page_size || 1
    })
  }
}
