<template lang="pug">
.report-form
  .report-form__input-group
    label.report-form__label date
    input.report-form__input.report-form__date(
      :value="report.date"
      @input="saveReport('date', $event)"
      placeholder="xxxx-xx-xx"
    )

  .report-form__input-group
    label.report-form__label weight
    input.report-form__input(
      :value="report.weight"
      @input="saveReport('weight', $event)"
      placeholder="xx.x"
    )

  .report-form__input-group
    label.report-form__label steps
    input.report-form__input(
      :value="report.steps"
      @input="saveReport('steps', $event)"
      placeholder="xxxxx"
    )

  .report-form__input-group
    label.report-form__label stepper
    input.report-form__input(
      :value="report.stepper"
      @input="saveReport('stepper', $event)"
      placeholder="xxxx"
    )

  .report-form__input-group
    label.report-form__label dumbbells
    input.report-form__input(
      :value="report.dumbbell_sets"
      @input="saveReport('dumbbell_sets', $event)"
      placeholder="x"
    )

  .report-form__input-group
    label.report-form__label kettlebell
    input.report-form__input(
      :value="report.kettlebell_sets"
      @input="saveReport('kettlebell_sets', $event)"
      placeholder="x"
    )

  .report-form__input-group
    label.report-form__label pullups
    input.report-form__input(
      :value="report.pullups"
      @input="saveReport('pullups', $event)"
      placeholder="xx"
    )

  .report-form__input-group
    label.report-form__label protein
    input.report-form__input(
      :value="report.protein_meals"
      @input="saveReport('protein_meals', $event)"
      placeholder="x"
    )

  .report-form__input-group
    label.report-form__label fiber
    input.report-form__input(
      :value="report.fiber_meals"
      @input="saveReport('fiber_meals', $event)"
      placeholder="x"
    )

  .report-form__updated-at(v-show="report.updated_at") {{ parseUTC(report.updated_at) }}
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import reportClient from '@/api/report-client'

function parseUTC(datetime) {
  const localDateTime = (new Date(datetime + 'Z')).toLocaleString('ru-RU')
  return localDateTime.split(' ')[1]
}

function reloadReport(backendReport) {
  if (backendReport) { Object.assign(report, backendReport) }
}

async function getCurrentReport() {
  reloadReport(await reportClient.current())
}

async function saveReport(field, event) {
  this.report[field] = event.target.value

  const backendReport = await reportClient.upsert({report: this.report})
  reloadReport(backendReport)
}

const kebabCase = 'fr-CA'
const report = reactive({
  date: (new Date).toLocaleDateString(kebabCase),
  weight: null,
  steps: null,
  stepper: null,
  dumbbell_sets: null,
  pullups: null,
  protein_meals: null,
  fiber_meals: null,
  updated_at: ''
})

onMounted(async () => { await getCurrentReport() })
</script>

<style>
.report-form
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
  width: 88vw
  max-width: 24ch
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

.report-form__updated-at
  color: #999
  font-size: 30px
</style>
