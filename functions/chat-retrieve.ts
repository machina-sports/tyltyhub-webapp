export async function fetchChatRetrieve({
  thread_id,
}: {
  thread_id: string
}): Promise<any> {
  try {

    const bearer = process.env.MACHINA_API_KEY

    const post_url =
      process.env.MACHINA_CLIENT_URL +
      "/document/" +
      thread_id

    const response = await fetch(post_url, {
      headers: {
        "X-Api-Token": `${bearer}`,
        "Content-Type": "application/json",
      },
      method: "GET",
      next: { revalidate: 5 },
    })
    const result = await response.json()

    if (result["status"] == true) {
      return { error: false, data: result["data"] }
    }
    return { error: true, data: [] }
  } catch (error) {
    console.error(error)
    return { error: true, data: [] }
  }
}