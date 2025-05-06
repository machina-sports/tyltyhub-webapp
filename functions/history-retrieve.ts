import { config } from "@/libs/config"

export async function fetchHistoryRetrieve() {
  try {
    const post_url = `${config.MACHINA_CLIENT_URL.replace(/\/$/, '')}/document/search`

    const response = await fetch(post_url, {
      headers: {
        "X-Api-Token": config.MACHINA_API_KEY,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        "filters": {},
        "sorters": [
          "_id",
          -1
        ],
        "page": 1,
        "page_size": 100
      }),
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