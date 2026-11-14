<template lang="pug">
.ledger-transactions
  .ledger-transactions__heading
    h1.ledger-transactions__title Ledger
    router-link.ledger-transactions__categories(:to="{ name: 'LedgerCategories' }") Manage categories

  LedgerRangeSelector(
    :range="range"
    :range-offset="rangeOffset"
    :history="history"
    :time-zone="timeZone"
    @select-range="$emit('select-range', $event)"
    @navigate="$emit('navigate', $event)"
  )

  LedgerRangeStatistics(v-if="history" :history="history")

  span.ledger-transactions__error(v-if="errorMessage") {{ errorMessage }}
  span.ledger-transactions__empty(v-else-if="isTransactionsEmpty") No transactions in this range.

  .ledger-transactions__list(v-else-if="history")
    .ledger-transactions__day(v-for="day in transactionDays" :key="day.date")
      .ledger-transactions__day-heading(@click="toggleDay(day.date)")
        span.ledger-transactions__date {{ formatDay(day.date) }}
        span.ledger-transactions__amount.ledger-transactions__amount--expense
          | {{ ledger.formatAmount(day.spentKopecks) }}
        span.ledger-transactions__amount.ledger-transactions__amount--income
          | {{ formatIncomeAmount(day.incomeKopecks) }}

      .ledger-transactions__day-transactions(v-if="isDayExpanded(day.date)")
        .ledger-transactions__row(v-for="transaction in day.transactions" :key="transaction.id")
          span.ledger-transactions__occurred-at {{ formatTimeInTimezone(transaction.occurred_at, timeZone) }}
          span.ledger-transactions__amount(:class="getTransactionAmountModifier(transaction)")
            | {{ ledger.formatAmount(transaction.amount_kopecks) }}
          span.ledger-transactions__category {{ transaction.category_name }}
          .ledger-transactions__actions
            span.ledger-transactions__edit(@click="$emit('edit', transaction)") Edit
            span.ledger-transactions__delete(@click="$emit('delete', transaction)") Delete
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import ledger from '@/ledger'
import { formatTimeInTimezone, getCurrentDateTime } from '@/time'
import LedgerRangeSelector from '@/components/LedgerRangeSelector.vue'
import LedgerRangeStatistics from '@/components/LedgerRangeStatistics.vue'

const properties = defineProps({
  range: { type: String, required: true },
  rangeOffset: { type: Number, required: true },
  history: { type: Object, default: null },
  timeZone: { type: String, required: true },
  errorMessage: { type: String, default: '' },
})
const expandedDates = ref(new Set())
const isTransactionsEmpty = computed(
  () => properties.history !== null && properties.history.transactions.length === 0,
)
const transactionDays = computed(() => {
  if (!properties.history) return []

  const transactionsByDate = new Map()
  for (const transaction of properties.history.transactions) {
    const transactionDate = getTransactionDate(transaction.occurred_at)
    const dayTransactions = transactionsByDate.get(transactionDate) || []
    dayTransactions.push(transaction)
    transactionsByDate.set(transactionDate, dayTransactions)
  }

  return Array.from(transactionsByDate, ([date, transactions]) => ({
    date,
    transactions,
    spentKopecks: getSpentKopecks(transactions),
    incomeKopecks: getIncomeKopecks(transactions),
  })).sort((firstDay, secondDay) => secondDay.date.localeCompare(firstDay.date))
})

watch(
  [() => properties.history, () => properties.timeZone],
  () => {
    const currentDate = getCurrentDateTime(properties.timeZone).slice(0, 10)
    const containsCurrentDate = transactionDays.value.some((day) => day.date === currentDate)
    expandedDates.value = new Set()
    if (containsCurrentDate) expandedDates.value.add(currentDate)
  },
  { immediate: true },
)

defineEmits(['select-range', 'navigate', 'edit', 'delete'])

function formatDay(date) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeZone: 'UTC' }).format(
    new Date(`${date}T00:00:00Z`),
  )
}

function getTransactionDate(timestamp) {
  return Temporal.Instant.from(timestamp)
    .toZonedDateTimeISO(properties.timeZone)
    .toPlainDate()
    .toString()
}

function getSpentKopecks(transactions) {
  return transactions.reduce((totalKopecks, transaction) => {
    if (transaction.amount_kopecks >= 0) return totalKopecks

    return totalKopecks + transaction.amount_kopecks
  }, 0)
}

function getIncomeKopecks(transactions) {
  return transactions.reduce((totalKopecks, transaction) => {
    if (transaction.amount_kopecks <= 0) return totalKopecks

    return totalKopecks + transaction.amount_kopecks
  }, 0)
}

function formatIncomeAmount(amountKopecks) {
  if (amountKopecks === 0) return ledger.formatAmount(amountKopecks)

  return `+${ledger.formatAmount(amountKopecks)}`
}

function getTransactionAmountModifier(transaction) {
  if (transaction.amount_kopecks > 0) return 'ledger-transactions__amount--income'

  return 'ledger-transactions__amount--expense'
}

function isDayExpanded(date) {
  return expandedDates.value.has(date)
}

function toggleDay(date) {
  const nextExpandedDates = new Set(expandedDates.value)
  if (nextExpandedDates.has(date)) {
    nextExpandedDates.delete(date)
  } else {
    nextExpandedDates.add(date)
  }

  expandedDates.value = nextExpandedDates
}
</script>

<style>
.ledger-transactions,
.ledger-transactions__list,
.ledger-transactions__actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ledger-transactions__heading,
.ledger-transactions__actions,
.ledger-transactions__day-heading,
.ledger-transactions__row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ledger-transactions__heading {
  justify-content: space-between;
}

.ledger-transactions__title {
  margin: 0;
}

.ledger-transactions__day {
  border-bottom: 1px solid var(--color-3);
}

.ledger-transactions__day-heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 9ch 9ch;
  width: 100%;
  padding: 8px 0;
  color: var(--color-4);
  cursor: pointer;
}

.ledger-transactions__date {
  font-weight: bold;
}

.ledger-transactions__day-transactions {
  display: grid;
  grid-template-columns: max-content max-content minmax(0, 1fr) max-content;
  column-gap: 16px;
}

.ledger-transactions__row {
  display: grid;
  align-items: center;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  padding: 8px 0 8px 16px;
}

.ledger-transactions__occurred-at,
.ledger-transactions__category {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ledger-transactions__category {
  min-inline-size: 0;
  flex: 1;
}

.ledger-transactions__amount {
  font-weight: bold;
  text-align: right;
}

.ledger-transactions__actions {
  flex-direction: row;
}

.ledger-transactions__edit,
.ledger-transactions__delete {
  color: var(--color-4);
  cursor: pointer;
}

.ledger-transactions__amount--income {
  color: var(--color-green);
}

.ledger-transactions__amount--expense {
  color: var(--color-red);
}

.ledger-transactions__error,
.ledger-transactions__empty {
  color: var(--color-4);
}

.ledger-transactions__error {
  color: var(--color-red);
}
</style>
