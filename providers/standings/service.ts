import ClientBaseService from "@/libs/client/base.service"

class StandingsService extends ClientBaseService {
  prefix = "/api"

  async getStandings() {
    const response = await this.get(`${this.prefix}/standings`, {})
    return response.standings
  }
}

const standingsService = new StandingsService()
export default standingsService 