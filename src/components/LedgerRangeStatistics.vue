<template lang="pug">
.ledger-range-statistics
  .ledger-range-statistics__visualization(v-if="expenseCategories.length > 0")
    svg.ledger-range-statistics__chart(viewBox="0 0 140 140")
      g(transform="translate(70 70)")
        path.ledger-range-statistics__slice(
          v-for="expenseCategory in expenseCategories"
          :key="expenseCategory.data.name"
          :d="getSlicePath(expenseCategory)"
          :fill="getCategoryColor(expenseCategory.data.name)"
        )
    .ledger-range-statistics__legend
      span.ledger-range-statistics__legend-label(
        v-for="expenseCategory in expenseCategories"
        :key="expenseCategory.data.name"
        :style="{ color: getCategoryColor(expenseCategory.data.name) }"
      ) {{ formatExpenseCategoryLabel(expenseCategory) }}
  span.ledger-range-statistics__empty(v-else) No expenses in this range.

  .ledger-range-statistics__totals
    .ledger-range-statistics__total
      span.ledger-range-statistics__total-label Balance:
      span.ledger-range-statistics__total-value(
        :class="getAmountColorModifier(history.balance_kopecks)"
      ) {{ ledger.formatAmount(history.balance_kopecks) }}
    .ledger-range-statistics__total
      span.ledger-range-statistics__total-label Spent:
      span.ledger-range-statistics__total-value(:class="getAmountColorModifier(spentKopecks)")
        | {{ ledger.formatAmount(spentKopecks) }}
    .ledger-range-statistics__total
      span.ledger-range-statistics__total-label Income:
      span.ledger-range-statistics__total-value(:class="getAmountColorModifier(incomeKopecks)")
        | {{ ledger.formatAmount(incomeKopecks) }}
</template>

<script setup>
import { computed } from 'vue'
import { arc, pie, scaleOrdinal } from 'd3'
import ledger from '@/ledger'

const properties = defineProps({
  history: { type: Object, required: true },
})

const pastelCategoryColors = ['#b86b86', '#6f98b9', '#79a97d', '#9981b0', '#c49462', '#a6a050']
const categoryColors = scaleOrdinal().range(pastelCategoryColors)
const expenseCategories = computed(() => {
  const expenseAmountsByCategory = new Map()

  for (const transaction of properties.history.transactions) {
    if (transaction.amount_kopecks >= 0) continue

    const previousAmount = expenseAmountsByCategory.get(transaction.category_name) || 0
    expenseAmountsByCategory.set(
      transaction.category_name,
      previousAmount - transaction.amount_kopecks,
    )
  }

  const categoryAmounts = Array.from(expenseAmountsByCategory, ([name, amount]) => ({
    name,
    amount,
  }))
  const createPie = pie().value((categoryAmount) => categoryAmount.amount)

  return createPie(categoryAmounts)
})
const spentKopecks = computed(() =>
  properties.history.transactions.reduce((totalKopecks, transaction) => {
    if (transaction.amount_kopecks >= 0) return totalKopecks

    return totalKopecks + transaction.amount_kopecks
  }, 0),
)
const incomeKopecks = computed(() =>
  properties.history.transactions.reduce((totalKopecks, transaction) => {
    if (transaction.amount_kopecks <= 0) return totalKopecks

    return totalKopecks + transaction.amount_kopecks
  }, 0),
)

function formatExpenseCategoryLabel(expenseCategory) {
  const spentKopecks = -expenseCategory.data.amount

  return `${expenseCategory.data.name} ${ledger.formatAmount(spentKopecks)}`
}

function getSlicePath(expenseCategory) {
  const donutHoleRadius = 35
  const donutOuterRadius = 69.5
  const createArc = arc().innerRadius(donutHoleRadius).outerRadius(donutOuterRadius)

  return createArc(expenseCategory)
}

function getCategoryColor(categoryName) {
  return categoryColors(categoryName)
}

function getAmountColorModifier(amountKopecks) {
  if (amountKopecks > 0) return 'ledger-range-statistics__total-value--income'
  if (amountKopecks < 0) return 'ledger-range-statistics__total-value--expense'

  return ''
}
</script>

<style>
.ledger-range-statistics {
  display: grid;
  grid-template-columns: minmax(0, 1fr) max-content;
  gap: 16px;
  align-items: start;
  padding: 12px;
  background: var(--color-7);
  border-radius: 4px;
}

.ledger-range-statistics__visualization {
  display: grid;
  grid-template-columns: minmax(0, 140px) minmax(0, 1fr);
  gap: 16px;
  align-items: start;
  min-width: 0;
}

.ledger-range-statistics__chart {
  display: block;
  width: 100%;
  max-width: 140px;
  aspect-ratio: 1;
}

.ledger-range-statistics__slice {
  stroke: var(--color-7);
  stroke-width: 1px;
}

.ledger-range-statistics__legend {
  display: grid;
  align-content: start;
  gap: 8px;
  min-width: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.ledger-range-statistics__legend-label,
.ledger-range-statistics__totals {
  font-size: 1.4em;
  line-height: 1;
}

.ledger-range-statistics__legend-label {
  overflow-wrap: anywhere;
}

.ledger-range-statistics__totals {
  display: grid;
  grid-template-columns: max-content max-content;
  gap: 8px;
  font-variant-numeric: tabular-nums;
}

.ledger-range-statistics__total {
  display: contents;
}

.ledger-range-statistics__total-value {
  text-align: right;
}

.ledger-range-statistics__total-value--income {
  color: var(--color-green);
}

.ledger-range-statistics__total-value--expense {
  color: var(--color-red);
}

.ledger-range-statistics__empty {
  color: var(--color-4);
}
</style>
