<template lang="pug">
.ledger
  LedgerTransactions(
    :period="period"
    :period-offset="periodOffset"
    :history="history"
    :time-zone="timeZone"
    :loading="historyLoading"
    :error-message="historyErrorMessage"
    @select-period="selectPeriod"
    @navigate="navigatePeriod"
    @edit="editTransaction"
    @delete="deleteTransaction"
  )

  span.ledger__error(v-if="categoryErrorMessage") {{ categoryErrorMessage }}
  span.ledger__error(v-if="transactionErrorMessage") {{ transactionErrorMessage }}
  span.ledger__loading(v-if="categoriesLoading") Loading categories…
  span.ledger__empty(v-else-if="categories.length === 0 && !categoryErrorMessage")
    | Create a category before recording transactions.
    router-link.ledger__category-link(:to="{ name: 'LedgerCategories' }") Manage categories

  LedgerTransactionForm(
    v-else
    :categories="categories"
    :time-zone="timeZone"
    :transaction="editingTransaction"
    :submitting="transactionSubmitting"
    :error-message="formErrorMessage"
    :field-errors="formFieldErrors"
    @save="saveTransaction"
  )
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import ledger from '@/ledger'
import { getCalendarPeriodAnchorDate } from '@/time'
import LedgerTransactions from '@/components/LedgerTransactions.vue'
import LedgerTransactionForm from '@/components/LedgerTransactionForm.vue'

const userStore = useUserStore()
const timeZone = computed(() => userStore.user.timezone || 'UTC')
const categories = ref([])
const history = ref(null)
const period = ref('month')
const periodOffset = ref(0)
const categoriesLoading = ref(true)
const historyLoading = ref(false)
const transactionSubmitting = ref(false)
const categoryErrorMessage = ref('')
const historyErrorMessage = ref('')
const transactionErrorMessage = ref('')
const formErrorMessage = ref('')
const formFieldErrors = ref({})
const editingTransaction = ref(null)
let historyRequestNumber = 0

watch([period, periodOffset, timeZone], () => loadHistory(), { immediate: true })

loadCategories()

async function loadCategories() {
  categoriesLoading.value = true
  categoryErrorMessage.value = ''

  try {
    categories.value = await ledger.listCategories()
  } catch (error) {
    categoryErrorMessage.value = getErrorMessage(error, 'Unable to load categories.')
  } finally {
    categoriesLoading.value = false
  }
}

async function loadHistory() {
  const currentRequestNumber = ++historyRequestNumber
  const anchorDate = getCalendarPeriodAnchorDate(period.value, timeZone.value, periodOffset.value)
  historyLoading.value = true
  historyErrorMessage.value = ''

  try {
    const loadedHistory = await ledger.getHistory(period.value, anchorDate)
    if (currentRequestNumber !== historyRequestNumber) return

    history.value = loadedHistory
  } catch (error) {
    if (currentRequestNumber !== historyRequestNumber) return

    historyErrorMessage.value = getErrorMessage(error, 'Unable to load transactions.')
  } finally {
    if (currentRequestNumber === historyRequestNumber) {
      historyLoading.value = false
    }
  }
}

function selectPeriod(selectedPeriod) {
  period.value = selectedPeriod
  periodOffset.value = 0
  cancelTransactionEdit()
}

function navigatePeriod(offset) {
  const nextPeriodOffset = periodOffset.value + offset
  if (nextPeriodOffset > 0) return

  periodOffset.value = nextPeriodOffset
}

function editTransaction(transaction) {
  editingTransaction.value = transaction
  clearTransactionErrors()
}

function cancelTransactionEdit() {
  editingTransaction.value = null
  clearTransactionErrors()
}

async function saveTransaction(transactionForm) {
  transactionSubmitting.value = true
  clearTransactionErrors()

  try {
    if (editingTransaction.value) {
      await ledger.updateTransaction(editingTransaction.value.id, transactionForm, timeZone.value)
    } else {
      await ledger.createTransaction(transactionForm, timeZone.value)
    }

    editingTransaction.value = null
    await loadHistory()
  } catch (error) {
    formErrorMessage.value = getErrorMessage(error, 'Unable to save transaction.')
    formFieldErrors.value = ledger.getTransactionFieldErrors(error)
  } finally {
    transactionSubmitting.value = false
  }
}

async function deleteTransaction(transaction) {
  transactionErrorMessage.value = ''

  try {
    await ledger.deleteTransaction(transaction.id)
    if (editingTransaction.value?.id === transaction.id) {
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
