const back = import.meta.env.VITE_BACK

export default {
  async list() {
    try {
      const response = await fetch(`${back}/chains`, {
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
      const response = await fetch(`${back}/chains/${id}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
      return response.json()
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async create(chain) {
    try {
      const response = await fetch(`${back}/chains`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chain),
      })

      const data = await response.json()

      if (response.status != 201) { throw data }
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async update(chain) {
    try {
      const response = await fetch(`${back}/chains/${chain.chain.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chain),
      })

      const data = await response.json()

      if (response.status != 200) { throw data }
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async order(chainID1, chainID2) {
    try {
      await fetch(`${back}/chains/order`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chain_id_1: chainID1, chain_id_2: chainID2 }),
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
