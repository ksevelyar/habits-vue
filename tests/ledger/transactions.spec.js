import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { http, HttpResponse } from 'msw'
import { describe, expect, it, vi } from 'vitest'

import Ledger from '@/views/Ledger.vue'
import { formatDateInTimezone, formatTimestampInTimezone } from '@/time'
import { useUserStore } from '@/stores/user'
import { mock } from '../support.js'

const ledgerCategories = [
  { id: 7, user_id: 1, name: 'Work' },
  { id: 8, user_id: 1, name: 'Home' },
]

describe('ledger transaction scenarios', () => {
  it('converts Moscow month bounds and signed rubles to utc kopecks', async () => {
    const requestedBounds = []
    const submittedTransactions = []
    let createdTransaction = null
    let balanceKopecks = 80000
    const mockedServer = mock(
      http.get(`${import.meta.env.VITE_BACK}/ledger/categories`, () =>
        HttpResponse.json(ledgerCategories),
      ),
      http.get(`${import.meta.env.VITE_BACK}/ledger/transactions`, ({ request }) => {
        const requestUrl = new URL(request.url)
        requestedBounds.push({
          startAt: requestUrl.searchParams.get('start_at'),
          endAt: requestUrl.searchParams.get('end_at'),
        })

        return HttpResponse.json(
          createHistoryResponse(getTransactionList(createdTransaction), balanceKopecks),
        )
      }),
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
        balanceKopecks = transactionPayload.amount_kopecks

        return HttpResponse.json(createdTransaction, { status: 201 })
      }),
    )

    try {
      vi.setSystemTime(new Date('2026-03-15T12:00:00.000Z'))
      const ledgerWrapper = mountLedgerPage()

      try {
        await flushPromises()

        expect(requestedBounds[0]).toEqual({
          startAt: '2026-02-28T21:00:00.000Z',
          endAt: '2026-03-31T21:00:00.000Z',
        })
        expect(ledgerWrapper.find('.ledger-transactions__range').text()).toBe(
          `${formatDateInTimezone('2026-02-28T21:00:00Z', 'Europe/Moscow')} – ${formatDateInTimezone('2026-03-31T21:00:00Z', 'Europe/Moscow')}`,
        )
        expect(ledgerWrapper.find('.ledger-transactions__range').text()).not.toContain('00:00')
        expect(ledgerWrapper.text()).toContain('Balance: 800 ₽')
        expect(
          ledgerWrapper.findAll('.ledger-transaction-form__label').map((label) => label.text()),
        ).toEqual(['Europe/Moscow', 'Amount', 'Category'])
        expect(ledgerWrapper.find('.ledger-transaction-form__submit').text()).toBe('Create')

        const transactionInputs = ledgerWrapper.findAll('.ledger-transaction-form__input')
        expect(transactionInputs[1].attributes('placeholder')).toBe('1000')
        expect(transactionInputs[1].attributes('type')).toBe('number')
        expect(transactionInputs[1].attributes('step')).toBe('1')
        await transactionInputs[0].setValue('2026-03-09T15:30')
        await transactionInputs[1].setValue('-1500')
        await ledgerWrapper.find('.ledger-transaction-form').trigger('submit')
        await flushPromises()

        expect(submittedTransactions).toEqual([
          {
            category_id: 7,
            amount_kopecks: -150000,
            occurred_at: '2026-03-09T12:30:00.000Z',
          },
        ])
        expect(requestedBounds).toHaveLength(2)
        expect(ledgerWrapper.text()).toContain('−1 500 ₽')
        expect(ledgerWrapper.text()).toContain('Balance: −1 500 ₽')
      } finally {
        ledgerWrapper.unmount()
      }
    } finally {
      mockedServer.close()
      vi.useRealTimers()
    }
  })

  it('converts London month boundaries across daylight saving time to UTC', async () => {
    const requestedBounds = []
    const mockedServer = mock(
      http.get(`${import.meta.env.VITE_BACK}/ledger/categories`, () =>
        HttpResponse.json(ledgerCategories),
      ),
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
      vi.setSystemTime(new Date('2026-03-15T12:00:00.000Z'))
      const ledgerWrapper = mountLedgerPage('Europe/London')

      try {
        await flushPromises()

        expect(requestedBounds).toEqual([
          { startAt: '2026-03-01T00:00:00.000Z', endAt: '2026-03-31T23:00:00.000Z' },
        ])
      } finally {
        ledgerWrapper.unmount()
      }
    } finally {
      mockedServer.close()
      vi.useRealTimers()
    }
  })

  it('navigates month quarter and year history using user timezone boundaries', async () => {
    const requestedBounds = []
    const mockedServer = mock(
      http.get(`${import.meta.env.VITE_BACK}/ledger/categories`, () =>
        HttpResponse.json(ledgerCategories),
      ),
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

      try {
        await flushPromises()

        await ledgerWrapper.find('.ledger-transactions__previous').trigger('click')
        await flushPromises()
        expect(ledgerWrapper.find('.ledger-transactions__next').exists()).toBe(true)

        await ledgerWrapper.find('.ledger-transactions__next').trigger('click')
        await flushPromises()

        const periodButtons = ledgerWrapper.findAll('.ledger-transactions__period')
        await periodButtons[1].trigger('click')
        await flushPromises()
        await periodButtons[2].trigger('click')
        await flushPromises()

        expect(requestedBounds).toEqual([
          { startAt: '2026-03-31T21:00:00.000Z', endAt: '2026-04-30T21:00:00.000Z' },
          { startAt: '2026-02-28T21:00:00.000Z', endAt: '2026-03-31T21:00:00.000Z' },
          { startAt: '2026-03-31T21:00:00.000Z', endAt: '2026-04-30T21:00:00.000Z' },
          { startAt: '2026-03-31T21:00:00.000Z', endAt: '2026-06-30T21:00:00.000Z' },
          { startAt: '2025-12-31T21:00:00.000Z', endAt: '2026-12-31T21:00:00.000Z' },
        ])
      } finally {
        ledgerWrapper.unmount()
      }
    } finally {
      mockedServer.close()
      vi.useRealTimers()
    }
  })

  it('edits and deletes transactions then refreshes the selected period', async () => {
    const updatedPayloads = []
    const requestedHistory = []
    let currentTransaction = createTransaction({
      id: 42,
      category_id: 8,
      category_name: 'Home',
      amount_kopecks: -900,
      occurred_at: '2026-03-09T12:00:00Z',
    })
    const mockedServer = mock(
      http.get(`${import.meta.env.VITE_BACK}/ledger/categories`, () =>
        HttpResponse.json(ledgerCategories),
      ),
      http.get(`${import.meta.env.VITE_BACK}/ledger/transactions`, () => {
        requestedHistory.push(true)
        return HttpResponse.json(createHistoryResponse(getTransactionList(currentTransaction)))
      }),
      http.patch(`${import.meta.env.VITE_BACK}/ledger/transactions/42`, async ({ request }) => {
        const updatePayload = await request.json()
        updatedPayloads.push(updatePayload)
        currentTransaction = createTransaction({
          ...currentTransaction,
          ...updatePayload,
          category_name: 'Work',
        })
        return HttpResponse.json(currentTransaction)
      }),
      http.delete(`${import.meta.env.VITE_BACK}/ledger/transactions/42`, () => {
        currentTransaction = null
        return new HttpResponse(null, { status: 204 })
      }),
    )

    try {
      vi.setSystemTime(new Date('2026-03-15T12:00:00.000Z'))
      const ledgerWrapper = mountLedgerPage()

      try {
        await flushPromises()

        expect(ledgerWrapper.text()).toContain('Home')

        const transactionRow = ledgerWrapper.find('.ledger-transactions__row')
        expect(transactionRow.find('.ledger-transactions__occurred-at').text()).toBe(
          formatTimestampInTimezone('2026-03-09T12:00:00Z', 'Europe/Moscow'),
        )
        expect(transactionRow.find('.ledger-transactions__amount').text()).toBe('−9 ₽')
        expect(transactionRow.find('.ledger-transactions__category').text()).toBe('Home')

        await ledgerWrapper.find('.ledger-transactions__edit').trigger('click')

        expect(ledgerWrapper.find('.ledger-transaction-form__submit').text()).toBe('Update')
        expect(ledgerWrapper.find('.ledger-transaction-form__cancel').exists()).toBe(false)

        const transactionInputs = ledgerWrapper.findAll('.ledger-transaction-form__input')
        expect(transactionInputs[0].element.value).toBe('2026-03-09T15:00')
        expect(transactionInputs[1].element.value).toBe('-9')
        await transactionInputs[0].setValue('2026-03-09T17:45')
        await transactionInputs[1].setValue('1200')
        await transactionInputs[2].setValue('7')
        await ledgerWrapper.find('.ledger-transaction-form').trigger('submit')
        await flushPromises()
        await flushPromises()

        expect(updatedPayloads).toEqual([
          {
            category_id: 7,
            amount_kopecks: 120000,
            occurred_at: '2026-03-09T14:45:00.000Z',
          },
        ])
        expect(requestedHistory).toHaveLength(2)
        expect(ledgerWrapper.text()).toContain('Work')

        await ledgerWrapper.find('.ledger-transactions__delete').trigger('click')
        await flushPromises()
        await flushPromises()

        expect(requestedHistory).toHaveLength(3)
        expect(ledgerWrapper.text()).toContain('No transactions in this period.')
      } finally {
        ledgerWrapper.unmount()
      }
    } finally {
      mockedServer.close()
      vi.useRealTimers()
    }
  })

  it('shows amount and backend validation errors without clearing the transaction form', async () => {
    let submittedTransactionCount = 0
    const mockedServer = mock(
      http.get(`${import.meta.env.VITE_BACK}/ledger/categories`, () =>
        HttpResponse.json(ledgerCategories),
      ),
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
      vi.setSystemTime(new Date('2026-03-15T12:00:00.000Z'))
      const ledgerWrapper = mountLedgerPage()

      try {
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

        expect(submittedTransactionCount).toBe(1)
        expect(ledgerWrapper.text()).toContain('validation failed')
        expect(ledgerWrapper.text()).toContain('timestamp must end in Z')
        expect(transactionInputs[1].element.value).toBe('100')
      } finally {
        ledgerWrapper.unmount()
      }
    } finally {
      mockedServer.close()
      vi.useRealTimers()
    }
  })
})

function mountLedgerPage(timeZone = 'Europe/Moscow') {
  const piniaInstance = createPinia()
  setActivePinia(piniaInstance)
  useUserStore().user.timezone = timeZone

  return mount(Ledger, {
    global: {
      plugins: [piniaInstance],
      stubs: { RouterLink: true },
    },
  })
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
