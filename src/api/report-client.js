const back = import.meta.env.VITE_BACK

export default {
  async current() {
    try {
      const response = await fetch(`${back}/report`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      return (await response.json()).data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async upsert(report) {
    try {
      const response = await fetch(`${back}/reports`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      })
      return response.json()
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
