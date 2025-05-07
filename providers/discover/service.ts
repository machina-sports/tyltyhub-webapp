import ClientBaseService from "@/libs/client/base.service"

class DiscoverService extends ClientBaseService {
  prefix = "/api"

  async searchArticles({ filters, pagination, sorters }: { filters: any, pagination: any, sorters: any }) {
    return this.post({ filters, pagination, sorters }, `${this.prefix}/articles`, {})
  }
}

const discoverService = new DiscoverService
export default discoverService
