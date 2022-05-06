const back = import.meta.env.VITE_BACK

export default {
  async get(id) {
    try {
      const response = await fetch(`${back}/report/${id}`, {
        method: 'GET',
        header: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })
      return response.json()
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async upsert(report) {
    try {
      const response = await fetch(`${back}/reports`, {
        body: JSON.stringify({report}),
        method: 'POST',
        header: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })
      return response.json()
    } catch (error) {
      return Promise.reject(error)
    }
  }
}