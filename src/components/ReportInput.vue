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
import { ref } from 'vue'
import reportClient from '@/api/report-client'

const emit = defineEmits(['input'])

const props = defineProps({
  label: {type: String, default: null},
  placeholder: {type: String, default: 'x'},
  field: {type: String, default: 'field'},
  value: {type: [String, Number], default: null},
  readonly: {type: Boolean, default: false},
})

function labelOrField() { return props.label || props.field }

function bemName() {
  return `report-input__${props.field}`
}

async function emitInput(event) {
  // TODO: debounce
  emit('input', props.field, event.target.value)
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
  color: #575757
  box-sizing: border-box
  font-size: 30px
  width: 88vw
  max-width: 24ch
  height: 6vh
  padding: 0px 1ch
  appearance: none
  outline: none
  border: 1px solid #c2c9d6
  background: #d7d7d7
  margin-bottom: 10px

.report-input__input::placeholder
  color: #afb1b3

.report-input__input:focus-within
  border: 1px solid #999
  background: #dfdfdf
</style>
