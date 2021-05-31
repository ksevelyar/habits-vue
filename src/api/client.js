const base = 'http://localhost:4000'

export default {
  async fetch(path, options = {}) {
    try {
      const response = await fetch(`${base}/${path}`, {
        ...options,
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return response.json()
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
