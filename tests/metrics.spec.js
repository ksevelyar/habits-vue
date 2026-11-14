import { flushPromises, mount } from '@vue/test-utils'
import { http, HttpResponse } from 'msw'
import { expect, test, vi } from 'vitest'

import MetricInput from '@/components/MetricInput.vue'
import { mock } from './support.js'

test('User deletes a metric by clearing its value', async () => {
  const receivedMetricRequests = []
  const mockedServer = mock(
    http.delete(`${import.meta.env.VITE_BACK}/metrics`, ({ request }) => {
      receivedMetricRequests.push({
        method: request.method,
        url: new URL(request.url),
      })
      return new HttpResponse(null, { status: 204 })
    }),
    http.post(`${import.meta.env.VITE_BACK}/metrics`, ({ request }) => {
      receivedMetricRequests.push({
        method: request.method,
        url: new URL(request.url),
      })
      return HttpResponse.json({}, { status: 200 })
    }),
  )
  try {
    vi.useFakeTimers()
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
  } finally {
    mockedServer.close()
    vi.useRealTimers()
  }
})
