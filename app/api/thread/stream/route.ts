import { NextRequest } from "next/server"
import { getAgentId } from "@/lib/agent-config"

export async function POST(req: NextRequest) {
  const api_url = process.env.MACHINA_CLIENT_URL
  const bearer = process.env.MACHINA_API_KEY
  const brandId = process.env.NEXT_PUBLIC_BRAND || 'bwin'
  const agentId = getAgentId(brandId)

  const headers = {
    "X-Api-Token": `${bearer}`,
    "Content-Type": "application/json",
  }

  try {
    const body = await req.json()
    
    // Forward request to Flask backend streaming endpoint (brand-specific agent)
    const response = await fetch(`${api_url}/agent/stream/${agentId}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return new Response(
        JSON.stringify({ type: "error", content: `Backend error: ${response.status}` }),
        { 
          status: response.status,
          headers: { "Content-Type": "application/json" }
        }
      )
    }

    // Stream the response back to the client
    return new Response(response.body, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    })
  } catch (error) {
    console.error("Error in thread stream:", error)
    return new Response(
      JSON.stringify({ 
        type: "error", 
        content: error instanceof Error ? error.message : "Stream failed" 
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    )
  }
}
