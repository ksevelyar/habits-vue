<template lang="pug">
.report-input
  label.report-input__label {{ labelOrField() }}
  input.report-input__input(
    :value="value"
    :class.once="bemName()"
    @input="emitInput"
    :placeholder.once="placeholder"
    :readonly="readonly"
  )
</template>


<script setup>
const emit = defineEmits(['input'])

const props = defineProps({
  label: { type: String, default: null },
  placeholder: { type: String, default: 'x' },
  field: { type: String, default: 'field' },
  value: { type: [String, Number], default: null },
  readonly: { type: Boolean, default: false },
})

function labelOrField() { return props.label || props.field }

function bemName() {
  return `report-input__${props.field}`
}

let debounceTimer = null
function emitInput(event) {
  const debounceDelay = 300

  if (debounceTimer) { clearTimeout(debounceTimer) }

  debounceTimer = setTimeout(() => emit('input', props.field, event.target.value), debounceDelay)
}
</script>

<style>
.report-input
  position: relative

.report-input__label
  color: #afb1b3
  pointer-events: none
  font-size: 30px
  height: 6vh
  position: absolute
  right: 1ch
  line-height: 6vh

.report-input__input
  color: var(--color-4)
  box-sizing: border-box
  font-size: 30px
  width: 88vw
  max-width: 24ch
  height: 6vh
  padding: 0px 1ch
  appearance: none
  outline: none
  border: 1px solid var(--color-3)
  background: var(--color-6)
  margin-bottom: 10px

.report-input__input::placeholder
  color: var(--color-3)

.report-input__input:focus-within
  border: 1px solid var(--color-2)
  background: var(--color-7)
</style>
