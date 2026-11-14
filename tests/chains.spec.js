import { flushPromises } from '@vue/test-utils'
import { http, HttpResponse } from 'msw'
import { expect, test, vi } from 'vitest'

import { mock, mountApplicationAtPath } from './support.js'

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

const signedInUser = {
  name: 'person',
  email: 'person@example.com',
  timezone: 'UTC',
}

test('User creates a chain', async () => {
  const submittedChains = []
  const mockedServer = mock(
    http.get(`${import.meta.env.VITE_BACK}/sessions/current`, () =>
      HttpResponse.json(signedInUser),
    ),
    http.post(`${import.meta.env.VITE_BACK}/chains`, async ({ request }) => {
      submittedChains.push(await request.json())

      return HttpResponse.json(createdChain, { status: 201 })
    }),
    http.get(`${import.meta.env.VITE_BACK}/chains/42`, () => HttpResponse.json(createdChain)),
  )
  try {
    const { applicationRouter, applicationWrapper } = await mountApplicationAtPath('/chains/new')

    try {
      await applicationWrapper.find('.chain-new__name').setValue('Pull-ups')
      await applicationWrapper.find('.chain-new__show-in-charts input').setValue(true)
      await applicationWrapper.find('form').trigger('submit')
      await flushPromises()

      expect(submittedChains[0]).toMatchObject({
        name: 'Pull-ups',
        show_in_charts: true,
      })
      await vi.waitFor(() => {
        expect(applicationRouter.currentRoute.value.path).toBe('/chains/42/edit')
      })
    } finally {
      applicationWrapper.unmount()
    }
  } finally {
    mockedServer.close()
  }
})
