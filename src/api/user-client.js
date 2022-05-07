const back = import.meta.env.VITE_BACK

export default {
  async get () {
    try {
      const response = await fetch(`${back}/user`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
      return response.json()
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
