import { NextResponse, NextRequest } from "next/server"
import { processMessageContent } from "@/lib/betting-links"

export async function GET(req: NextRequest) {

  const thread_id = req.nextUrl.searchParams.get('thread_id')

  const api_url = process.env.MACHINA_CLIENT_URL

  const bearer = process.env.MACHINA_API_KEY

  const headers = {
    "X-Api-Token": `${bearer}`,
    "Content-Type": "application/json",
  }

  try {
    const response = await fetch(`${api_url}/document/${thread_id}`, {
      method: "GET",
      headers: headers,
    })

    const data = await response.json()

    // Process betting links in messages
    if (data?.data?.value?.messages) {
      const brandId = process.env.NEXT_PUBLIC_BRAND || 'bwin';
      data.data.value.messages = data.data.value.messages.map((message: any) => ({
        ...message,
        content: processMessageContent(message.content, brandId)
      }));
    }

    return NextResponse.json(data)

  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {

  const body = await req.json()

  const thread_id = body.thread_id

  const message = body.message

  const api_url = process.env.MACHINA_CLIENT_URL

  const bearer = process.env.MACHINA_API_KEY

  const headers = {
    "X-Api-Token": `${bearer}`,
    "Content-Type": "application/json",
  }

  try {
    const response = await fetch(`${api_url}/document/${thread_id}`, {
      method: "GET",
      headers: headers,
    })

    const data = await response.json()

    const messages = data?.data?.value?.messages

    try {
      const response = await fetch(`${api_url}/document/${thread_id}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({
          value: {
            ...data?.data?.value,
            messages: [...messages, { role: "user", date: new Date().toISOString(), content: message }],
            status: "waiting"
          }
        })
      })

      const result = await response.json()

      return NextResponse.json(result)

    } catch (e: any) {
      console.error(e)
      return NextResponse.json({ error: e.message }, { status: 500 })
    }

  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
