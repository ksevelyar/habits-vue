import { flushPromises, mount } from '@vue/test-utils'
import { http, HttpResponse } from 'msw'
import { expect, it } from 'vitest'

import LedgerCategories from '@/views/LedgerCategories.vue'
import { mock } from '../support.js'

it('lists categories', async () => {
  const mockedServer = mock(
    http.get(`${import.meta.env.VITE_BACK}/ledger/categories`, () =>
      HttpResponse.json([
        { id: 17, name: 'Home' },
        { id: 18, name: 'Work' },
      ]),
    ),
  )

  try {
    const categoryPageWrapper = mountCategoryPage()

    try {
      await flushPromises()

      expect(
        categoryPageWrapper.findAll('.ledger-categories__name').map((category) => category.text()),
      ).toEqual(['Home', 'Work'])
    } finally {
      categoryPageWrapper.unmount()
    }
  } finally {
    mockedServer.close()
  }
})

it('creates a category', async () => {
  let categories = []
  const createdCategoryPayloads = []
  const mockedServer = mock(
    http.get(`${import.meta.env.VITE_BACK}/ledger/categories`, () => HttpResponse.json(categories)),
    http.post(`${import.meta.env.VITE_BACK}/ledger/categories`, async ({ request }) => {
      const categoryPayload = await request.json()
      createdCategoryPayloads.push(categoryPayload)
      categories = [{ id: 18, name: categoryPayload.name }]

      return HttpResponse.json(categories[0], { status: 201 })
    }),
  )

  try {
    const categoryPageWrapper = mountCategoryPage()

    try {
      await flushPromises()

      await categoryPageWrapper.find('.ledger-categories__input').setValue('Work')
      await categoryPageWrapper.find('.ledger-categories__form').trigger('submit')
      await flushPromises()
      await flushPromises()

      expect(createdCategoryPayloads).toEqual([{ name: 'Work' }])
      expect(categoryPageWrapper.text()).toContain('Work')
    } finally {
      categoryPageWrapper.unmount()
    }
  } finally {
    mockedServer.close()
  }
})

it('renames a category', async () => {
  let categories = [{ id: 18, name: 'Work' }]
  const renamedCategoryPayloads = []
  const mockedServer = mock(
    http.get(`${import.meta.env.VITE_BACK}/ledger/categories`, () => HttpResponse.json(categories)),
    http.patch(`${import.meta.env.VITE_BACK}/ledger/categories/18`, async ({ request }) => {
      const categoryPayload = await request.json()
      renamedCategoryPayloads.push(categoryPayload)
      categories = [{ ...categories[0], name: categoryPayload.name }]

      return HttpResponse.json(categories[0])
    }),
  )

  try {
    const categoryPageWrapper = mountCategoryPage()

    try {
      await flushPromises()

      await categoryPageWrapper.find('.ledger-categories__edit').trigger('click')
      await categoryPageWrapper.find('.ledger-categories__input').setValue('Office')
      await categoryPageWrapper.find('.ledger-categories__form').trigger('submit')
      await flushPromises()
      await flushPromises()

      expect(renamedCategoryPayloads).toEqual([{ name: 'Office' }])
      expect(categoryPageWrapper.text()).toContain('Office')
      expect(categoryPageWrapper.text()).not.toContain('Work')
    } finally {
      categoryPageWrapper.unmount()
    }
  } finally {
    mockedServer.close()
  }
})

it('deletes an unused category', async () => {
  const deletedCategoryIds = []
  const mockedServer = mock(
    http.get(`${import.meta.env.VITE_BACK}/ledger/categories`, () =>
      HttpResponse.json([{ id: 19, name: 'Unused' }]),
    ),
    http.delete(`${import.meta.env.VITE_BACK}/ledger/categories/19`, () => {
      deletedCategoryIds.push(19)

      return new HttpResponse(null, { status: 204 })
    }),
  )

  try {
    const categoryPageWrapper = mountCategoryPage()

    try {
      await flushPromises()

      await categoryPageWrapper.find('.ledger-categories__delete').trigger('click')
      await flushPromises()

      expect(deletedCategoryIds).toEqual([19])
      expect(categoryPageWrapper.text()).not.toContain('Unused')
    } finally {
      categoryPageWrapper.unmount()
    }
  } finally {
    mockedServer.close()
  }
})

it('rejects a duplicate category name', async () => {
  const mockedServer = mock(
    http.get(`${import.meta.env.VITE_BACK}/ledger/categories`, () =>
      HttpResponse.json([{ id: 23, name: 'Rent' }]),
    ),
    http.post(`${import.meta.env.VITE_BACK}/ledger/categories`, () =>
      HttpResponse.json({ error: 'category name already exists' }, { status: 409 }),
    ),
  )

  try {
    const categoryPageWrapper = mountCategoryPage()

    try {
      await flushPromises()

      await categoryPageWrapper.find('.ledger-categories__input').setValue('Rent')
      await categoryPageWrapper.find('.ledger-categories__form').trigger('submit')
      await flushPromises()

      expect(categoryPageWrapper.text()).toContain('category name already exists')
      expect(categoryPageWrapper.text()).toContain('Rent')
    } finally {
      categoryPageWrapper.unmount()
    }
  } finally {
    mockedServer.close()
  }
})

it('rejects deletion of a category in use', async () => {
  const mockedServer = mock(
    http.get(`${import.meta.env.VITE_BACK}/ledger/categories`, () =>
      HttpResponse.json([{ id: 23, name: 'Rent' }]),
    ),
    http.delete(`${import.meta.env.VITE_BACK}/ledger/categories/23`, () =>
      HttpResponse.json({ error: 'category has transactions' }, { status: 409 }),
    ),
  )

  try {
    const categoryPageWrapper = mountCategoryPage()

    try {
      await flushPromises()

      await categoryPageWrapper.find('.ledger-categories__delete').trigger('click')
      await flushPromises()

      expect(categoryPageWrapper.text()).toContain('category has transactions')
      expect(categoryPageWrapper.text()).toContain('Rent')
    } finally {
      categoryPageWrapper.unmount()
    }
  } finally {
    mockedServer.close()
  }
})

function mountCategoryPage() {
  return mount(LedgerCategories, {
    global: { stubs: { RouterLink: true } },
  })
}
