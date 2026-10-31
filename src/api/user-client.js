const back = import.meta.env.VITE_BACK

export default {
  async get() {
    try {
      const response = await fetch(`${back}/sessions/current`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (response.status !== 200) {
        throw data
      }
      return data
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

      if (response.status !== 201) {
        throw await response.json()
      }
      const data = (await response.json()).data
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

      if (response.status !== 201) {
        throw await response.json()
      }
      const data = (await response.json()).data
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },
}
