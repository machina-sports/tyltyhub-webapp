export async function fetchChatRegister({
  query,
  eventCode,
  user_id
}: {
  query: string,
  eventCode: string,
  user_id: string
}): Promise<any> {
  try {

    const bearer = process.env.MACHINA_API_KEY

    const post_url =
      process.env.MACHINA_CLIENT_URL +
      "/document"

    const newMessage = {
      "role": "user",
      "content": query,
      "date": new Date().toISOString()
    }

    const body = JSON.stringify({
      "name": "thread",
      "metadata": {
        "agent_id": "123",
        "event_code": eventCode,
        "user_id": user_id
      },
      "value": {
        "messages": [newMessage],
        "status": "waiting"
      }
    })

    const response = await fetch(post_url, {
      body,
      headers: {
        "X-Api-Token": `${bearer}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      next: { revalidate: 60 },
    })
    const result = await response.json()

    if (result["status"] == true) {
      return { error: false, items: result["data"] }
    }
    return { error: true, items: [] }
  } catch (error) {
    console.error(error)
    return { error: true, items: [] }
  }
}