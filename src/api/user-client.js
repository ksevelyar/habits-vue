const back = process.env.VUE_APP_BACK

export default {
  async get () {
    try {
      const response = await fetch(`${back}/user`, {
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        credentials: 'include'
      })
      return response.json()
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
