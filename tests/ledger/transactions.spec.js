import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { http, HttpResponse } from 'msw'
import { describe, expect, test, vi } from 'vitest'

import Ledger from '@/views/Ledger.vue'
import { formatDateInTimezone } from '@/time'
import { useUserStore } from '@/stores/user'
import { mock } from '../support.js'

const ledgerCategories = [
  { id: 7, user_id: 1, name: 'Work' },
  { id: 8, user_id: 1, name: 'Home' },
]

describe('ledger transaction scenarios', () => {
  test('User records income or an expense', async () => {
    const submittedTransactions = []
    let createdTransaction = null
    const mockedServer = mock(
      categoriesRequest(),
      http.get(`${import.meta.env.VITE_BACK}/ledger/transactions`, () =>
        HttpResponse.json(createHistoryResponse(getTransactionList(createdTransaction))),
      ),
      http.post(`${import.meta.env.VITE_BACK}/ledger/transactions`, async ({ request }) => {
        const transactionPayload = await request.json()
        submittedTransactions.push(transactionPayload)
        createdTransaction = createTransaction({
          id: 91,
          category_id: transactionPayload.category_id,
          category_name: 'Work',
          amount_kopecks: transactionPayload.amount_kopecks,
          occurred_at: transactionPayload.occurred_at,
        })
        return HttpResponse.json(createdTransaction, { status: 201 })
      }),
    )

    try {
      vi.setSystemTime(new Date('2026-03-15T12:00:00.000Z'))
      const ledgerWrapper = mountLedgerPage()
      await flushPromises()
      const transactionInputs = ledgerWrapper.findAll('.ledger-transaction-form__input')
      await transactionInputs[0].setValue('2026-03-09T15:30')
      await transactionInputs[1].setValue('-1500')
      vi.setSystemTime(new Date('2026-03-15T12:01:00.000Z'))
      await ledgerWrapper.find('.ledger-transaction-form').trigger('submit')
      await flushPromises()

      expect(submittedTransactions).toEqual([
        {
          category_id: 7,
          amount_kopecks: -150000,
          occurred_at: '2026-03-09T12:30:00.000Z',
        },
      ])
      expect(ledgerWrapper.text()).toContain('−1 500')
      expect(transactionInputs[1].element.value).toBe('')
      expect(transactionInputs[0].element.value).toBe('2026-03-15T15:01')
      ledgerWrapper.unmount()
    } finally {
      mockedServer.close()
      vi.useRealTimers()
    }
  })

  test('User views period statistics', async () => {
    const mockedServer = mock(
      categoriesRequest(),
      http.get(`${import.meta.env.VITE_BACK}/ledger/transactions`, () =>
        HttpResponse.json(
          createHistoryResponse(
            [
              createTransaction({
                id: 1,
                category_id: 8,
                category_name: 'Home',
                amount_kopecks: -10000,
                occurred_at: '2026-03-09T12:00:00Z',
              }),
              createTransaction({
                id: 2,
                category_id: 7,
                category_name: 'Work',
                amount_kopecks: -5000,
                occurred_at: '2026-03-09T13:00:00Z',
              }),
              createTransaction({
                id: 3,
                category_id: 7,
                category_name: 'Work',
                amount_kopecks: 20000,
                occurred_at: '2026-03-09T14:00:00Z',
              }),
            ],
            50000,
          ),
        ),
      ),
    )

    try {
      const ledgerWrapper = mountLedgerPage()
      await flushPromises()

      const ledgerSections = Array.from(ledgerWrapper.find('.ledger-transactions').element.children)
      const rangePosition = ledgerSections.findIndex((section) =>
        section.classList.contains('ledger-range-selector'),
      )
      const statisticsPosition = ledgerSections.findIndex((section) =>
        section.classList.contains('ledger-range-statistics'),
      )
      expect(rangePosition).toBeLessThan(statisticsPosition)
      expect(ledgerWrapper.find('.ledger-range-selector__range').text()).toBe(
        `${formatDateInTimezone('2026-02-28T21:00:00Z', 'Europe/Moscow')} – ${formatDateInTimezone('2026-03-31T21:00:00Z', 'Europe/Moscow')}`,
      )
      const categoryLabels = ledgerWrapper.findAll('.ledger-range-statistics__legend-label')
      expect(categoryLabels.map((label) => label.text())).toEqual(['Home −100', 'Work −50'])
      expect(
        ledgerWrapper.findAll('.ledger-range-statistics__total').map((total) => total.text()),
      ).toEqual(['Balance:500', 'Spent:−150', 'Income:200'])
      ledgerWrapper.unmount()
    } finally {
      mockedServer.close()
    }
  })

  test('User views transactions grouped by day', async () => {
    const mockedServer = mock(
      categoriesRequest(),
      http.get(`${import.meta.env.VITE_BACK}/ledger/transactions`, () =>
        HttpResponse.json(
          createHistoryResponse([
            createTransaction({
              id: 1,
              category_name: 'Work',
              amount_kopecks: 20000,
              occurred_at: '2026-03-15T10:00:00Z',
            }),
            createTransaction({
              id: 2,
              category_name: 'Home',
              amount_kopecks: -900,
              occurred_at: '2026-03-14T10:00:00Z',
            }),
          ]),
        ),
      ),
    )

    try {
      vi.setSystemTime(new Date('2026-03-15T12:00:00.000Z'))
      const ledgerWrapper = mountLedgerPage()
      await flushPromises()

      const transactionDays = ledgerWrapper.findAll('.ledger-transactions__day')
      expect(transactionDays).toHaveLength(2)
      expect(transactionDays[0].text()).toContain('+200')
      expect(transactionDays[1].text()).toContain('−9')
      expect(transactionDays[0].text()).not.toContain('Income:')
      expect(transactionDays[1].text()).not.toContain('Spent:')
      expect(transactionDays[0].find('.ledger-transactions__amount--income').exists()).toBe(true)
      expect(transactionDays[1].find('.ledger-transactions__amount--expense').exists()).toBe(true)
      expect(transactionDays[0].find('.ledger-transactions__row').exists()).toBe(true)
      expect(transactionDays[1].find('.ledger-transactions__row').exists()).toBe(false)
      await transactionDays[1].find('.ledger-transactions__day-heading').trigger('click')
      expect(transactionDays[1].find('.ledger-transactions__row').exists()).toBe(true)
      expect(transactionDays[1].find('.ledger-transactions__occurred-at').text()).toBe('13:00')
      expect(transactionDays[1].find('.ledger-transactions__edit').element.tagName).toBe('SPAN')
      expect(transactionDays[1].find('.ledger-transactions__delete').element.tagName).toBe('SPAN')
      ledgerWrapper.unmount()
    } finally {
      mockedServer.close()
      vi.useRealTimers()
    }
  })

  test('User edits a transaction', async () => {
    const updatedPayloads = []
    let currentTransaction = createTransaction({
      id: 42,
      category_id: 8,
      category_name: 'Home',
      amount_kopecks: -900,
      occurred_at: '2026-03-09T12:00:00Z',
    })
    const mockedServer = mock(
      categoriesRequest(),
      http.get(`${import.meta.env.VITE_BACK}/ledger/transactions`, () =>
        HttpResponse.json(createHistoryResponse(getTransactionList(currentTransaction))),
      ),
      http.patch(`${import.meta.env.VITE_BACK}/ledger/transactions/42`, async ({ request }) => {
        const transactionPayload = await request.json()
        updatedPayloads.push(transactionPayload)
        currentTransaction = createTransaction({
          ...currentTransaction,
          ...transactionPayload,
          category_name: 'Work',
        })
        return HttpResponse.json(currentTransaction)
      }),
    )

    try {
      vi.setSystemTime(new Date('2026-03-15T12:00:00.000Z'))
      const ledgerWrapper = mountLedgerPage()
      await flushPromises()
      await ledgerWrapper.find('.ledger-transactions__day-heading').trigger('click')
      await ledgerWrapper.find('.ledger-transactions__edit').trigger('click')
      const transactionInputs = ledgerWrapper.findAll('.ledger-transaction-form__input')
      await transactionInputs[0].setValue('2026-03-09T17:45')
      await transactionInputs[1].setValue('1200')
      await transactionInputs[2].setValue('7')
      await ledgerWrapper.find('.ledger-transaction-form').trigger('submit')
      await flushPromises()

      expect(updatedPayloads).toEqual([
        { category_id: 7, amount_kopecks: 120000, occurred_at: '2026-03-09T14:45:00.000Z' },
      ])
      await ledgerWrapper.find('.ledger-transactions__day-heading').trigger('click')
      const updatedTransactionRow = ledgerWrapper.find('.ledger-transactions__row')
      expect(updatedTransactionRow.text()).toContain('Work')
      expect(updatedTransactionRow.text()).toContain('1 200')
      ledgerWrapper.unmount()
    } finally {
      mockedServer.close()
      vi.useRealTimers()
    }
  })

  test('User deletes a transaction', async () => {
    let currentTransaction = createTransaction({
      id: 42,
      category_id: 8,
      category_name: 'Home',
      amount_kopecks: -900,
      occurred_at: '2026-03-09T12:00:00Z',
    })
    const mockedServer = mock(
      categoriesRequest(),
      http.get(`${import.meta.env.VITE_BACK}/ledger/transactions`, () =>
        HttpResponse.json(createHistoryResponse(getTransactionList(currentTransaction))),
      ),
      http.delete(`${import.meta.env.VITE_BACK}/ledger/transactions/42`, () => {
        currentTransaction = null
        return new HttpResponse(null, { status: 204 })
      }),
    )

    try {
      vi.setSystemTime(new Date('2026-03-15T12:00:00.000Z'))
      const ledgerWrapper = mountLedgerPage()
      await flushPromises()
      await ledgerWrapper.find('.ledger-transactions__day-heading').trigger('click')
      await ledgerWrapper.find('.ledger-transactions__delete').trigger('click')
      await flushPromises()
      await flushPromises()

      expect(ledgerWrapper.text()).toContain('No transactions in this range.')
      ledgerWrapper.unmount()
    } finally {
      mockedServer.close()
      vi.useRealTimers()
    }
  })

  test('User views and navigates transaction periods', async () => {
    const requestedBounds = []
    const mockedServer = mock(
      categoriesRequest(),
      http.get(`${import.meta.env.VITE_BACK}/ledger/transactions`, ({ request }) => {
        const requestUrl = new URL(request.url)
        requestedBounds.push({
          startAt: requestUrl.searchParams.get('start_at'),
          endAt: requestUrl.searchParams.get('end_at'),
        })
        return HttpResponse.json(createHistoryResponse([]))
      }),
    )

    try {
      vi.setSystemTime(new Date('2026-03-31T22:30:00.000Z'))
      const ledgerWrapper = mountLedgerPage()
      await flushPromises()
      await ledgerWrapper.find('.ledger-range-selector__previous').trigger('click')
      await flushPromises()
      expect(ledgerWrapper.find('.ledger-range-selector__next').exists()).toBe(true)
      await ledgerWrapper.find('.ledger-range-selector__next').trigger('click')
      await flushPromises()
      const rangeOptions = ledgerWrapper.findAll('.ledger-range-selector__option')
      await rangeOptions[1].trigger('click')
      await flushPromises()
      await rangeOptions[2].trigger('click')
      await flushPromises()

      expect(requestedBounds).toContainEqual({
        startAt: '2026-03-31T21:00:00.000Z',
        endAt: '2026-04-30T21:00:00.000Z',
      })
      expect(requestedBounds).toContainEqual({
        startAt: '2026-02-28T21:00:00.000Z',
        endAt: '2026-03-31T21:00:00.000Z',
      })
      expect(requestedBounds).toContainEqual({
        startAt: '2026-03-31T21:00:00.000Z',
        endAt: '2026-06-30T21:00:00.000Z',
      })
      expect(requestedBounds).toContainEqual({
        startAt: '2025-12-31T21:00:00.000Z',
        endAt: '2026-12-31T21:00:00.000Z',
      })
      ledgerWrapper.unmount()
    } finally {
      mockedServer.close()
      vi.useRealTimers()
    }
  })

  test('User sees transaction errors', async () => {
    let submittedTransactionCount = 0
    const mockedServer = mock(
      categoriesRequest(),
      http.get(`${import.meta.env.VITE_BACK}/ledger/transactions`, () =>
        HttpResponse.json(createHistoryResponse([])),
      ),
      http.post(`${import.meta.env.VITE_BACK}/ledger/transactions`, () => {
        submittedTransactionCount += 1
        return HttpResponse.json(
          {
            error: 'validation failed',
            fields: [{ field: 'occurred_at', message: 'timestamp must end in Z' }],
          },
          { status: 422 },
        )
      }),
    )

    try {
      const ledgerWrapper = mountLedgerPage()
      await flushPromises()
      const transactionInputs = ledgerWrapper.findAll('.ledger-transaction-form__input')
      await transactionInputs[0].setValue('2026-03-09T12:00')
      await transactionInputs[1].setValue('0')
      await ledgerWrapper.find('.ledger-transaction-form').trigger('submit')
      await flushPromises()
      expect(ledgerWrapper.text()).toContain('Amount cannot be zero.')
      expect(submittedTransactionCount).toBe(0)
      await transactionInputs[1].setValue('-1500.25')
      await ledgerWrapper.find('.ledger-transaction-form').trigger('submit')
      await flushPromises()
      expect(ledgerWrapper.text()).toContain('Enter an amount in whole rubles.')
      expect(submittedTransactionCount).toBe(0)
      await transactionInputs[1].setValue('100')
      await ledgerWrapper.find('.ledger-transaction-form').trigger('submit')
      await flushPromises()
      expect(ledgerWrapper.text()).toContain('validation failed')
      expect(ledgerWrapper.text()).toContain('timestamp must end in Z')
      expect(transactionInputs[1].element.value).toBe('100')
      ledgerWrapper.unmount()
    } finally {
      mockedServer.close()
    }
  })
})

function categoriesRequest() {
  return http.get(`${import.meta.env.VITE_BACK}/ledger/categories`, () =>
    HttpResponse.json(ledgerCategories),
  )
}

function mountLedgerPage(timeZone = 'Europe/Moscow') {
  const piniaInstance = createPinia()
  setActivePinia(piniaInstance)
  useUserStore().user.timezone = timeZone

  return mount(Ledger, { global: { plugins: [piniaInstance], stubs: { RouterLink: true } } })
}

function getTransactionList(transaction) {
  if (!transaction) return []

  return [transaction]
}

function createHistoryResponse(transactions, balanceKopecks = 0) {
  return {
    start_at: '2026-02-28T21:00:00Z',
    end_at: '2026-03-31T21:00:00Z',
    balance_kopecks: balanceKopecks,
    transactions,
  }
}

function createTransaction(transactionAttributes) {
  return {
    inserted_at: '2026-03-09T12:00:00Z',
    updated_at: '2026-03-09T12:00:00Z',
    ...transactionAttributes,
  }
}
