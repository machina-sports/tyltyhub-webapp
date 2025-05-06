import { getRuntimeConfig } from '@/config/runtime'

export async function fetchGameRetrieve({
  slug,
}: {
  slug: string
}): Promise<any> {
  try {

    const config = await getRuntimeConfig()

    const imageAddress = config.imageContainerAddress

    const bearer = process.env.MACHINA_API_KEY

    const post_url = process.env.MACHINA_CLIENT_URL + "/document/search"

    const body = JSON.stringify({
      "filters": {
        "value.slug": {
          "$in": [slug]
        }
      },
      "page": 1,
      "page_size": 10,
      "sorters": ["_id", -1]
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

    const parsedList: any[] = []

    if (result["status"] == true) {
      const posts = result["data"]
      posts.map((post: any) => {
        const new_post = {
          ...post["metadata"],
          ...post["value"],
          date: post["created"],
          category: post["value"]["season_name"],
          title: post["value"]["title"],
          text: post["value"]["introduction"],
          widget_match_embed: post["value"]["widget-match-embed"],
        }
        if (post["name"] == "content-recap") {
          new_post["image"] = `${imageAddress}/image-recap-${post["metadata"]["event_code"]}.webp`
        } else {
          new_post["image"] = `${imageAddress}/image-preview-${post["metadata"]["event_code"]}.webp`
        }
        parsedList.push(new_post)
      })
      return { error: false, items: parsedList }
    }
    return { error: true, items: parsedList }
  } catch (error) {
    console.error(error)
    return { error: true, items: [] }
  }
}