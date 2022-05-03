<template lang="pug">
.report
  input.report__input.report__date(
    :value="report.date"
    @input="updateReport('date', $event)"
    placeholder="date"
  )
  input.report__input.report__weight(
    :value="report.weight"
    @input="updateReport('weight', $event)"
    placeholder="weight"
  )
  input.report__input.report__steps(
    :value="report.steps"
    @input="updateReport('steps', $event)"
    placeholder="steps"
  )
  input.report__input.report__stepper(
    :value="report.stepper"
    @input="updateReport('stepper', $event)"
    placeholder="stepper"
  )
  input.report__input.report__dumbbell_sets(
    :value="report.dumbbell_sets"
    @input="updateReport('dumbbell_sets', $event)"
    placeholder="dumbbels sets"
  )
  input.report__input.report__pullups(
    :value="report.pullups"
    @input="updateReport('pullups', $event)"
    placeholder="pullups"
  )
  input.report__input.report__protein(
    :value="report.protein"
    @input="updateReport('protein', $event)"
    placeholder="protein"
  )
  input.report__input.report__fat(
    :value="report.fat"
    @input="updateReport('fat', $event)"
    placeholder="fat"
  )
  input.report__input.report__carbs(
    :value="report.carbs"
    @input="updateReport('carbs', $event)"
    placeholder="carbs"
  )
</template>

<script setup>
import { reactive } from 'vue'

function updateReport(field, event) {
  this.report[field] = event.target.value
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
  fat: null,
  carbs: null
})
</script>

<style>
.report
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  height: 100vh

.report__input
  margin-top: 2vh
  box-sizing: border-box
  width: 80vw
  max-width: 40ch
  height: 6vh
  padding: 0px 1ch
  appearance: none
  outline: none
  border: 1px solid #c2c9d6

.report__input:focus-within
  border: 1px solid #000
</style>
