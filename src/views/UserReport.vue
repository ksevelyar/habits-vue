<template lang="pug">
.report
  input.report__input.report__date(
    :value="report.date"
    type="text"
    placeholder="date"
  )
  input.report__input.report__weight(
    v-model.number="report.weight"
    type="number"
    placeholder="weight"
  )
  input.report__input.report__steps(
    v-model.number="report.steps"
    type="number"
    placeholder="steps"
  )
  input.report__input.report__stepper(
    v-model.number="report.stepper"
    type="number"
    placeholder="stepper"
  )
  input.report__input.report__dumbbell_sets(
    v-model.number="report.dumbbell_sets"
    type="number"
    placeholder="dumbbels sets"
  )
  input.report__input.report__pullups(
    v-model.number="report.pullups"
    type="number"
    placeholder="pullups"
  )
  input.report__input.report__protein(
    v-model.number="report.protein"
    type="number"
    placeholder="protein"
  )
  input.report__input.report__fat(
    v-model.number="report.fat"
    type="number"
    placeholder="fat"
  )
  input.report__input.report__carbs(
    v-model.number="report.carbs"
    type="number"
    placeholder="carbs"
  )
</template>

<script setup>
import { reactive } from 'vue'

const report = reactive({
  date: (new Date).toLocaleDateString('en-US'),
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
</style>
