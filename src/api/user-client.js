const back = import.meta.env.VITE_BACK

export default {
  async get () {
    try {
      const response = await fetch(`${back}/user`, {
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      return response.json()
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
