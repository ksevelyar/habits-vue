<template lang="pug">
table.reports-list
  tbody
    tr.reports-list__row
      td.reports-list__head date
      td.reports-list__head w
      td.reports-list__head sl
      td.reports-list__head steps
      td.reports-list__head sr
      td.reports-list__head kb
      td.reports-list__head pu
      td.reports-list__head p
      td.reports-list__head f
    tr.reports-list__row(v-for="report in reports" :key="report.id")
      ReportsListItem(:value="contractDate(report.date)")
      ReportsListItem(:value="report.weight")
      ReportsListItem(:value="report.sleep")
      ReportsListItem(:value="report.steps")
      ReportsListItem(:value="report.stepper")
      ReportsListItem(:value="report.kettlebell_sets")
      ReportsListItem(:value="report.pullups")
      ReportsListItem(:value="report.protein_meals")
      ReportsListItem(:value="report.fiber_meals")
</template>

<script setup>
import { ref, onMounted } from 'vue'
import reportClient from '@/api/report-client'
import ReportsListItem from '@/components/ReportsListItem.vue'

const reports = ref([])

async function getReportsList() {
  const backendReports = await reportClient.list()
  reports.value = backendReports
}

function contractDate(date) {
  const [_year, month, day] = date.split('-')
  return `${month}-${day}`
}

onMounted(async () => { await getReportsList() })
</script>

<style>
.reports-list
  margin: 0
  padding: 0
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  height: 100vh

.reports-list__head
  color: var(--color-3)
  font-size: 30px
  padding: 0 1ch
</style>
