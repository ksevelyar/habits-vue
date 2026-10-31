import { flushPromises, mount } from '@vue/test-utils'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, expect, it } from 'vitest'

import MetricInput from '@/components/MetricInput.vue'

const backendUrl = import.meta.env.VITE_BACK || 'http://habits.lcl:3003'
const server = setupServer()

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

it('sends_delete_when_metric_input_is_empty', async () => {
  const receivedMetricRequests = []
  server.use(
    http.delete(`${backendUrl}/metrics`, ({ request }) => {
      receivedMetricRequests.push({
        method: request.method,
        url: new URL(request.url),
      })
      return new HttpResponse(null, { status: 204 })
    }),
    http.post(`${backendUrl}/metrics`, ({ request }) => {
      receivedMetricRequests.push({
        method: request.method,
        url: new URL(request.url),
      })
      return HttpResponse.json({}, { status: 200 })
    }),
  )

  const metricInput = mount(MetricInput, {
    props: {
      modelValue: {
        value: '30',
        date: '2026-08-09',
        chain_id: 42,
      },
    },
  })

  try {
    await metricInput.find('.metric-input__value').setValue('')
    await waitForMetricUpdate()
    await flushPromises()

    expect(receivedMetricRequests).toHaveLength(1)
    expect(receivedMetricRequests[0].method).toBe('DELETE')
    expect(receivedMetricRequests[0].url.searchParams.get('date')).toBe('2026-08-09')
    expect(receivedMetricRequests[0].url.searchParams.get('chain_id')).toBe('42')
  } finally {
    metricInput.unmount()
  }
})

function waitForMetricUpdate() {
  const metricUpdateDelayMilliseconds = 350
  return new Promise((resolve) => setTimeout(resolve, metricUpdateDelayMilliseconds))
}
