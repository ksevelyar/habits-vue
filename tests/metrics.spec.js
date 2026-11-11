import { flushPromises, mount } from '@vue/test-utils'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, expect, it, vi } from 'vitest'

import MetricInput from '@/components/MetricInput.vue'

const backendUrl = import.meta.env.VITE_BACK || 'http://habits.localhost:3003'
const server = setupServer()

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  server.resetHandlers()
  vi.useRealTimers()
})

afterAll(() => {
  server.close()
})

it('sends delete when metric input is empty', async () => {
  const receivedMetricRequests = []
  vi.useFakeTimers()
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
    await vi.advanceTimersByTimeAsync(300)
    await flushPromises()

    expect(receivedMetricRequests).toHaveLength(1)
    expect(receivedMetricRequests[0].method).toBe('DELETE')
    expect(receivedMetricRequests[0].url.searchParams.get('date')).toBe('2026-08-09')
    expect(receivedMetricRequests[0].url.searchParams.get('chain_id')).toBe('42')
  } finally {
    metricInput.unmount()
  }
})
