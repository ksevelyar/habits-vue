const back = import.meta.env.VITE_BACK

export default {
  async index(date) {
    try {
      const response = await fetch(`${back}/metrics?date=${date}`, {
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

  async charts(startDate, endDate) {
    try {
      const searchParams = new URLSearchParams({ start_date: startDate, end_date: endDate })
      const response = await fetch(`${back}/charts?${searchParams}`, {
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

  async history() {
    try {
      const response = await fetch(`${back}/metrics_history`, {
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

  async upsert(metric) {
    try {
      const response = await fetch(`${back}/metrics`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric),
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
}
