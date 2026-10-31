const backendBaseUrl = import.meta.env.VITE_BACK

export default {
  async index(date) {
    try {
      const response = await fetch(`${backendBaseUrl}/metrics?date=${date}`, {
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
      const response = await fetch(`${backendBaseUrl}/charts?${searchParams}`, {
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
      const response = await fetch(`${backendBaseUrl}/metrics_history`, {
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
      const response = await fetch(`${backendBaseUrl}/metrics`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric),
      })
      const data = await response.json()

      if (!response.ok) {
        throw data
      }

      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async delete(metric) {
    try {
      const metricQuery = new URLSearchParams({
        date: metric.date,
        chain_id: String(metric.chain_id),
      })
      const response = await fetch(`${backendBaseUrl}/metrics?${metricQuery}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) {
        const error = await response.json()
        throw error
      }
    } catch (error) {
      return Promise.reject(error)
    }
  },
}
