const back = import.meta.env.VITE_BACK

export default {
  async get() {
    try {
      const response = await fetch(`${back}/sessions`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
      return response.json()
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async login(user) {
    try {
      const response = await fetch(`${back}/sessions`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })

      const data = (await response.json()).data

      if (response.status != 201) { throw data }
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async register(user) {
    try {
      const response = await fetch(`${back}/users`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })

      const data = (await response.json()).data

      if (response.status != 201) { throw data }
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
