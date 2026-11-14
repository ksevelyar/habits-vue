<template lang="pug">
.ledger
  LedgerTransactions(
    :range="range"
    :range-offset="rangeOffset"
    :history="history"
    :time-zone="timeZone"
    :error-message="historyErrorMessage"
    @select-range="selectRange"
    @navigate="navigateRange"
    @edit="editTransaction"
    @delete="deleteTransaction"
  )

  span.ledger__error(v-if="categoryErrorMessage") {{ categoryErrorMessage }}
  span.ledger__error(v-if="transactionErrorMessage") {{ transactionErrorMessage }}
  span.ledger__empty(v-if="isCategoriesEmpty")
    | Create a category before recording transactions.
    router-link.ledger__category-link(:to="{ name: 'LedgerCategories' }") Manage categories

  LedgerTransactionForm(
    v-if="categories !== null && categories.length > 0"
    :categories="categories"
    :time-zone="timeZone"
    v-model:transaction="transaction"
    :submitting="transactionSubmitting"
    :error-message="formErrorMessage"
    :field-errors="formFieldErrors"
    @save="saveTransaction"
  )
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import ledger, { normalizeTransaction } from '@/ledger'
import { getCalendarRangeTimestampBounds, getCurrentDateTime } from '@/time'
import LedgerTransactions from '@/components/LedgerTransactions.vue'
import LedgerTransactionForm from '@/components/LedgerTransactionForm.vue'

const userStore = useUserStore()
const timeZone = computed(() => userStore.user.timezone)
const categories = ref(null)
const history = ref(null)
const range = ref('month')
const rangeOffset = ref(0)
const transactionSubmitting = ref(false)
const categoryErrorMessage = ref('')
const isCategoriesEmpty = computed(
  () => categories.value !== null && categories.value.length === 0 && !categoryErrorMessage.value,
)
const historyErrorMessage = ref('')
const transactionErrorMessage = ref('')
const formErrorMessage = ref('')
const formFieldErrors = ref({})
const transaction = ref(null)
let historyRequestNumber = 0

watch([range, rangeOffset, timeZone], () => loadHistory(), { immediate: true })

loadCategories()

async function loadCategories() {
  categoryErrorMessage.value = ''

  try {
    categories.value = await ledger.listCategories()
    if (!transaction.value && categories.value.length > 0) {
      resetTransaction()
    }
  } catch (error) {
    categoryErrorMessage.value = getErrorMessage(error, 'Unable to load categories.')
  }
}

async function loadHistory() {
  const currentRequestNumber = ++historyRequestNumber
  const { startAt, endAt } = getCalendarRangeTimestampBounds(
    range.value,
    timeZone.value,
    rangeOffset.value,
  )
  historyErrorMessage.value = ''

  try {
    const loadedHistory = await ledger.getHistory(startAt, endAt)
    if (currentRequestNumber !== historyRequestNumber) return

    history.value = loadedHistory
  } catch (error) {
    if (currentRequestNumber !== historyRequestNumber) return

    historyErrorMessage.value = getErrorMessage(error, 'Unable to load transactions.')
  }
}

function selectRange(selectedRange) {
  range.value = selectedRange
  rangeOffset.value = 0
  cancelTransactionEdit()
}

function navigateRange(offset) {
  const nextRangeOffset = rangeOffset.value + offset
  if (nextRangeOffset > 0) return

  rangeOffset.value = nextRangeOffset
}

function editTransaction(selectedTransaction) {
  transaction.value = normalizeTransaction(selectedTransaction, timeZone.value)
  clearTransactionErrors()
}

function cancelTransactionEdit() {
  if (!transaction.value || transaction.value.id === null) {
    clearTransactionErrors()
    return
  }

  resetTransaction()
  clearTransactionErrors()
}

function resetTransaction() {
  const defaultCategoryId = categories.value[0]?.id || ''

  transaction.value = {
    id: null,
    categoryId: defaultCategoryId,
    amountRubles: '',
    occurredAtLocal: getCurrentDateTime(timeZone.value),
  }
}

async function saveTransaction(submittedTransaction) {
  transactionSubmitting.value = true
  clearTransactionErrors()

  try {
    if (transaction.value.id !== null) {
      await ledger.updateTransaction(transaction.value.id, submittedTransaction, timeZone.value)
      resetTransaction()
    } else {
      await ledger.createTransaction(submittedTransaction, timeZone.value)
      resetTransaction()
    }

    await loadHistory()
  } catch (error) {
    formErrorMessage.value = getErrorMessage(error, 'Unable to save transaction.')
    formFieldErrors.value = ledger.getTransactionFieldErrors(error)
  } finally {
    transactionSubmitting.value = false
  }
}

async function deleteTransaction(selectedTransaction) {
  transactionErrorMessage.value = ''

  try {
    await ledger.deleteTransaction(selectedTransaction.id)
    if (transaction.value.id === selectedTransaction.id) {
      cancelTransactionEdit()
    }
    await loadHistory()
  } catch (error) {
    transactionErrorMessage.value = getErrorMessage(error, 'Unable to delete transaction.')
  }
}

function clearTransactionErrors() {
  transactionErrorMessage.value = ''
  formErrorMessage.value = ''
  formFieldErrors.value = {}
}

function getErrorMessage(error, fallbackMessage) {
  return error?.error || error?.message || fallbackMessage
}
</script>

<style>
.ledger {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 12px 24px;
}

.ledger__error {
  color: var(--color-red);
}

.ledger__empty {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
