import ledgerClient from '@/requests/ledger-client'
import { convertLocalDateTimeToTimestamp, convertTimestampToLocalDateTime } from '@/time'

function convertRublesToKopecks(rubleValue) {
  const amountMatch = String(rubleValue)
    .trim()
    .match(/^([+-]?)(\d+)$/)

  if (!amountMatch) {
    throw new Error('Enter an amount in whole rubles.')
  }

  const wholeRubles = BigInt(amountMatch[2])
  let amountSign = 1n
  if (amountMatch[1] === '-') amountSign = -1n

  const amountKopecks = wholeRubles * 100n * amountSign

  if (amountKopecks === 0n) {
    throw new Error('Amount cannot be zero.')
  }

  const amountKopecksAsNumber = Number(amountKopecks)
  if (!Number.isSafeInteger(amountKopecksAsNumber)) {
    throw new Error('Amount is too large.')
  }

  return amountKopecksAsNumber
}

function formatKopecks(amountKopecks) {
  const amountAsBigInt = BigInt(amountKopecks)
  const isNegative = amountAsBigInt < 0n
  let absoluteAmount = amountAsBigInt
  if (isNegative) absoluteAmount = -amountAsBigInt

  const roundedRubles = (absoluteAmount + 50n) / 100n
  const formattedWholeRubles = new Intl.NumberFormat('ru-RU').format(roundedRubles)
  let formattedSign = ''
  if (isNegative) formattedSign = '−'

  return `${formattedSign}${formattedWholeRubles} ₽`
}

function formatKopecksForInput(amountKopecks) {
  const amountAsBigInt = BigInt(amountKopecks)
  const isNegative = amountAsBigInt < 0n
  let absoluteAmount = amountAsBigInt
  if (isNegative) absoluteAmount = -amountAsBigInt

  const roundedRubles = (absoluteAmount + 50n) / 100n
  let formattedSign = ''
  if (isNegative) formattedSign = '-'

  return `${formattedSign}${roundedRubles}`
}

function createTransactionPayload(transaction, timeZone) {
  return {
    category_id: Number(transaction.categoryId),
    amount_kopecks: convertRublesToKopecks(transaction.amountRubles),
    occurred_at: convertLocalDateTimeToTimestamp(transaction.occurredAtLocal, timeZone),
  }
}

export { convertRublesToKopecks, formatKopecks }

export function getTransactionFieldErrors(requestError) {
  return Object.fromEntries(
    (requestError.fields || []).map(({ field, message }) => {
      const fieldName = {
        category_id: 'categoryId',
        amount_kopecks: 'amountRubles',
        occurred_at: 'occurredAtLocal',
      }[field]

      return [fieldName || field, message]
    }),
  )
}

export function getTransactionForm(transaction, timeZone) {
  return {
    categoryId: transaction.category_id,
    amountRubles: formatKopecksForInput(transaction.amount_kopecks),
    occurredAtLocal: convertTimestampToLocalDateTime(transaction.occurred_at, timeZone),
  }
}

export default {
  listCategories() {
    return ledgerClient.listCategories()
  },

  createCategory(name) {
    return ledgerClient.createCategory({ name })
  },

  updateCategory(categoryId, name) {
    return ledgerClient.updateCategory(categoryId, { name })
  },

  deleteCategory(categoryId) {
    return ledgerClient.deleteCategory(categoryId)
  },

  getHistory(period, anchorDate) {
    return ledgerClient.getHistory(period, anchorDate)
  },

  createTransaction(transaction, timeZone) {
    return ledgerClient.createTransaction(createTransactionPayload(transaction, timeZone))
  },

  updateTransaction(transactionId, transaction, timeZone) {
    return ledgerClient.updateTransaction(
      transactionId,
      createTransactionPayload(transaction, timeZone),
    )
  },

  deleteTransaction(transactionId) {
    return ledgerClient.deleteTransaction(transactionId)
  },

  formatAmount(amountKopecks) {
    return formatKopecks(amountKopecks)
  },

  getTransactionFieldErrors(requestError) {
    return getTransactionFieldErrors(requestError)
  },
}
