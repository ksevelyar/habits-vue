import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, expect, it, vi } from 'vitest'

import ChainNew from '@/views/ChainNew.vue'

vi.mock('@/router', () => ({ default: { push: vi.fn() } }))

const backendUrl = import.meta.env.VITE_BACK || 'http://habits.lcl:3003'
const createdChain = {
  id: 42,
  user_id: 7,
  active: true,
  show_in_charts: true,
  name: 'Pull-ups',
  type: 'integer',
  aggregate: 'sum',
  description: null,
  order: null,
  inserted_at: '2026-03-15T12:00:00Z',
  updated_at: '2026-03-15T12:00:00Z',
}
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

it('chain_form_sends_show_in_charts', async () => {
  await runChainFormFeatureAssertions(async (submittedChains) => {
    expect(submittedChains[0]).toMatchObject({
      name: 'Pull-ups',
      show_in_charts: true,
    })
  })
})

async function runChainFormFeatureAssertions(runAssertions) {
  const submittedChains = []
  server.use(
    http.post(`${backendUrl}/chains`, async ({ request }) => {
      submittedChains.push(await request.json())

      return HttpResponse.json(createdChain, { status: 201 })
    }),
  )

  const wrapper = mount(ChainNew, {
    global: { plugins: [createPinia()] },
  })

  try {
    await wrapper.find('.chain-new__name').setValue('Pull-ups')
    await wrapper.find('.chain-new__show-in-charts input').setValue(true)
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    await runAssertions(submittedChains)
  } finally {
    wrapper.unmount()
  }
}
