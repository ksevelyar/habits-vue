const back = import.meta.env.VITE_BACK

export default {
  async create(device) {
    try {
      const response = await fetch(`${back}/devices`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(device),
      })

      const data = (await response.json())

      if (response.status != 201) { throw data }
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },
}
