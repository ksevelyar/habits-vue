<template lang="pug">
ol.reports-list
  li.reports-list__item(v-for="report in reports" :key="report.id") {{ report.date }} {{ report.id }}
</template>

<script setup>
import { ref, onMounted } from 'vue'
import reportClient from '@/api/report-client'

const reports = ref([])

async function getReportsList() {
  const backendReports = await reportClient.list()
  reports.value = backendReports
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

.reports-list__item
  width: 20ch
</style>
