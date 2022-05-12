<template lang="pug">
.report-form
  ReportInput(
    :value="report.date"
    :field="'date'"
    :placeholder="'xxxx-xx-xx'"
    @input="saveReport"
  )

  ReportInput(
    :value="report.weight"
    :field="'weight'"
    :placeholder="'xx.x'"
    @input="saveReport"
  )

  ReportInput(
    :value="report.steps"
    :field="'steps'"
    :placeholder="'xxxxx'"
    @input="saveReport"
  )

  ReportInput(
    :value="report.stepper"
    :field="'stepper'"
    :placeholder="'xxxx'"
    @input="saveReport"
  )

  ReportInput(
    :value="report.dumbbell_sets"
    :label="'dumbbells'"
    :field="'dumbbell_sets'"
    :placeholder="'x'"
    @input="saveReport"
  )

  ReportInput(
    :value="report.kettlebell_sets"
    :label="'kettlebell'"
    :field="'kettlebell_sets'"
    :placeholder="'x'"
    @input="saveReport"
  )

  ReportInput(
    :value="report.pullups"
    :field="'pullups'"
    :placeholder="'xx'"
    @input="saveReport"
  )

  ReportInput(
    :value="report.protein_meals"
    :label="'protein'"
    :field="'protein_meals'"
    :placeholder="'x'"
    @input="saveReport"
  )

  ReportInput(
    :value="report.fiber_meals"
    :label="'fiber'"
    :field="'fiber_meals'"
    :placeholder="'x'"
    @input="saveReport"
  )

  .report-form__updated-at {{ errorOrUpdatedAt }}
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import reportClient from '@/api/report-client'
import ReportInput from '@/components/ReportInput.vue'

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

const error = ref('')
const errorOrUpdatedAt = computed(() => {
  if (error.value) { return error.value }
  if (report.updated_at) { return parseUTC(report.updated_at) }

  return ' '
})

function parseUTC(datetime) {
  const localDateTime = (new Date(datetime + 'Z')).toLocaleString('ru-RU')
  return localDateTime.split(' ')[1]
}

function reloadReport(backendReport) {
  if (backendReport) { Object.assign(report, backendReport) }
}

async function getCurrentReport() {
  try {
    reloadReport(await reportClient.current())
  } catch {
    error.value = "🐗 can't fetch report"
  }
}

async function saveReport(field, value) {
  report[field] = value

  const backendReport = await reportClient.upsert({report})
  reloadReport(backendReport)
}

onMounted(async () => { await getCurrentReport() })
</script>

<style>
.report-form
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  height: 100vh

.report-form__updated-at
  color: #999
  font-size: 30px
</style>
