import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import UserDashboard from '@/views/UserDashboard.vue'
import { useUserStore } from '@/stores/user'

const backendUrl = import.meta.env.VITE_BACK || 'http://habits.localhost:3003'
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
const server = setupServer()

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

beforeEach(() => {
  vi.setSystemTime(new Date('2026-03-15T12:00:00.000Z'))
})

afterEach(() => {
  server.resetHandlers()
  vi.useRealTimers()
})

afterAll(() => {
  server.close()
})

describe('UserDashboard charts', () => {
  it('renders charts for current month by default', async () => {
    await runDashboardFeatureAssertions(async ({ wrapper, requestedChartRanges }) => {
      await flushPromises()

      expect(wrapper.text()).toContain('Pull-ups')
      expect(wrapper.find('.metric-chart__line').attributes('d')).toBeTruthy()
      expect(requestedChartRanges).toContainEqual({
        startDate: '2026-03-01',
        endDate: '2026-03-31',
      })
    })
  })

  it('renders charts for current quartal', async () => {
    vi.setSystemTime(new Date('2026-06-15T12:00:00.000Z'))

    await runDashboardFeatureAssertions(async ({ wrapper, requestedChartRanges }) => {
      await flushPromises()
      await wrapper.findAll('.user-dashboard__period')[1].trigger('click')
      await flushPromises()

      expect(wrapper.text()).toContain('Pull-ups')
      expect(requestedChartRanges).toContainEqual({
        startDate: '2026-04-01',
        endDate: '2026-06-30',
      })
    })
  })

  it('renders charts for current year', async () => {
    vi.setSystemTime(new Date('2026-06-15T12:00:00.000Z'))

    await runDashboardFeatureAssertions(async ({ wrapper, requestedChartRanges }) => {
      await flushPromises()
      await wrapper.findAll('.user-dashboard__period')[2].trigger('click')
      await flushPromises()

      expect(wrapper.text()).toContain('Pull-ups')
      expect(requestedChartRanges).toContainEqual({
        startDate: '2026-01-01',
        endDate: '2026-12-31',
      })
    })
  })

  it('navigates between available periods', async () => {
    await runDashboardFeatureAssertions(async ({ wrapper, requestedChartRanges }) => {
      await flushPromises()

      expect(wrapper.find('.user-dashboard__periods').text()).toBe('1 monthquartal1 year')
      expect(wrapper.find('.user-dashboard__previous-period').text()).toBe('←')
      expect(wrapper.find('.user-dashboard__next-period').exists()).toBe(false)

      await wrapper.find('.user-dashboard__previous-period').trigger('click')
      await flushPromises()

      expect(wrapper.find('.user-dashboard__next-period').exists()).toBe(true)
      expect(requestedChartRanges).toContainEqual({
        startDate: '2026-02-01',
        endDate: '2026-02-28',
      })

      await wrapper.find('.user-dashboard__next-period').trigger('click')
      await flushPromises()

      expect(wrapper.find('.user-dashboard__next-period').exists()).toBe(false)
      expect(requestedChartRanges).toContainEqual({
        startDate: '2026-03-01',
        endDate: '2026-03-31',
      })
    })
  })

  it('shows telegram configuration error after charts', async () => {
    await runDashboardFeatureAssertions(
      async ({ wrapper }) => {
        await flushPromises()

        const dashboardSections = Array.from(wrapper.find('.user-dashboard').element.children)

        expect(dashboardSections.map((section) => section.className)).toEqual([
          'user-dashboard__charts',
          'user-dashboard__notifications',
        ])
        expect(wrapper.find('.user-dashboard__notifications').text()).toContain('Notifications')
        expect(wrapper.find('.user-dashboard__notifications').text()).toContain(
          'telegram is not configured',
        )
      },
      () => HttpResponse.json({ error: 'telegram is not configured' }, { status: 500 }),
    )
  })
})

async function runDashboardFeatureAssertions(
  runAssertions,
  getTelegramStatus = () => HttpResponse.json({ linked: true }),
) {
  const requestedChartRanges = []
  server.use(
    http.get(`${backendUrl}/charts`, ({ request }) => {
      const requestUrl = new URL(request.url)
      requestedChartRanges.push({
        startDate: requestUrl.searchParams.get('start_date'),
        endDate: requestUrl.searchParams.get('end_date'),
      })

      return HttpResponse.json(chartHistoryResponse)
    }),
    http.get(`${backendUrl}/telegram/link`, getTelegramStatus),
  )

  const pinia = createPinia()
  setActivePinia(pinia)
  useUserStore().user.timezone = 'UTC'
  const wrapper = mount(UserDashboard, {
    global: { plugins: [pinia] },
  })

  try {
    await runAssertions({ wrapper, requestedChartRanges })
  } finally {
    wrapper.unmount()
  }
}
