import client from './client.js'

export default {
  getReports() {
    return client.fetch('reports')
  },
  getReport(id) {
    return client.fetch(`reports/${id}`)
  },
  deleteReport(id) {
    return client.fetch(`reports/${id}`, { method: 'DELETE' })
  },
  createReport(body) {
    return client.fetch('reports', { method: 'POST', body: JSON.stringify(body) })
  }
}
