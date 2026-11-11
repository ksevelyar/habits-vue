import { requestJson } from '@/requests/request'

export default {
  get() {
    return requestJson('/sessions/current')
  },

  async login(user) {
    const responseBody = await requestJson('/sessions', {
      method: 'POST',
      body: JSON.stringify(user),
    })

    return responseBody.data
  },

  async register(user) {
    const responseBody = await requestJson('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    })

    return responseBody.data
  },
}
