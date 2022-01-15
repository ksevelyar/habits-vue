export default {
  async get () {
    try {
      const response = await fetch(process.env.VUE_APP_BACK, {
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors'
      })
      return response.json()
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
