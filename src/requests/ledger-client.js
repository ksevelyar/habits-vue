import { requestJson } from '@/requests/request'

export default {
  listCategories() {
    return requestJson('/ledger/categories')
  },

  createCategory(category) {
    return requestJson('/ledger/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    })
  },

  updateCategory(categoryId, category) {
    return requestJson(`/ledger/categories/${categoryId}`, {
      method: 'PATCH',
      body: JSON.stringify(category),
    })
  },

  deleteCategory(categoryId) {
    return requestJson(`/ledger/categories/${categoryId}`, { method: 'DELETE' })
  },

  getHistory(period, anchorDate) {
    const searchParams = new URLSearchParams({ period, anchor_date: anchorDate })
    return requestJson(`/ledger/transactions?${searchParams}`)
  },

  createTransaction(transaction) {
    return requestJson('/ledger/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    })
  },

  updateTransaction(transactionId, transaction) {
    return requestJson(`/ledger/transactions/${transactionId}`, {
      method: 'PATCH',
      body: JSON.stringify(transaction),
    })
  },

  deleteTransaction(transactionId) {
    return requestJson(`/ledger/transactions/${transactionId}`, { method: 'DELETE' })
  },
}
