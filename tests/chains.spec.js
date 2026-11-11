import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { http, HttpResponse } from 'msw'
import { expect, it, vi } from 'vitest'

import ChainNew from '@/views/ChainNew.vue'
import { mock } from './support.js'

vi.mock('@/router', () => ({ default: { push: vi.fn() } }))

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

it('chain form sends show in charts', async () => {
  const submittedChains = []
  const mockedServer = mock(
    http.post(`${import.meta.env.VITE_BACK}/chains`, async ({ request }) => {
      submittedChains.push(await request.json())

      return HttpResponse.json(createdChain, { status: 201 })
    }),
  )
  try {
    const wrapper = mount(ChainNew, {
      global: { plugins: [createPinia()] },
    })

    try {
      await wrapper.find('.chain-new__name').setValue('Pull-ups')
      await wrapper.find('.chain-new__show-in-charts input').setValue(true)
      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(submittedChains[0]).toMatchObject({
        name: 'Pull-ups',
        show_in_charts: true,
      })
    } finally {
      wrapper.unmount()
    }
  } finally {
    mockedServer.close()
  }
})
