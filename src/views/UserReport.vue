<template lang="pug">
.report
  input.report__input.report__date(v-model="report.date" type="text" placeholder="date")
  input.report__input.report__weight(v-model="report.weight" type="number" placeholder="weight")
  input.report__input.report__stepper(v-model="report.stepper" type="number" placeholder="stepper")
  input.report__input.report__dumbbell_sets(v-model="report.dumbbell_sets" type="number" placeholder="dumbbels sets")
  input.report__input.report__pullups(v-model="report.pullups" type="number" placeholder="pullups")
  input.report__input.report__protein(v-model="report.protein" type="number" placeholder="protein")
  input.report__input.report__fat(v-model="report.fat" type="number" placeholder="fat")
  input.report__input.report__carbs(v-model="report.carbs" type="number" placeholder="carbs")
</template>

<script setup>
import { reactive } from 'vue'

const report = reactive({
  date: (new Date).toLocaleDateString(),
  weight: null,
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
  margin-top: 1em
  box-sizing: border-box
  width: 80vw
  max-width: 40ch
  height: 3em
</style>
