import axios from 'axios'

function getAuthCookie(cookies: any) {
  const decodedCookies = cookies.split(';')
  const cookie = decodedCookies.find((i: any) => i.match('machina_session_key=')) || ''
  const token = cookie.replace('machina_session_key=', '')
  return token
}

class BaseController {

  url = process.env.NEXT_PUBLIC_WEBAPP_API_ADDRESS

  async fetch(url: string, options: any) {
    const token = getAuthCookie(window.document.cookie)
    const requestOp = { ...options }
    requestOp.headers = options.headers || {}
    requestOp.method = options.method || {}
    requestOp.params = options.params || {}
    requestOp.validateStatus = options.validateStatus || undefined

    if (!requestOp.headers['Content-Type']) {
      requestOp.headers['Content-Type'] = 'application/json'
    }
    if (token !== '') {
      requestOp.headers['X-Session-Token'] = token
    }

    const {
      headers: requestHeaders,
      body: requestBody,
      method: requestMethod,
      params: requestParams,
    } = requestOp

    const requestUrl = options.local ? url : `${this.url}/${url}`

    return await axios({
      headers: requestHeaders,
      url: requestUrl,
      data: requestBody,
      method: requestMethod,
      params: requestParams
    })
      .then((response) => response ? response.data : null)
      .catch((error) => { throw error.response.data })
  }

  get(url: string, options: any) {
    return this.fetch(url, { ...options, method: 'GET' })
  }

  patch(url: string, body: any, options: {}) {
    return this.fetch(url, { ...options, method: 'PATCH', body })
  }

  post(url: string, body: any, options = {}) {
    return this.fetch(url, { ...options, method: 'POST', body })
  }

  put(url: string, body: any, options = {}) {
    return this.fetch(url, { ...options, method: 'PUT', body })
  }

  delete(url: string, body = {}) {
    return this.fetch(url, { method: 'DELETE', body })
  }
}

export default new BaseController()