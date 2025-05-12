import ClientBaseService from "@/libs/client/base.service"

class ArticleService extends ClientBaseService {
  prefix = "/api"

  async searchArticles(params = {
    page: 1,
    pageSize: 10,
    language: 'br',
    filters: {},
    search: ''
  }) {
    try {
      const baseFilters = {
        "name": "content-article",
        "metadata.language": params.language,
        ...params.filters
      }

      // Add search query to filters if provided
      let searchFilters = { ...baseFilters }
      if (params.search && params.search.trim()) {
        searchFilters = {
          ...baseFilters,
          $or: [
            { "value.title": { $regex: params.search, $options: "i" } },
            { "value.subtitle": { $regex: params.search, $options: "i" } },
            { "value.section_1_content": { $regex: params.search, $options: "i" } },
            { "value.section_2_content": { $regex: params.search, $options: "i" } }
          ]
        } as any;
      }

      const body = {
        "filters": searchFilters,
        "sorters": [
          "_id",
          -1
        ],
        "pagination": {
          "page": params.page,
          "page_size": params.pageSize
        }
      }

      const result = await this.post(body, `${this.prefix}/articles`, {})
      
      if (result && result.status === true) {
        return { 
          error: false, 
          data: result.data || [],
          total_documents: result.total_documents || 0
        }
      }
      
      console.error("API request failed:", result);
      return { error: true, data: null }
    } catch (error) {
      console.error("Error fetching articles:", error)
      return { error: true, data: null }
    }
  }

  async getArticle(id: string) {
    const response = await this.get(`${this.prefix}/article?id=${encodeURIComponent(id)}`, {});
    return response?.article || response;
  }

  async getRelatedArticles(params: { eventType?: string, competition?: string, language?: string }) {
    const queryParams = new URLSearchParams()
    if (params.eventType) queryParams.append('eventType', params.eventType)
    if (params.competition) queryParams.append('competition', params.competition)
    if (params.language) queryParams.append('language', params.language)

    return this.get(`${this.prefix}/article/related?${queryParams.toString()}`, {})
  }
}

const articleService = new ArticleService()
export default articleService
