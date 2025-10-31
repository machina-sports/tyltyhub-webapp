import { NextResponse, NextRequest } from "next/server"

export async function GET(req: NextRequest) {
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
        "filters": {
          "name": "website-competition-filters"
        },
        "sorters": ["_id", -1],
        "page": 1,
        "page_size": 1
      }),
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`)
      return NextResponse.json({
        data: [],
        total_documents: 0
      })
    }

    const data = await response.json()
    
    // Extract competition filters from the document structure
    if (data.data && data.data.length > 0) {
      const document = data.data[0]
      const filters = document.value?.[0]?.items || []
      return NextResponse.json({ 
        data: filters,
        total_documents: filters.length 
      })
    }

    return NextResponse.json({
      data: [],
      total_documents: 0
    })

  } catch (e: any) {
    console.error('Competition Filters API Error:', e)
    return NextResponse.json({
      data: [],
      total_documents: 0
    })
  }
}

