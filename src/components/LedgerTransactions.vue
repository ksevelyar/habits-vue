<template lang="pug">
.ledger-transactions
  .ledger-transactions__heading
    h1.ledger-transactions__title Ledger
    router-link.ledger-transactions__categories(:to="{ name: 'LedgerCategories' }") Manage categories

  .ledger-transactions__controls
    .ledger-transactions__periods
      button.ledger-transactions__period(
        v-for="periodOption in periodOptions"
        :key="periodOption.value"
        type="button"
        :class="{ 'ledger-transactions__period--selected': period === periodOption.value }"
        @click="$emit('select-period', periodOption.value)"
      ) {{ periodOption.label }}

    .ledger-transactions__navigation
      button.ledger-transactions__previous(
        type="button"
        @click="$emit('navigate', -1)"
      ) ←
      button.ledger-transactions__next(
        v-if="periodOffset < 0"
        type="button"
        @click="$emit('navigate', 1)"
      ) →

  .ledger-transactions__summary(v-if="history")
    span.ledger-transactions__range
      | {{ formatDateInTimezone(history.start_at, timeZone) }} – {{ formatDateInTimezone(history.end_at, timeZone) }}
    span.ledger-transactions__balance Balance: {{ ledger.formatAmount(history.balance_kopecks) }}

  span.ledger-transactions__error(v-if="errorMessage") {{ errorMessage }}
  span.ledger-transactions__loading(v-else-if="loading") Loading transactions…
  span.ledger-transactions__empty(v-else-if="history && history.transactions.length === 0") No transactions in this period.

  .ledger-transactions__list(v-else-if="history")
    .ledger-transactions__row(
      v-for="transaction in history.transactions"
      :key="transaction.id"
      :class="getTransactionModifier(transaction)"
    )
      span.ledger-transactions__occurred-at {{ formatTimestampInTimezone(transaction.occurred_at, timeZone) }}
      span.ledger-transactions__amount {{ ledger.formatAmount(transaction.amount_kopecks) }}
      span.ledger-transactions__category {{ transaction.category_name }}
      .ledger-transactions__actions
        button.ledger-transactions__edit(type="button" @click="$emit('edit', transaction)") Edit
        button.ledger-transactions__delete(type="button" @click="$emit('delete', transaction)") Delete
</template>

<script setup>
import ledger from '@/ledger'
import { formatDateInTimezone, formatTimestampInTimezone } from '@/time'

const periodOptions = [
  { value: 'month', label: 'Month' },
  { value: 'quarter', label: 'Quarter' },
  { value: 'year', label: 'Year' },
]

defineProps({
  period: { type: String, required: true },
  periodOffset: { type: Number, required: true },
  history: { type: Object, default: null },
  timeZone: { type: String, required: true },
  loading: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' },
})

defineEmits(['select-period', 'navigate', 'edit', 'delete'])

function getTransactionModifier(transaction) {
  if (transaction.amount_kopecks > 0) return 'ledger-transactions__row--income'

  return 'ledger-transactions__row--expense'
}
</script>

<style>
.ledger-transactions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ledger-transactions__heading,
.ledger-transactions__controls,
.ledger-transactions__periods,
.ledger-transactions__navigation,
.ledger-transactions__summary,
.ledger-transactions__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ledger-transactions__heading,
.ledger-transactions__controls,
.ledger-transactions__summary {
  justify-content: space-between;
}

.ledger-transactions__title {
  margin: 0;
}

.ledger-transactions__period,
.ledger-transactions__previous,
.ledger-transactions__next,
.ledger-transactions__edit,
.ledger-transactions__delete {
  padding: 6px 10px;
  border: 1px solid var(--color-3);
  border-radius: 4px;
  background: var(--color-7);
  color: var(--color-4);
  cursor: pointer;
}

.ledger-transactions__period--selected {
  background: var(--color-4);
  color: var(--color-7);
}

.ledger-transactions__summary {
  flex-wrap: wrap;
  color: var(--color-4);
}

.ledger-transactions__balance {
  font-size: 1.2em;
}

.ledger-transactions__list {
  display: grid;
  grid-template-columns: max-content max-content minmax(0, 1fr) max-content;
  column-gap: 8px;
}

.ledger-transactions__row {
  display: grid;
  align-items: center;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  column-gap: 16px;
  border-bottom: 1px solid var(--color-3);
}

.ledger-transactions__occurred-at,
.ledger-transactions__amount,
.ledger-transactions__category,
.ledger-transactions__actions {
  overflow: hidden;
  padding-block: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ledger-transactions__category {
  min-inline-size: 0;
}

.ledger-transactions__amount {
  font-weight: bold;
  text-align: right;
}

.ledger-transactions__row--income .ledger-transactions__amount {
  color: var(--color-green);
}

.ledger-transactions__row--expense .ledger-transactions__amount {
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
