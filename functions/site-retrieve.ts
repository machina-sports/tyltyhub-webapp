import { getRuntimeConfig } from '@/config/runtime'

export async function fetchSiteRetrieve(): Promise<any> {
  try {

    const config = await getRuntimeConfig()

    const imageAddress = config.imageContainerAddress

    const bearer = process.env.MACHINA_API_KEY

    const language = process.env.NEXT_PUBLIC_FEATURE_TOGGLE_LANGUAGE_SELECTED || "en"

    const post_url =
      process.env.MACHINA_CLIENT_URL +
      "/document/search"

    const body = JSON.stringify({
      "filters": {
        "name": {
          "$in": ["content-article"]
        },
        "metadata.language": {
          "$in": [language]
        },
        "metadata.article_type": {
          "$in": ["preview"]
        }
      },
      "page": 1,
      "page_size": 100,
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

    const latestList: any[] = []

    const upcomingList: any[] = []

    if (result["status"] == true) {
      const posts = result["data"]
      posts.map((post: any) => {
        const new_post = {
          ...post["value"],
          date: post["created"],
          text: post["value"]["subtitle"],
          author: "Machina Sports",
          readTime: "3 min",
          category: post["metadata"]["event_type"] || "soccer-game",
          competition: post["metadata"]["competition"] || "nba-game"
        }
        if (post["name"] == "content-recap") {
          new_post["image"] = `${imageAddress}/image-recap-${post["metadata"]["event_code"]}.webp`
          latestList.push(new_post)
        } else {
          new_post["image"] = `${imageAddress}/image-preview-${post["metadata"]["event_code"]}.webp`
          upcomingList.push(new_post)
        }
      })
      return { error: false, items: { latestList, upcomingList } }
    }
    return { error: true, items: { latestList, upcomingList } }
  } catch (error) {
    console.error(error)
    return { error: true, items: { latestList: [], upcomingList: [] } }
  }
}

export async function fetchTopQuestions() {
  try {

    const bearer = process.env.MACHINA_API_KEY

    const post_url = process.env.MACHINA_CLIENT_URL + "/document/search"

    const body = JSON.stringify({
      "filters": {
        "name": "blog-top-questions"
      },
      "sorters": [
        "_id",
        -1
      ],
      "page": 1,
      "page_size": 100
    })

    const response = await fetch(post_url, {
      body,
      headers: {
        "X-Api-Token": `${bearer}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    })

    const result = await response.json()

    return { error: false, items: result?.data?.[0]?.value || [] }

  } catch (error) {
    console.error(error)
    return { error: true, items: [] }
  }
}