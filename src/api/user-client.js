const backendBaseUrl = import.meta.env.VITE_BACK

export default {
  async get() {
    try {
      const response = await fetch(`${backendBaseUrl}/sessions/current`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (response.status !== 200) {
        const sessionError = new Error(
          `Current session request failed with status ${response.status}`,
        )
        sessionError.status = response.status
        throw sessionError
      }
      return await response.json()
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async login(user) {
    try {
      const response = await fetch(`${backendBaseUrl}/sessions`, {
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
      const response = await fetch(`${backendBaseUrl}/users`, {
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
