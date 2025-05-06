import axios from "axios"

class ClientBaseController {

  async fetch(url: string, options: any) {
    try {
      const requestOp = { ...options }
      requestOp.headers = options.headers || {}
      requestOp.method = options.method || {}
      requestOp.params = options.params || {}
      requestOp.validateStatus = options.validateStatus || undefined

      if (!requestOp.headers["Content-Type"]) {
        requestOp.headers["Content-Type"] = "application/json"
      }

      const {
        headers: requestHeaders,
        body: requestBody,
        method: requestMethod,
        params: requestParams,
      } = requestOp

      const response = await axios({
        url,
        headers: requestHeaders,
        data: requestBody,
        method: requestMethod,
        params: requestParams
      })
      
      return response ? response.data : null
    } catch (error: any) {
      if (error.response) {
        throw error.response.data
      } else {
        console.error('Network or axios error:', error.message)
        throw new Error('Failed to connect to the server')
      }
    }
  }

  get(url: string, options: any) {
    return this.fetch(url, { ...options, method: "GET" })
  }

  patch(url: string, body: any, options: {}) {
    return this.fetch(url, { ...options, method: "PATCH", body })
  }

  post(url: string, body: any, options = {}) {
    return this.fetch(url, { ...options, method: "POST", body })
  }

  put(url: string, body: any, options = {}) {
    return this.fetch(url, { ...options, method: "PUT", body })
  }

  delete(url: string, body = {}) {
    return this.fetch(url, { method: "DELETE", body })
  }
}

export default new ClientBaseController()