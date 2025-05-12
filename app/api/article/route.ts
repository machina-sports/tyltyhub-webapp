import { NextResponse, NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const id = searchParams.get('id')
  const api_url = process.env.MACHINA_CLIENT_URL
  const bearer = process.env.MACHINA_API_KEY

  if (!id) {
    return NextResponse.json({ error: "Article ID is required" }, { status: 400 })
  }

  try {
    // Check if it's a slug or ID
    const isObjectId = /^[0-9a-f]{24}$/i.test(id)
    const filters = isObjectId ? { "_id": id } : { "value.slug": id }

    const response = await fetch(`${api_url}/document/search`, {
      method: "POST",
      headers: {
        "X-Api-Token": `${bearer}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filters,
        "page": 1,
        "page_size": 1
      }),
      next: { revalidate: 0 },
    })

    const data = await response.json()

    if (data.status && data.data && data.data.length > 0) {
      return NextResponse.json({ article: data.data[0] })
    }

    return NextResponse.json({ error: "Article not found" }, { status: 404 })

  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const id = searchParams.get('id')
  const api_url = process.env.MACHINA_CLIENT_URL
  const bearer = process.env.MACHINA_API_KEY

  if (!id) {
    return NextResponse.json({ error: "Article ID is required" }, { status: 400 })
  }

  try {
    // Check if it's a slug or ID
    const isObjectId = /^[0-9a-f]{24}$/i.test(id)
    const filters = isObjectId ? { "_id": id } : { "value.slug": id }

    // First get the article to get its ID
    const searchResponse = await fetch(`${api_url}/document/search`, {
      method: "POST",
      headers: {
        "X-Api-Token": `${bearer}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filters,
        "page": 1,
        "page_size": 1
      }),
      next: { revalidate: 0 },
    })

    const searchData = await searchResponse.json()
    
    if (!searchData.status || !searchData.data || searchData.data.length === 0) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    const articleId = searchData.data[0]._id

    // Then increment views using the article ID
    const response = await fetch(`${api_url}/document/views`, {
      method: "POST",
      headers: {
        "X-Api-Token": `${bearer}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "_id": articleId
      }),
      next: { revalidate: 0 },
    })

    const data = await response.json()
    return NextResponse.json(data)

  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
} 