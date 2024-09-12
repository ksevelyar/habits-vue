const back = import.meta.env.VITE_BACK

export default {
  async index(date) {
    try {
      const response = await fetch(`${back}/metrics?date=${date}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })

      return response.json()
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async history() {
    try {
      const response = await fetch(`${back}/metrics_history`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
      return response.json()
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async show(id) {
    try {
      const response = await fetch(`${back}/metrics/${id}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })

      return response.json()
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async upsert(metric) {
    try {
      const response = await fetch(`${back}/metrics`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric),
      })

      const data = await response.json()

      if (response.status != 200) { throw data }

      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async delete(metric) {
    try {
      const response = await fetch(`${back}/metrics${metric.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await response.json()
      if (response.status != 200) { throw data }

      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },
}
