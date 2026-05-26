const back = import.meta.env.VITE_BACK

export default {
  async list() {
    try {
      const response = await fetch(`${back}/tasks`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
      return response.json()
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async get(id) {
    try {
      const response = await fetch(`${back}/tasks/${id}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
      return response.json()
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async create(task) {
    try {
      const response = await fetch(`${back}/tasks`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      })

      const data = await response.json()

      if (response.status != 201) { throw data }
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async update(task) {
    try {
      const response = await fetch(`${back}/tasks/${task.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      })

      const data = await response.json()

      if (response.status != 200) { throw data }
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },
}
