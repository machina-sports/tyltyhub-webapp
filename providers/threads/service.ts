import ClientBaseService from "@/libs/client/base.service"

class ProxyService extends ClientBaseService {
  prefix = "/api"

  async chat({ thread_id, message }: { thread_id: string, message: string }) {
    return this.post({ thread_id, message }, `${this.prefix}/chat`, {})
  }

  async placeBet({
    thread_id,
    bet_amount,
    bet_name,
    bet_odd,
    runner_name,
  }: {
    thread_id: string,
    bet_amount: number,
    bet_name: string,
    bet_odd: number,
    runner_name: string
  }) {
    return this.post({
      thread_id,
      bet_amount,
      bet_name,
      bet_odd,
      runner_name
    }, `${this.prefix}/bet/place`, {})
  }

  async retrieve({ thread_id }: { thread_id: string }) {
    return this.get(`${this.prefix}/chat?thread_id=${thread_id}`, {})
  }

  async search({
    filters,
    pagination,
    sorters
  }: { filters: any, pagination: any, sorters: any }) {

    return this.post({
      filters,
      pagination,
      sorters
    }, `${this.prefix}/history`, {})
  }

}

export default new ProxyService
