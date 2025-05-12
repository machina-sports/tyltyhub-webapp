import ClientBaseService from "@/libs/client/base.service"

class ArticleService extends ClientBaseService {
  prefix = "/api"

  async searchArticles({ filters, pagination, sorters }: { filters: any, pagination: any, sorters: any }) {
    return this.post({ filters, pagination, sorters }, `${this.prefix}/articles`, {})
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
