<template lang="pug">
form.ledger-transaction-form(@submit.prevent="submitTransaction")
  label.ledger-transaction-form__field
    span.ledger-transaction-form__label {{ timeZone }}
    input.ledger-transaction-form__input(
      v-model="form.occurredAtLocal"
      type="datetime-local"
      required
    )
    span.ledger-transaction-form__error(v-if="fieldErrors.occurredAtLocal") {{ fieldErrors.occurredAtLocal }}

  label.ledger-transaction-form__field
    span.ledger-transaction-form__label Amount
    input.ledger-transaction-form__input(
      v-model="form.amountRubles"
      type="number"
      step="1"
      autocomplete="off"
      placeholder="1000"
      required
    )
    span.ledger-transaction-form__error(v-if="fieldErrors.amountRubles") {{ fieldErrors.amountRubles }}

  label.ledger-transaction-form__field
    span.ledger-transaction-form__label Category
    select.ledger-transaction-form__input(
      v-model.number="form.categoryId"
      required
    )
      option(value="" disabled) Select a category
      option(v-for="category in categories" :key="category.id" :value="category.id") {{ category.name }}
    span.ledger-transaction-form__error(v-if="fieldErrors.categoryId") {{ fieldErrors.categoryId }}

  span.ledger-transaction-form__error(v-if="errorMessage") {{ errorMessage }}

  .ledger-transaction-form__actions
    button.ledger-transaction-form__submit(type="submit" :disabled="submitting || categories.length === 0")
      | {{ getSubmitLabel(transaction) }}
</template>

<script setup>
import { reactive, watch } from 'vue'
import { getTransactionForm } from '@/ledger'
import { getCurrentDateTime } from '@/time'

const props = defineProps({
  categories: { type: Array, required: true },
  timeZone: { type: String, required: true },
  transaction: { type: Object, default: null },
  submitting: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' },
  fieldErrors: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['save'])
const form = reactive({ categoryId: '', amountRubles: '', occurredAtLocal: '' })

watch(
  () => [props.transaction, props.timeZone, props.categories],
  ([transaction, timeZone, categories]) => {
    if (transaction) {
      Object.assign(form, getTransactionForm(transaction, timeZone))
      return
    }

    form.categoryId = categories[0]?.id || ''
    form.amountRubles = ''
    form.occurredAtLocal = getCurrentDateTime(timeZone)
  },
  { immediate: true },
)

function submitTransaction() {
  emit('save', { ...form })
}

function getSubmitLabel(transaction) {
  if (transaction) return 'Update'

  return 'Create'
}
</script>

<style>
.ledger-transaction-form {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  border: 1px solid var(--color-3);
  border-radius: 4px;
  background: var(--color-7);
}

.ledger-transaction-form__field {
  display: flex;
  flex: 0 1 auto;
  flex-direction: column;
  min-width: 0;
  gap: 4px;
}

.ledger-transaction-form__label {
  color: var(--color-4);
}

.ledger-transaction-form__input {
  min-width: 0;
  padding: 6px;
  border: 1px solid var(--color-3);
  border-radius: 4px;
  background: #fff;
}

.ledger-transaction-form__input[type='datetime-local'] {
  inline-size: max-content;
  max-inline-size: 100%;
}

.ledger-transaction-form__input[type='number'] {
  inline-size: calc(10ch + 14px);
  max-inline-size: 100%;
}

select.ledger-transaction-form__input {
  inline-size: max-content;
  max-inline-size: 100%;
}

.ledger-transaction-form__error {
  color: var(--color-red);
}

.ledger-transaction-form > .ledger-transaction-form__error {
  flex: 1 1 100%;
  min-width: 0;
  order: 2;
  overflow-wrap: anywhere;
}

.ledger-transaction-form__actions {
  display: flex;
  flex: 1 1 auto;
  align-self: flex-end;
  gap: 8px;
  order: 1;
}

.ledger-transaction-form__submit {
  flex: 1 1 auto;
  padding: 6px 10px;
  border: 1px solid var(--color-3);
  border-radius: 4px;
  background: var(--color-6);
  cursor: pointer;
}

.ledger-transaction-form__submit:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
