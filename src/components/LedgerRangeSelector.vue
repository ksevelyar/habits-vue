<template lang="pug">
.ledger-range-selector
  .ledger-range-selector__controls
    .ledger-range-selector__options
      button.ledger-range-selector__option(
        type="button"
        :class="{ 'ledger-range-selector__option--selected': range === 'month' }"
        @click="$emit('select-range', 'month')"
      ) Month
      button.ledger-range-selector__option(
        type="button"
        :class="{ 'ledger-range-selector__option--selected': range === 'quarter' }"
        @click="$emit('select-range', 'quarter')"
      ) Quarter
      button.ledger-range-selector__option(
        type="button"
        :class="{ 'ledger-range-selector__option--selected': range === 'year' }"
        @click="$emit('select-range', 'year')"
      ) Year

    .ledger-range-selector__navigation
      button.ledger-range-selector__previous(type="button" @click="$emit('navigate', -1)") ←
      button.ledger-range-selector__next(
        v-if="rangeOffset < 0"
        type="button"
        @click="$emit('navigate', 1)"
      ) →

  span.ledger-range-selector__range(v-if="history")
    | {{ formatDateInTimezone(history.start_at, timeZone) }} – {{ formatDateInTimezone(history.end_at, timeZone) }}
</template>

<script setup>
import { formatDateInTimezone } from '@/time'

defineProps({
  range: { type: String, required: true },
  rangeOffset: { type: Number, required: true },
  history: { type: Object, default: null },
  timeZone: { type: String, required: true },
})

defineEmits(['select-range', 'navigate'])
</script>

<style>
.ledger-range-selector,
.ledger-range-selector__controls,
.ledger-range-selector__options,
.ledger-range-selector__navigation {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ledger-range-selector {
  flex-wrap: wrap;
  justify-content: space-between;
  color: var(--color-4);
}

.ledger-range-selector__option,
.ledger-range-selector__previous,
.ledger-range-selector__next {
  padding: 6px 10px;
  border: 1px solid var(--color-3);
  border-radius: 4px;
  background: var(--color-7);
  color: var(--color-4);
  cursor: pointer;
}

.ledger-range-selector__option--selected {
  background: var(--color-4);
  color: var(--color-7);
}
</style>
