import { requestJson } from '@/requests/request'

export default {
  index(date) {
    return requestJson(`/metrics?date=${encodeURIComponent(date)}`)
  },

  charts(startDate, endDate) {
    const searchParams = new URLSearchParams({ start_date: startDate, end_date: endDate })
    return requestJson(`/charts?${searchParams}`)
  },

  history() {
    return requestJson('/metrics_history')
  },

  upsert(metric) {
    return requestJson('/metrics', {
      method: 'POST',
      body: JSON.stringify(metric),
    })
  },

  delete(metric) {
    const metricQuery = new URLSearchParams({
      date: metric.date,
      chain_id: String(metric.chain_id),
    })
    return requestJson(`/metrics?${metricQuery}`, { method: 'DELETE' })
  },
}
