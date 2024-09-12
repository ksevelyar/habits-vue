<template lang="pug">
table.metrics-history
  tr
    th.metrics-history__head date
    th.metrics-history__head(v-for="chain in chainsHistory") {{ chain.name }}

  tr(v-for="(metrics, date) in metricsHistory")
    td {{ date }}
    td(v-for="chain in chainsHistory")
      | {{ historyValue(metrics, chain) }}


MetricForm(v-for="metric in metrics" :metric="metric" :date="date")
</template>

<script setup>
import { ref } from 'vue'
import metricClient from '@/api/metric-client'
import router from '@/router'
import MetricForm from '@/components/MetricForm.vue'

// generate metrics from chains
const metrics = ref([])
const metricsHistory = ref([])
const chainsHistory = ref([])

const [date,] = new Date().toISOString().split('T')

const getList = async () => {
  metrics.value = (await metricClient.index(date))
}
const getHistory = async () => {
  const {metrics, chains} = (await metricClient.history())

  metricsHistory.value = metrics
  chainsHistory.value = chains
}

const historyValue = (metrics, chain) => metrics[chain.id]?.value

getList()
getHistory()

// set interval for seconds until next date
</script>

<style lang="sss">
.metrics-history__head
  text-align: left
  background: #c7c7c7
  border: 1px solid #aaa
  padding: 5px
</style>
