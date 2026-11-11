import { flushPromises, mount } from '@vue/test-utils'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, expect, it } from 'vitest'

import LedgerCategories from '@/views/LedgerCategories.vue'

const backendUrl = import.meta.env.VITE_BACK || 'http://habits.localhost:3003'
const server = setupServer()
let categoryPageWrapper = null

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  categoryPageWrapper?.unmount()
  categoryPageWrapper = null
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

it('lists categories', async () => {
  server.use(
    http.get(`${backendUrl}/ledger/categories`, () =>
      HttpResponse.json([
        { id: 17, name: 'Home' },
        { id: 18, name: 'Work' },
      ]),
    ),
  )

  categoryPageWrapper = mountCategoryPage()
  await flushPromises()

  expect(
    categoryPageWrapper.findAll('.ledger-categories__name').map((category) => category.text()),
  ).toEqual(['Home', 'Work'])
})

it('creates a category', async () => {
  let categories = []
  const createdCategoryPayloads = []

  server.use(
    http.get(`${backendUrl}/ledger/categories`, () => HttpResponse.json(categories)),
    http.post(`${backendUrl}/ledger/categories`, async ({ request }) => {
      const categoryPayload = await request.json()
      createdCategoryPayloads.push(categoryPayload)
      categories = [{ id: 18, name: categoryPayload.name }]

      return HttpResponse.json(categories[0], { status: 201 })
    }),
  )

  categoryPageWrapper = mountCategoryPage()
  await flushPromises()

  await categoryPageWrapper.find('.ledger-categories__input').setValue('Work')
  await categoryPageWrapper.find('.ledger-categories__form').trigger('submit')
  await flushPromises()
  await flushPromises()

  expect(createdCategoryPayloads).toEqual([{ name: 'Work' }])
  expect(categoryPageWrapper.text()).toContain('Work')
})

it('renames a category', async () => {
  let categories = [{ id: 18, name: 'Work' }]
  const renamedCategoryPayloads = []

  server.use(
    http.get(`${backendUrl}/ledger/categories`, () => HttpResponse.json(categories)),
    http.patch(`${backendUrl}/ledger/categories/18`, async ({ request }) => {
      const categoryPayload = await request.json()
      renamedCategoryPayloads.push(categoryPayload)
      categories = [{ ...categories[0], name: categoryPayload.name }]

      return HttpResponse.json(categories[0])
    }),
  )

  categoryPageWrapper = mountCategoryPage()
  await flushPromises()

  await categoryPageWrapper.find('.ledger-categories__edit').trigger('click')
  await categoryPageWrapper.find('.ledger-categories__input').setValue('Office')
  await categoryPageWrapper.find('.ledger-categories__form').trigger('submit')
  await flushPromises()
  await flushPromises()

  expect(renamedCategoryPayloads).toEqual([{ name: 'Office' }])
  expect(categoryPageWrapper.text()).toContain('Office')
  expect(categoryPageWrapper.text()).not.toContain('Work')
})

it('deletes an unused category', async () => {
  const deletedCategoryIds = []

  server.use(
    http.get(`${backendUrl}/ledger/categories`, () =>
      HttpResponse.json([{ id: 19, name: 'Unused' }]),
    ),
    http.delete(`${backendUrl}/ledger/categories/19`, () => {
      deletedCategoryIds.push(19)

      return new HttpResponse(null, { status: 204 })
    }),
  )

  categoryPageWrapper = mountCategoryPage()
  await flushPromises()

  await categoryPageWrapper.find('.ledger-categories__delete').trigger('click')
  await flushPromises()

  expect(deletedCategoryIds).toEqual([19])
  expect(categoryPageWrapper.text()).not.toContain('Unused')
})

it('rejects a duplicate category name', async () => {
  server.use(
    http.get(`${backendUrl}/ledger/categories`, () =>
      HttpResponse.json([{ id: 23, name: 'Rent' }]),
    ),
    http.post(`${backendUrl}/ledger/categories`, () =>
      HttpResponse.json({ error: 'category name already exists' }, { status: 409 }),
    ),
  )

  categoryPageWrapper = mountCategoryPage()
  await flushPromises()

  await categoryPageWrapper.find('.ledger-categories__input').setValue('Rent')
  await categoryPageWrapper.find('.ledger-categories__form').trigger('submit')
  await flushPromises()

  expect(categoryPageWrapper.text()).toContain('category name already exists')
  expect(categoryPageWrapper.text()).toContain('Rent')
})

it('rejects deletion of a category in use', async () => {
  server.use(
    http.get(`${backendUrl}/ledger/categories`, () =>
      HttpResponse.json([{ id: 23, name: 'Rent' }]),
    ),
    http.delete(`${backendUrl}/ledger/categories/23`, () =>
      HttpResponse.json({ error: 'category has transactions' }, { status: 409 }),
    ),
  )

  categoryPageWrapper = mountCategoryPage()
  await flushPromises()

  await categoryPageWrapper.find('.ledger-categories__delete').trigger('click')
  await flushPromises()

  expect(categoryPageWrapper.text()).toContain('category has transactions')
  expect(categoryPageWrapper.text()).toContain('Rent')
})

function mountCategoryPage() {
  return mount(LedgerCategories, {
    global: { stubs: { RouterLink: true } },
  })
}
