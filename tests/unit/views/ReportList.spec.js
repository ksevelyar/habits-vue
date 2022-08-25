import { fetch } from 'cross-fetch'
import reports from '@/../tests/mocks/reports'
import { setupServer } from 'msw/node'

import { flushPromises, mount } from '@vue/test-utils'
import { expect, test, afterAll, afterEach, beforeAll } from 'vitest'

import ReportsList from '@/views/ReportsList.vue'

const server = setupServer(...reports)
beforeAll(() => {
  global.fetch = fetch
  server.listen({ onUnhandledRequest: 'error' })
})
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

test('render reports', async () => {
  const list = mount(ReportsList)

  await flushPromises()

  expect(list.findAll('.reports-list__row')).toHaveLength(15)
})
