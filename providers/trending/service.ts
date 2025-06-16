import ClientBaseService from "@/libs/client/base.service"

class TrendingService extends ClientBaseService {
  prefix = "/api"

  async getTrendingArticles() {
    return this.post({
      filters: {
        name: "content-trending-news",
      },
      pagination: {
        page: 1,
        page_size: 1
      },
      sorters: ["_id", -1]
    }, `${this.prefix}/trending`, {
      headers: {
        "Content-Type": "application/json"
      }
    })
  }
}

const trendingService = new TrendingService()
export default trendingService
