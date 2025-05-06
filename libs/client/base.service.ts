import api from "@/libs/client/base.controller"

class ClientBaseService {

  prefix = ""

  api = api

  get(prefix = this.prefix, options: any) {
    return api.get(prefix, options)
  }

  patch(body: any, prefix = this.prefix, options: any) {
    return api.patch(`${prefix}`, body, options)
  }

  post(body: any, prefix = this.prefix, options: any) {
    return api.post(prefix, body, options)
  }

  put(body: any, prefix = this.prefix, options: any) {
    return api.put(`${prefix}`, body, options)
  }

  delete(prefix = this.prefix, body = {}) {
    return api.delete(prefix, body)
  }
}

export default ClientBaseService