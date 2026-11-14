import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { http, HttpResponse } from 'msw'
import { describe, expect, test, vi } from 'vitest'

import UserDashboard from '@/views/UserDashboard.vue'
import { useUserStore } from '@/stores/user'
import { mock } from './support.js'

const chartHistoryResponse = {
  chains: [
    {
      id: 42,
      name: 'Pull-ups',
      type: 'integer',
      points: [
        { date: '2026-03-05', value: 20 },
        { date: '2026-03-07', value: 25 },
      ],
    },
  ],
}

describe('UserDashboard charts', () => {
  test('User selects a one-month chart period', async () => {
    const requestedChartRanges = []
    const mockedServer = mock(
      http.get(`${import.meta.env.VITE_BACK}/charts`, ({ request }) => {
        const requestUrl = new URL(request.url)
        requestedChartRanges.push({
          startDate: requestUrl.searchParams.get('start_date'),
          endDate: requestUrl.searchParams.get('end_date'),
        })

        return HttpResponse.json(chartHistoryResponse)
      }),
      http.get(`${import.meta.env.VITE_BACK}/telegram/link`, () =>
        HttpResponse.json({ linked: true }),
      ),
    )

    try {
      vi.setSystemTime(new Date('2026-03-15T12:00:00.000Z'))
      const wrapper = mountDashboardPage()

      try {
        await flushPromises()

        expect(wrapper.text()).toContain('Pull-ups')
        expect(wrapper.find('.metric-chart__line').attributes('d')).toBeTruthy()
        expect(requestedChartRanges).toContainEqual({
          startDate: '2026-03-01',
          endDate: '2026-04-01',
        })
      } finally {
        wrapper.unmount()
      }
    } finally {
      mockedServer.close()
      vi.useRealTimers()
    }
  })

  test('User selects a quarterly chart period', async () => {
    const requestedChartRanges = []
    const mockedServer = mock(
      http.get(`${import.meta.env.VITE_BACK}/charts`, ({ request }) => {
        const requestUrl = new URL(request.url)
        requestedChartRanges.push({
          startDate: requestUrl.searchParams.get('start_date'),
          endDate: requestUrl.searchParams.get('end_date'),
        })

        return HttpResponse.json(chartHistoryResponse)
      }),
      http.get(`${import.meta.env.VITE_BACK}/telegram/link`, () =>
        HttpResponse.json({ linked: true }),
      ),
    )

    try {
      vi.setSystemTime(new Date('2026-06-15T12:00:00.000Z'))
      const wrapper = mountDashboardPage()

      try {
        await flushPromises()
        await wrapper.findAll('.user-dashboard__period')[1].trigger('click')
        await flushPromises()

        expect(wrapper.text()).toContain('Pull-ups')
        expect(requestedChartRanges).toContainEqual({
          startDate: '2026-04-01',
          endDate: '2026-07-01',
        })
      } finally {
        wrapper.unmount()
      }
    } finally {
      mockedServer.close()
      vi.useRealTimers()
    }
  })

  test('User selects a one-year chart period', async () => {
    const requestedChartRanges = []
    const mockedServer = mock(
      http.get(`${import.meta.env.VITE_BACK}/charts`, ({ request }) => {
        const requestUrl = new URL(request.url)
        requestedChartRanges.push({
          startDate: requestUrl.searchParams.get('start_date'),
          endDate: requestUrl.searchParams.get('end_date'),
        })

        return HttpResponse.json(chartHistoryResponse)
      }),
      http.get(`${import.meta.env.VITE_BACK}/telegram/link`, () =>
        HttpResponse.json({ linked: true }),
      ),
    )

    try {
      vi.setSystemTime(new Date('2026-06-15T12:00:00.000Z'))
      const wrapper = mountDashboardPage()

      try {
        await flushPromises()
        await wrapper.findAll('.user-dashboard__period')[2].trigger('click')
        await flushPromises()

        expect(wrapper.text()).toContain('Pull-ups')
        expect(requestedChartRanges).toContainEqual({
          startDate: '2026-01-01',
          endDate: '2027-01-01',
        })
      } finally {
        wrapper.unmount()
      }
    } finally {
      mockedServer.close()
      vi.useRealTimers()
    }
  })

  test('User returns to the current chart period', async () => {
    const requestedChartRanges = []
    const mockedServer = mock(
      http.get(`${import.meta.env.VITE_BACK}/charts`, ({ request }) => {
        const requestUrl = new URL(request.url)
        requestedChartRanges.push({
          startDate: requestUrl.searchParams.get('start_date'),
          endDate: requestUrl.searchParams.get('end_date'),
        })

        return HttpResponse.json(chartHistoryResponse)
      }),
      http.get(`${import.meta.env.VITE_BACK}/telegram/link`, () =>
        HttpResponse.json({ linked: true }),
      ),
    )

    try {
      vi.setSystemTime(new Date('2026-03-15T12:00:00.000Z'))
      const wrapper = mountDashboardPage()

      try {
        await flushPromises()

        expect(wrapper.find('.user-dashboard__periods').text()).toBe('1 monthquarter1 year')
        expect(wrapper.find('.user-dashboard__previous-period').text()).toBe('←')
        expect(wrapper.find('.user-dashboard__next-period').exists()).toBe(false)

        await wrapper.find('.user-dashboard__previous-period').trigger('click')
        await flushPromises()

        expect(wrapper.find('.user-dashboard__next-period').exists()).toBe(true)
        expect(requestedChartRanges).toContainEqual({
          startDate: '2026-02-01',
          endDate: '2026-03-01',
        })

        await wrapper.find('.user-dashboard__next-period').trigger('click')
        await flushPromises()

        expect(wrapper.find('.user-dashboard__next-period').exists()).toBe(false)
        expect(requestedChartRanges).toContainEqual({
          startDate: '2026-03-01',
          endDate: '2026-04-01',
        })
        const previousMonthRange = requestedChartRanges.find(
          (dateRange) => dateRange.startDate === '2026-02-01',
        )
        const currentMonthRange = requestedChartRanges.find(
          (dateRange) => dateRange.startDate === '2026-03-01',
        )
        expect(previousMonthRange.endDate).toBe(currentMonthRange.startDate)
      } finally {
        wrapper.unmount()
      }
    } finally {
      mockedServer.close()
      vi.useRealTimers()
    }
  })
})

function mountDashboardPage() {
  const pinia = createPinia()
  setActivePinia(pinia)
  useUserStore().user.timezone = 'UTC'

  return mount(UserDashboard, {
    global: { plugins: [pinia] },
  })
}
