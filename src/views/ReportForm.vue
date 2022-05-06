<template lang="pug">
.report
  .report-form__input-group
    label.report-form__label date
    input.report-form__input.report-form__date(
      :value="report.date"
      @input="updateReport('date', $event)"
      placeholder="xxxx-xx-xx"
    )

  .report-form__input-group
    label.report-form__label weight
    input.report-form__input.report-form__weight(
      :value="report.weight"
      @input="updateReport('weight', $event)"
      placeholder="xx.x"
    )

  .report-form__input-group
    label.report-form__label steps
    input.report-form__input.report-form__steps(
      :value="report.steps"
      @input="updateReport('steps', $event)"
      placeholder="xxxxx"
    )

  .report-form__input-group
    label.report-form__label stepper
    input.report-form__input.report-form__stepper(
      :value="report.stepper"
      @input="updateReport('stepper', $event)"
      placeholder="xxxx"
    )

  .report-form__input-group
    label.report-form__label dumbbell sets
    input.report-form__input.report-form__dumbbell_sets(
      :value="report.dumbbell_sets"
      @input="updateReport('dumbbell_sets', $event)"
      placeholder="x"
    )

  .report-form__input-group
    label.report-form__label pullups
    input.report-form__input.report-form__pullups(
      :value="report.pullups"
      @input="updateReport('pullups', $event)"
      placeholder="xx"
    )

  .report-form__input-group
    label.report-form__label protein
    input.report-form__input.report-form__protein(
      :value="report.protein"
      @input="updateReport('protein', $event)"
      placeholder="x"
    )

  .report-form__input-group
    label.report-form__label fiber
    input.report-form__input.report-form__carbs(
      :value="report.fiber"
      @input="updateReport('fiber', $event)"
      placeholder="x"
    )
</template>

<script setup>
import { reactive } from 'vue'
import reportClient from '@/api/report-client'

function updateReport(field, event) {
  this.report[field] = event.target.value

  reportClient.upsert(this.report)
}

const kebabCase = 'fr-CA'
const report = reactive({
  date: (new Date).toLocaleDateString(kebabCase),
  weight: null,
  steps: null,
  stepper: null,
  dumbbell_sets: null,
  pullups: null,
  protein: null,
  fiber: null,
})
</script>

<style>
.report
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  height: 100vh

.report-form__input-group
  position: relative

.report-form__label
  color: #afb1b3
  pointer-events: none
  font-size: 30px
  height: 6vh
  position: absolute
  right: 1ch
  line-height: 6vh

.report-form__input::placeholder
  color: #afb1b3

.report-form__input
  color: #575757
  box-sizing: border-box
  font-size: 30px
  width: 80vw
  max-width: 30ch
  height: 6vh
  padding: 0px 1ch
  appearance: none
  outline: none
  border: 1px solid #c2c9d6
  background: #d7d7d7
  margin-bottom: 10px

.report-form__input:focus-within
  border: 1px solid #999
  background: #dfdfdf
</style>
